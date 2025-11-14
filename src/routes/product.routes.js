// src/routes/product.routes.js
import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
    getProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProductWithoutImage, // ✅ nombre correcto
} from "../controllers/products.controller.js";

const router = Router();

// Rutas CRUD de productos
router.get("/products", authRequired, getProducts);
router.post("/products", authRequired, createProduct);
router.get("/products/:id", authRequired, getProduct);
router.delete("/products/:id", authRequired, deleteProduct);
router.put("/products/:id", authRequired, updateProductWithoutImage); // ✅ corregido

export default router;
