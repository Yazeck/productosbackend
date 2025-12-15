import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {
    getProducts,
    createProduct,
    getProduct,
    deleteProduct,
    updateProductWithImage,
    updateProductWithoutImage,
    getAllProducts
} from '../controllers/products.controller.js';

//Importamos el validationSchema
import { validateSchema } from '../middlewares/validateSchemas.js';

//Importamos los schemas de validación
import { productSchema, productUpdateSchema } from '../schemas/product.schemas.js';

//Importamos el middleware para subir imagenes a cloudinary
import { uploadToCloudinary } from '../middlewares/uploadImage.js';

import { isAdmin } from '../middlewares/isAdmin.js';
import { validateId } from '../middlewares/validateId.js';

const router = Router();

//Ruta para obtener todos los productos para la compra
router.get('/products/getallproducts', authRequired, getAllProducts)

//Ruta para obtener los productos
router.get('/products', authRequired, isAdmin, getProducts);

//Ruta para crear un producto
router.post(
    '/products',
    authRequired,
    uploadToCloudinary,   // primero procesamos imagen + body
    isAdmin,              // ya existe req.user
    validateSchema(productSchema),
    createProduct
);

//Ruta para obtener un producto por id
router.get('/products/:id', validateId, authRequired, isAdmin, getProduct);

//Ruta para eliminar un producto
router.delete('/products/:id', validateId, authRequired, isAdmin, deleteProduct);

//Ruta para actualizar un producto sin actualizar la imagen
router.put('/products/:id', validateId, authRequired, isAdmin,
    validateSchema(productUpdateSchema), updateProductWithoutImage);

//Ruta para actualizar un producto CAMBIANDO la imagen
router.put('/products/updateWithImage/:id', validateId, authRequired, isAdmin, uploadToCloudinary,
    validateSchema(productSchema), updateProductWithImage);


export default router;