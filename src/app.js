// src/app.js
import { connectDB } from "./db.js";
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config(); // 👈 carga tu .env
connectDB(); // 👈 conecta a MongoDB antes de levantar el servidor

import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

// ✅ Cambia las rutas a "./routes/..." (no "../")
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors({ credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Rutas principales
app.use("/api", authRoutes);
app.use("/api", productRoutes);

// Ruta raíz de prueba
app.get("/", (req, res) => res.send("Hola desde /"));

// Manejo de rutas inexistentes
app.use((req, res) => res.status(404).send("No encontrada"));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

export default app;
