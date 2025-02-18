// middlewares/validateUpdateUser.js
import { check } from "express-validator";

export const validateUpdateUser = [
  check("nombre")
    .optional()
    .trim()
    .matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/)
    .withMessage("El nombre solo puede contener letras.")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres."),
  check("apellido")
    .optional()
    .trim()
    .matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/)
    .withMessage("El apellido solo puede contener letras.")
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres."),
  check("correo")
    .optional()
    .isEmail()
    .withMessage("Debe ser un correo electrónico válido.")
    .normalizeEmail(),
  check("direccion")
    .optional()
    .notEmpty()
    .withMessage("La dirección es obligatoria."),
  check("telefono")
    .optional()
    .notEmpty()
    .withMessage("El teléfono es obligatorio."),
];
