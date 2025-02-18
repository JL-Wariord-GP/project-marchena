// controllers/authController.js
import { User } from "../models/User.js";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../services/authService.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

/**
 * Registra un nuevo usuario.
 */
export const register = async (req, res) => {
  try {
    const {
      usuario,
      nombre,
      apellido,
      correo,
      direccion,
      telefono,
      password,
      rol,
    } = req.body;

    // Verificar si el usuario o correo ya están en uso
    const existingUser = await User.findOne({ $or: [{ usuario }, { correo }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "El usuario o correo ya están en uso" });
    }

    // Por defecto, el rol será "cliente"
    let newRole = "cliente";

    // Si se solicita un rol distinto a "cliente"
    if (rol && rol !== "cliente") {
      if (rol === "administrador") {
        // Permitir crear el primer administrador si no existe ninguno
        const adminExists = await User.findOne({ rol: "administrador" });
        if (!adminExists) {
          newRole = "administrador";
        } else {
          // Si ya existe, se requiere token de un administrador
          const token = req.header("Authorization")?.split(" ")[1];
          if (!token) {
            return res.status(403).json({
              message:
                "Solo administradores pueden asignar roles distintos a cliente",
            });
          }
          try {
            const decoded = jwt.verify(token, config.jwtSecret);
            if (decoded.rol !== "administrador") {
              return res.status(403).json({
                message:
                  "Solo administradores pueden asignar roles distintos a cliente",
              });
            }
            newRole = rol;
          } catch (err) {
            return res.status(401).json({ message: "Token inválido" });
          }
        }
      } else {
        // Para otros roles (ej: "repartidor")
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) {
          return res.status(403).json({
            message:
              "Solo administradores pueden asignar roles distintos a cliente",
          });
        }
        try {
          const decoded = jwt.verify(token, config.jwtSecret);
          if (decoded.rol !== "administrador") {
            return res.status(403).json({
              message:
                "Solo administradores pueden asignar roles distintos a cliente",
            });
          }
          newRole = rol;
        } catch (err) {
          return res.status(401).json({ message: "Token inválido" });
        }
      }
    }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear el usuario
    const newUser = new User({
      usuario,
      nombre,
      apellido,
      correo,
      direccion,
      telefono,
      password: hashedPassword,
      rol: newRole,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

/**
 * Inicia sesión y retorna un token JWT.
 */
export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    const user = await User.findOne({ correo });
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

/**
 * Actualiza la información de un usuario (campos no sensibles).
 */
export const updateUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.id !== userId && req.user.rol !== "administrador") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para actualizar este usuario" });
    }
    const allowedUpdates = [
      "nombre",
      "apellido",
      "correo",
      "direccion",
      "telefono",
    ];
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res
      .status(200)
      .json({ message: "Usuario actualizado exitosamente", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

/**
 * Elimina un usuario.
 */
export const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.id !== userId && req.user.rol !== "administrador") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para eliminar este usuario" });
    }
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

/**
 * Actualiza el rol de un usuario (solo administradores).
 */
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { rol } = req.body;
    if (!["cliente", "administrador", "repartidor"].includes(rol)) {
      return res.status(400).json({ message: "Rol inválido" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { rol },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res
      .status(200)
      .json({ message: "Rol actualizado exitosamente", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};
