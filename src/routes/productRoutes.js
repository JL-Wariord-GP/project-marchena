// routes/productRoutes.js
import express from "express";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  purchaseProduct,
} from "../controllers/productController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Endpoints para la gestión de productos
 */

// Obtener todos los productos (acceso para usuarios autenticados)
router.get("/", authenticateToken, fetchProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crea un nuevo producto (solo administradores)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno
 */
router.post("/", authenticateToken, authorizeRoles("admin"), createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualiza un producto (solo administradores)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno
 */
router.put("/:id", authenticateToken, authorizeRoles("admin"), updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Elimina un producto (solo administradores)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno
 */
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteProduct
);

/**
 * @swagger
 * /products/{id}/purchase:
 *   post:
 *     summary: Realiza la compra de un producto (solo clientes)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a comprar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Compra realizada exitosamente
 *       400:
 *         description: Stock insuficiente o error en la compra
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno
 */
router.post(
  "/:id/purchase",
  authenticateToken,
  authorizeRoles("cliente"),
  purchaseProduct
);

export default router;
