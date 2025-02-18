import express from "express";
import {
  fetchProducts,
  createProduct,
} from "../controllers/productController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Endpoints para la gestión de productos
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtiene la lista de todos los productos (solo para usuarios autenticados)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []  # Se requiere token Bearer
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: No autorizado, se requiere autenticación
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", authenticateToken, fetchProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crea un nuevo producto (solo para usuarios autenticados)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []  # Se requiere token Bearer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Camiseta de algodón"
 *               description:
 *                 type: string
 *                 example: "Camiseta 100% algodón, disponible en varias tallas."
 *               price:
 *                 type: number
 *                 example: 19.99
 *               stock:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos inválidos en la solicitud
 *       401:
 *         description: No autorizado, se requiere autenticación
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", authenticateToken, createProduct);

export default router;
