// middleware/authorizeRole.js
export const authorizeRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role; // Se asume que 'authenticateToken' añade la propiedad "role" al objeto req.user
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  };
};
