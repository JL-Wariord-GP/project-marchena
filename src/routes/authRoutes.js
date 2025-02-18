// routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  updateUserById,
  deleteUserById,
  updateUserRole,
} from "../controllers/authController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

// Importa los middlewares de validación
import { validateRegister } from "../middleware/validateRegister.js";
import { validateLogin } from "../middleware/validateLogin.js";
import { validateUpdateUser } from "../middleware/validateUpdateUser.js";
import { validationError } from "../middleware/validationError.js";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario.
 *     description: |
 *       Registro público: se asigna rol "cliente" por defecto.
 *       Para asignar un rol distinto se requiere un token de un administrador,
 *       salvo que no exista ningún administrador y se solicite "administrador".
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *               password:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [cliente, administrador, repartidor]
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *       400:
 *         description: Usuario o correo ya en uso / Rol inválido.
 */
router.post(
  "/register",
  validateRegister,
  validationError, 
  register 
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión en la aplicación.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 example: "usuario1@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *       400:
 *         description: Credenciales incorrectas.
 */
router.post(
  "/login",
  validateLogin,
  validationError,
  login
);

/**
 * @swagger
 * /auth/user/{userId}:
 *   put:
 *     summary: Actualiza la información de un usuario por ID.
 *     description: |
 *       Solo se actualizan campos no sensibles (nombre, apellido, correo, dirección y teléfono).
 *       Los usuarios solo pueden modificar su propia cuenta, a menos que sean administradores.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
router.put(
  "/user/:userId",
  authenticateToken,
  validateUpdateUser,
  validationError,
  updateUserById
);

/**
 * @swagger
 * /auth/user/{userId}:
 *   delete:
 *     summary: Elimina un usuario por ID.
 *     description: |
 *       Los usuarios solo pueden eliminar su propia cuenta, a menos que sean administradores.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar.
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
router.delete("/user/:userId", authenticateToken, deleteUserById);

/**
 * @swagger
 * /auth/role/{userId}:
 *   put:
 *     summary: Actualiza el rol de un usuario (solo administradores).
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rol:
 *                 type: string
 *                 enum: [cliente, administrador, repartidor]
 *                 example: "repartidor"
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente.
 *       400:
 *         description: Rol inválido.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
router.put(
  "/role/:userId",
  authenticateToken,
  authorizeRoles("administrador"),
  validationError,
  updateUserRole
);

export default router;
