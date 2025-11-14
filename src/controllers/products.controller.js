import Product from "../models/product.models.js";
import { v2 as cloudinary } from "cloudinary";

// Obtener todos los productos
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ["Error al obtener los productos."] });
    }
};

// Crear un producto
export const createProduct = async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        const newProduct = new Product({ name, price, quantity });
        const savedProduct = await newProduct.save();
        res.json(savedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ["Error al crear un producto."] });
    }
};

// Obtener un producto por ID
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ message: ["Producto no encontrado."] });

        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ["Error al obtener el producto."] });
    }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product)
            return res.status(404).json({ message: ["Producto no encontrado."] });

        res.json({ message: "Producto eliminado correctamente", product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ["Error al eliminar el producto."] });
    }
};

// Actualizar un producto sin cambiar imagen
export const updateProductWithoutImage = async (req, res) => {
    try {
        const dataProduct = {
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            image: req.body.image,
            user: req.user?.id,
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            dataProduct,
            { new: true }
        );

        if (!updatedProduct)
            return res
                .status(404)
                .json({ message: ["Producto no encontrado para actualizar."] });

        res.json({ message: "Producto actualizado correctamente", updatedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ["Error al modificar el producto."] });
    }
};
