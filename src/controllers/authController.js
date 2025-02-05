import { User } from "../models/User.js";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../services/authService.js";

export const register = async (req, res) => {
  const { usuario, nombre, apellido, correo, telefono, password } = req.body;

  const hashedPassword = await hashPassword(password);
  const newUser = new User({
    usuario,
    nombre,
    apellido,
    correo,
    telefono,
    password: hashedPassword,
  });

  await newUser.save();
  res.status(201).json({ message: "Usuario registrado" });
};

export const login = async (req, res) => {
  const { usuario, password } = req.body;

  const user = await User.findOne({ usuario });
  if (!user || !(await comparePassword(password, user.password))) {
    return res.status(400).json({ message: "Credenciales incorrectas" });
  }

  const token = generateToken(user);
  res.json({ token });
};
