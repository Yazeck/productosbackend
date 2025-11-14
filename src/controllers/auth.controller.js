// src/controllers/auth.controller.js
import User from '../models/user.models.js';
import bcryptjs from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';

// ✅ REGISTRO
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (userFound)
      return res.status(400).json({ message: ['El email ya está registrado'] });

    const passwordHash = await bcryptjs.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    const userSaved = await newUser.save();

    // 🔹 Generar token JWT
    const token = await createAccessToken({ id: userSaved._id });

    // Puedes enviarlo como cookie si gustas
    res.cookie('token', token, { httpOnly: true });

    // 🔹 Y también como JSON para usarlo en Thunder Client
    res.json({
      message: 'Usuario registrado correctamente',
      token,
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
    });
  } catch (error) {
    console.error('Error al registrar:', error);
    res.status(400).json({ message: ['Error al registrar'] });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound)
      return res.status(400).json({ message: ['Usuario no encontrado'] });

    const isMatch = await bcryptjs.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: ['Password incorrecto'] });

    // 🔹 Generar token JWT
    const token = await createAccessToken({ id: userFound._id });

    // 🔹 Enviar cookie (opcional)
    res.cookie('token', token, { httpOnly: true });

    // 🔹 Enviar token en JSON para usarlo en Thunder Client
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(400).json({ message: ['Error al iniciar sesión'] });
  }
};

// ✅ LOGOUT
export const logout = (req, res) => {
  res.cookie('token', '', { expires: new Date(0) });
  return res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

// ✅ PROFILE
export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id).select('-password');

  if (!userFound)
    return res.status(400).json({ message: ['Usuario no encontrado'] });

  res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
  });
};
