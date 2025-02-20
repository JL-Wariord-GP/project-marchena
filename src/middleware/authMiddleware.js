// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

/**
 * Middleware para validar el token JWT.
 */
export const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No autorizado" });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido" });
  }
};

/**
 * Middleware para autorizar el acceso según los roles permitidos.
 * @param  {...string} roles - Roles permitidos para el endpoint.
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res
        .status(403)
        .json({ message: "Acceso denegado: rol no autorizado" });
    }
    next();
  };
};
