// middlewares/validateLogin.js
import { check } from "express-validator";

export const validateLogin = [
  check("correo")
    .isEmail()
    .withMessage("Debe ingresar un correo electrónico válido."),
  check("password").notEmpty().withMessage("La contraseña es obligatoria."),
];
