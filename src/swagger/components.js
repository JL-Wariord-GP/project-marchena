/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - usuario
 *         - nombre
 *         - apellido
 *         - correo
 *         - direccion
 *         - telefono
 *         - password
 *       properties:
 *         usuario:
 *           type: string
 *           description: Nombre de usuario único
 *         nombre:
 *           type: string
 *         apellido:
 *           type: string
 *         correo:
 *           type: string
 *         direccion:
 *           type: string
 *         telefono:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         usuario: "usuarioDemo"
 *         nombre: "Juan"
 *         apellido: "Pérez"
 *         correo: "juan@example.com"
 *         direccion: Cra que te importa
 *         telefono: "123456789"
 *         password: "123456"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: ID del producto
 *         name:
 *           type: string
 *           description: Nombre del producto
 *         price:
 *           type: number
 *           description: Precio del producto
 *         description:
 *           type: string
 *           description: Descripción breve del producto
 *         image:
 *           type: string
 *           description: URL de la imagen del producto
 *       example:
 *         id: "614c1b3e3a1d5a3c4f2f1b3d"
 *         name: "Camiseta de algodón"
 *         price: 19.99
 *         description: "Camiseta 100% algodón, disponible en varias tallas."
 *         image: "https://example.com/imagen.jpg"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del producto
 *         name:
 *           type: string
 *           description: Nombre del producto
 *         description:
 *           type: string
 *           description: Descripción del producto
 *         price:
 *           type: number
 *           description: Precio del producto
 *         stock:
 *           type: number
 *           description: Cantidad en inventario
 *       example:
 *         id: 1
 *         name: "Camiseta de algodón"
 *         description: "Camiseta 100% algodón, disponible en varias tallas."
 *         price: 19.99
 *         stock: 50
 */
