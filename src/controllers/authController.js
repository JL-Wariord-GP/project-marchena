// src/controllers/authController.js
import { User } from "../models/User.js";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../services/authService.js";
import { sendEmail } from "../services/emailService.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

/**
 * Registra un nuevo usuario.
 * Además de la lógica existente (incluyendo la validación del rol),
 * se envía un correo de verificación con un enlace para activar la cuenta.
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

    // Lógica para asignar un rol distinto a "cliente"
    if (rol && rol !== "cliente") {
      if (rol === "administrador") {
        const adminExists = await User.findOne({ rol: "administrador" });
        if (!adminExists) {
          newRole = "administrador";
        } else {
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

    // Crear el usuario con verified por defecto en false
    const newUser = new User({
      usuario,
      nombre,
      apellido,
      correo,
      direccion,
      telefono,
      password: hashedPassword,
      rol: newRole,
      verified: false,
    });

    await newUser.save();

    // Generar token de verificación (válido por 24 horas)
    const verificationToken = jwt.sign({ id: newUser._id }, config.jwtSecret, {
      expiresIn: "24h",
    });
    // Construir el enlace de verificación usando el protocolo y host de la petición
    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/auth/verify?token=${verificationToken}`;

    // Preparar el correo de verificación
    const emailOptions = {
      to: correo,
      subject: "Verificación de cuenta - E-commerce",
      html: `
        <p>Estimado/a ${nombre},</p>
        <p>Gracias por registrarse en nuestro sistema. Para completar su registro y activar su cuenta, por favor haga clic en el siguiente enlace:</p>
        <p><a href="${verificationLink}">Verificar mi cuenta</a></p>
        <p>Si usted no ha solicitado este registro, por favor ignore este mensaje.</p>
        <p>Atentamente,<br/>El equipo de E-commerce</p>
      `,
    };

    const emailSent = await sendEmail(emailOptions);
    if (emailSent) {
      res.status(201).json({
        message:
          "Usuario registrado exitosamente. Por favor, revise su bandeja de entrada para validar su cuenta.",
      });
    } else {
      res.status(500).json({
        message:
          "Usuario registrado, pero ocurrió un error al enviar el correo de verificación.",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

/**
 * Verifica la cuenta del usuario a partir del token enviado por correo.
 */
export const verifyUser = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res
      .status(400)
      .json({ message: "Token de verificación no proporcionado." });
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const userId = decoded.id;
    const user = await User.findByIdAndUpdate(
      userId,
      { verified: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    res.status(200).json({
      message: "Correo verificado exitosamente. Su cuenta ahora está activada.",
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Token de verificación inválido o expirado." });
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
    // Verificar que la cuenta esté activada
    if (!user.verified) {
      return res.status(403).json({
        message:
          "Cuenta no verificada. Por favor, revise su correo y verifique su cuenta para poder usar nuestros servicios.",
      });
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
