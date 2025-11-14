import { z } from 'zod';

export const productSchema = z.object({
    name: z.string('Nombre del producto requerido'),

    price: z.string()
        .transform((val) => parseFloat(val))
        .pipe(
            z.number('Precio del producto es requerido')
                .positive('El precio del producto debe ser mayor a 0')
                .refine((val) => !isNaN(val), { error: 'El precio debe ser un número válido' })
        ),



    quantity: z.string()
        .transform((val) => parseInt(val))
        .pipe(
            z.number('La cantidad del producto es requerida')
                .min(0, { error: 'La cantidad de prodicto debe ser mayor o igual a 0' })
                .refine((val) => !isNaN(val), { error: 'La cantidad debe ser un numero valido' })
        )
}); // Fin de productSchema


export const productUpdateSchema = z.object({
    name: z.string('Nombre del producto requerido'),
    price: z.number('Precio del producto es requerido')
        .positive('El precio del producto debe ser mayor a 0')
        .refine((val) => !isNaN(val), { error: 'El precio debe ser un número válido' }),
    quantity: z.number()
        .int({ error: 'La cantidad del producto requerida' })
        .min(0, { error: 'La cantidad de prodicto debe ser mayor o igual a 0' })
        .refine((val) => !isNaN(val), { error: 'La cantidad debe ser un numero valido' }),
    image: z.string('La URL de la imagen es requerida')
}); // Fin de productUpdateSchema