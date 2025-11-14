// src/middlewares/validateToken.js
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export function authRequired(req, res, next) {
    try {
        // 🔹 Primero buscamos el token en el header Authorization
        let token = null;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies?.token) {
            // 🔹 O si viene desde cookies (para sesiones en navegador)
            token = req.cookies.token;
        }

        // Si no hay token, negar acceso
        if (!token) {
            return res.status(401).json({ message: "No token, acceso denegado" });
        }

        // Verificamos el token JWT
        const decoded = jwt.verify(token, TOKEN_SECRET);

        // Guardamos los datos del usuario en la request
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error en authRequired:", error.message);
        return res.status(403).json({ message: "Token inválido o expirado" });
    }
}
