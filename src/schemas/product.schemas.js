import {z} from 'zod';

export const productSchema = z.object ({
    name: z.string('El nombre del producto es requerido'),
    price: z.string()
            .transform ( (val)=>parseFloat(val))
            .pipe ( 
                z.number('El precio del producto es requerido')
                .positive('El numero debe ser mayor a 0')
                .refine( (val)=>!isNaN(val), {error: 'El precio debe ser un número valido'})
            ),
            
    quantity: z.string()
            .transform ( (val)=>parseInt(val))
            .pipe ( 
                z.int('Cantidad del producto es requerido')
                .min(0,'La cantidad de productos debe ser mayor o igual a 0')
                .refine( (val)=>!isNaN(val), {error: 'La cantidad debe ser un número valido'})
            ),
    
});//Fin de productSchema

export const productUpdateSchema = z.object({
    name: z.string('Nombre del producto requerido'),
    price: z.number('Precio del producto requerido')
            .positive('El numeroo debe ser mayor a 0')
            .refine( (val)=>!isNaN(val), {error: 'El precio debe ser un numero valido'}),
    quantity: z.number()
                .int({error: 'Cantidad del precio requerida'})
                .min(0, {error: 'La cantidad debe ser mayor o igual a 0'})
                .refine( (val)=>!isNaN(val), {error: 'La cantidad debe ser un número valido'}),
    image: z.string('Url de la imagen requerida')
});//Fin de productUpdateSchema