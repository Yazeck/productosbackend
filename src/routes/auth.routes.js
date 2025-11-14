import { Router } from "express";
import { login, logout, register, profile } from '../controllers/auth.controller.js';
import { validateSchema } from "../middlewares/validateSchemas.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);

//ruta para cerrar sesion
router.post('/logout', logout);

//ruta para el perfil de usuario
router.get('/profile', authRequired, profile);



export default router;
