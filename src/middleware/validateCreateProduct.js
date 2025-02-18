// middlewares/validateCreateProduct.js
import { check } from "express-validator";

export const validateCreateProduct = [
  check("name")
    .notEmpty()
    .withMessage("El nombre del producto es obligatorio."),
  check("price")
    .isFloat({ gt: 0 })
    .withMessage("El precio debe ser mayor a 0."),
  check("category").notEmpty().withMessage("La categoría es obligatoria."),
];
