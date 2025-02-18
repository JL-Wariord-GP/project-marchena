// middlewares/validationError.js
import { validationResult } from "express-validator";

export const validationError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsValidation = errors.array().map((error) => error.msg);
    return res.status(400).json({
      errors: errorsValidation,
      hasErrors: true,
      statusCode: 400,
    });
  }
  next();
};
