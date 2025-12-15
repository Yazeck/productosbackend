import { z } from "zod";

// Item del carrito
export const cartItemSchema = z.object({
    productId: z
        .string({ required_error: "El id del producto es requerido" })
        .min(1, { message: "El id del producto no es válido" }),

    quantity: z.coerce
        .number({ required_error: "Cantidad de producto requerida" })
        .int({ message: "La cantidad debe ser un número entero" })
        .positive({ message: "La cantidad debe ser mayor a 0" }),

    price: z.coerce
        .number({ required_error: "Precio del producto requerido" })
        .min(0, { message: "El precio debe ser mayor o igual a 0" }),
});

// Detalles de tarjeta
export const cardDetailSchema = z.object({
    cardName: z
        .string({ required_error: "El nombre de la tarjeta es requerido" })
        .trim()
        .min(3, { message: "El nombre de la tarjeta debe tener al menos 3 caracteres" }),

    cardNumber: z
        .string({ required_error: "Número de tarjeta requerido" })
        .trim()
        .regex(/^\d{12,19}$/, { message: "Número de tarjeta inválido (12-19 dígitos)" }),

    ccv: z
        .string({ required_error: "CCV requerido" })
        .trim()
        .regex(/^\d{3,4}$/, { message: "CCV inválido (3-4 dígitos)" }),

    expirationDate: z
        .string({ required_error: "Fecha de expiración requerida" })
        .trim()
        .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: "Formato inválido (MM/YY)" }),
});

//esquema para la direccion del envio:
const shippingAddressSchema = z.object({
    address: z.string('La dirección es requerida')
        .min(5, {
            error: 'La dirección debe tener al menos 5 caracteres'
        })
        .trim(),

    name: z.string('El nombre es requerido')
        .min(3, {
            error: 'El nombre debe tener al menos 3 caracteres'
        })
        .trim(),

    phone: z.string('El teléfono es requerido')
        .min(7, {
            error: 'El teléfono debe tener al menos 7 caracteres'
        })
        .max(20, {
            error: 'El teléfono no puede exceder 20 caracteres'
        })
        .regex(/^[\d\s\+\-\(\)]{7,20}$/, 'Número de teléfono inválido')
        .trim(),
});
// Esquema para la información de pago
const paymentMethodSchema = z.discriminatedUnion('method', [
    z.object({
        method: z.literal('card'),
        cardDetails: cardDetailSchema,
        shippingAddress: shippingAddressSchema,
    }),
    z.object({
        method: z.enum(['pickup']),
        userName: z.string('El nombre es requerido')
            .min(3, {
                error: 'El nombre debe tener al menos 3 caracteres'
            })
            .trim(),
    }),
]);

// Esquema principal para la orden de compra
export const orderSchema = z.object({
    items: z.array(cartItemSchema)
        .min(1, 'La orden debe tener al menos un producto'),

    // Método de envío para discriminar la unión (card o pickup pero no ambos)
    paymentMethod: paymentMethodSchema,

    // Campos para el cálculo del total de productos y precio de la orden
    subTotal: z.string()
        .transform((val) => parseFloat(val))
        .pipe(
            z.number('Subtotal requerido')
                .min(0, { error: 'Subtotal debe ser mayor o igual a 0' })
                .refine(
                    (val) => !isNaN(val),
                    { error: 'Subtotal debe ser un número válido' }
                )
        ),

    iva: z.string()
        .transform((val) => parseFloat(val))
        .pipe(
            z.number('Iva requerido')
                .min(0, { error: 'Iva debe ser mayor o igual a 0' })
                .refine(
                    (val) => !isNaN(val),
                    { error: 'Iva debe ser un número válido' }
                )
        ),
    total: z.string()
        .transform((val) => parseFloat(val))
        .pipe(
            z.number('Total del pedido requerido')
                .min(1, { error: 'El total del pedido debe ser mayor a cero' })
                .refine((val) => !isNaN(val), { error: 'Total del pedido debe ser un número válido' })
        ),

    totalProducts: z.string()
        .transform((val) => parseFloat(val))
        .pipe(
            z.number()
                .int({ error: 'Total de productos requerido' })
                .min(0, { error: 'La orden debe tener al menos un producto' })
                .refine((val) => !isNaN(val), { error: 'Total de productos debe ser un número válido' })
        ),
    //Datos para el estado del pedido y la fecha y hora de creación
    status: z.enum(['received', 'confirmed', 'cancelled', 'delivered'])
        .default('received'),
    createdAt: z.date().optional(),
})
    .superRefine((data, ctx) => {
        //Validación personalizada: Subtotal + iva = total
        const calculatedTotal = data.subTotal + data.iva;
        if (Math.abs(calculatedTotal - data.total) > 0.01) {
            ctx.addIssue({
                code: z.ZodCustom,
                message: `El total de calculado (${calculatedTotal}) no coincide con el total proporcionado (${data.total})`,
                path: ['total']
            });
        }

        //Validación personalizada: totalProducts debe ser igual a la suma de las cantidades
        const calculatedProducts = data.items.reduce((sum, item) => sum + item.quantity, 0);
        if (calculatedProducts !== data.totalProducts) {
            ctx.addIssue({
                code: z.ZodCustom,
                message: `El total de productos calculado (${calculatedProducts}) no coincide con el valor proporcionado (${data.totalProducts})`,
                path: ['totalProducts']
            });
        }

    });
