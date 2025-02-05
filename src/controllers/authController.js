import { User } from "../models/User.js";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const { usuario, nombre, apellido, correo, telefono, password } = req.body;

    // 🔍 Verificar si el usuario o correo ya están en uso
    const existingUser = await User.findOne({
      $or: [{ usuario }, { correo }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "El usuario o correo ya están en uso",
      });
    }

    // 🔑 Hashear la contraseña antes de guardarla
    const hashedPassword = await hashPassword(password);

    // 🆕 Crear el nuevo usuario
    const newUser = new User({
      usuario,
      nombre,
      apellido,
      correo,
      telefono,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    // 🔍 Buscar al usuario por su nombre de usuario
    const user = await User.findOne({ usuario });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    // 🎟️ Generar token JWT
    const token = generateToken(user);

    res.json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};
