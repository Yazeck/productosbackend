// src/schemas/auth.schema.js
import { z } from "zod";

// Esquema para registro de usuario
export const registerSchema = z.object({
    username: z
        .string({
            required_error: "El nombre es requerido",
        })
        .min(5, { message: "El nombre debe tener al menos 5 caracteres" }),

    email: z
        .string({
            required_error: "El email es requerido",
        })
        .email({ message: "El email es inválido" }),

    password: z
        .string({
            required_error: "La contraseña es requerida",
        })
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

// Esquema para login de usuario
export const loginSchema = z.object({
    email: z
        .string({
            required_error: "El email es requerido",
        })
        .email({ message: "El formato del email no es válido" }),

    password: z
        .string({
            required_error: "La contraseña es requerida",
        })
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});
