import express from "express";
import morgan from "morgan";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;
connectDB();
// middleware que muestra cada petición GET, POST, etc.
app.use(express.json());                 // <-- importante para leer JSON

app.use("/api", authRoutes);  

app.get("/", (req, res) => {
  res.send("Hola Mundo 🚀");
});


// 404 debe ir AL FINAL
app.use((_, res) => res.status(404).send("No encontrada"));



app.listen(3000);
console.log("Servidor en http://localhost:3000");
app.use(morgan("dev"));