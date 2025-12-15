import Product from '../models/product.models.js';
import { v2 as cloudinary } from 'cloudinary';


//Funcion para obtener todos los productos
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ user: req.user.id });

        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({ message: ['Error al obtener los productos'] })
    }

};//Fin de getProducts

//Funcion para crear productos
export const createProduct = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400)
                .json({ message: ['Error al crear un producto, no se encontro la imagen'] })
        }
        const { name, price, quantity } = req.body;
        const newProduct = new Product({
            name,
            price,
            quantity,
            image: req.urlImage,
            user: req.user.id
        });
        const savedProduct = await newProduct.save();
        res.json(savedProduct);
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({ message: ['Error al crear un producto'] })
    }
};//Fin de createProduct

//Funcion para obtener un productos por ID
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) //No se encontro el producto
            return res.status(404)
                .json({ message: ['Producto no encontrado'] })
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({ message: ['Error al obtener un producto por ID'] })
    }
};//Fin de getProduct

//Funcion para eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) //No se encontro el producto
            return res.status(404)
                .json({ message: ['Producto no encontrado para eliminar'] })
        //Para eliminar la imagen de cloudinary es necesario 
        //extraer el nombre de la imagen sin url sin extension
        const imageurl = product.image;

        //Dividimos por diagonales  / la url y nos quedmos con el ultimo elemento 
        //que contiene el nombre de la imagen
        const urlArray = imageurl.split('/');
        //image contendra el id de l a imagen en cloudinary
        //image = 1848ujodfh09h01.jpg
        const image = urlArray[urlArray.length - 1];

        //Dividmos el nombre de la imagen para quitar la extension
        //imageName = 1848ujodfh09h01.jpg
        const imageName = image.split('.')[0];

        //Eliminamos la imagen de cloudinary
        const result = await cloudinary.uploader.destroy(imageName);
        if (result.result === 'ok') {
            //Si se elimino la imagen, eliminamos el producto
            const deleteProduct = await Product.findByIdAndDelete(req.params.id);

            if (!deleteProduct) //No se pudo eliminar el producto
                return res.status(404)
                    .json({ message: ['Producto no eliminado'] })

            return res.json(deleteProduct);
        } else {
            //Si hay error al elminar la imagen retornamos el error y NO borramo el producto
            return res.status(500)
                .json({ message: ['Error al eliminar la imagen del prodcuto'] })

        }//Fin del else
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({ message: ['Error al eliminar un producto'] })
    }
};//Fin de deleteProduct

//Funcion para actualizar un producto sin actualizar la imagen
export const updateProductWithoutImage = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id, req.body);
        if (!product) //No se encontro el producto
            return res.status(404)
                .json({ message: ['Producto no encontrado para actualizar'] })
        const dataProduct = ({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            image: req.body.image,
            user: req.user.id
        });

        const updateProduct = await Product.findByIdAndUpdate(req.params.id, dataProduct, { new: true });
        res.json(updateProduct);


    } catch (error) {
        console.log(error);
        res.status(500)
            .json({ message: ['Error al actualizar un producto'] })
    }
};//Fin de updateProduct

//Funcion para actualizar un producto Actualizando la imagen
export const updateProductWithImage = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id, req.body);
        if (!product) //No se encontro el producto
            return res.status(404)
                .json({ message: ['Producto no encontrado para actualizar'] })
        if (!req.file)
            return res.status(500)
                .json({ message: ['Error al actualizar producto, no se encontro la imagen'] })

        const imageUrl = product.image;
        const urlArray = imageUrl.split('/');
        const image = urlArray[urlArray.length - 1];
        const imageName = image.split('.')[0];

        //Eliminamos la imagen de cludinary
        const result = cloudinary.uploader.destroy(imageName);
        if (!result.result === 'ok') {
            return res.status(500)
                .json({ message: ['Error al eliminar la imafen del prodcuto'] })
        }//Fin del else


        const dataProduct = ({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            image: req.urlImage,
            user: req.user.id
        });

        const updateProduct = await Product.findByIdAndUpdate(req.params.id, dataProduct, { new: true });
        res.json(updateProduct);



    } catch (error) {
        console.log(error);
        res.status(500)
            .json({ message: ['Error al actualizar un producto'] })
    }
};//Fin de updateProduct

//Funcion para obtener todos los productos de todos los usuarios
//para la compra de productos
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({ message: ['Error al obtener todos los productos'] })
    }
}; //Fin de getAllProducts
