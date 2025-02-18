// middlewares/tokenMiddleware.js
export const tokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      errors: ["Token de autorización no proporcionado."],
      hasErrors: true,
      statusCode: 401,
    });
  }

  // Si el token comienza con "Bearer ", se conserva tal cual.
  if (token.startsWith("Bearer ")) {
    req.headers["Authorization"] = token;
  }
  next();
};
