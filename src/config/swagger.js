// src/config/swagger.js
import path from "path";
import { fileURLToPath } from "url";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Necesario para __dirname en ES Modules:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "Documentación de la API para el proyecto E-Commerce",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Servidor local",
      },
    ],
    // Si vas a manejar autenticación por JWT, por ejemplo:
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Ajusta los paths para que apunten a tus archivos de rutas/controladores:
  apis: [
    path.join(__dirname, "../routes/*.js"),
    path.join(__dirname, "../controllers/*.js"),
    // Si tienes un archivo separado con componentes (schemas):
    path.join(__dirname, "../swagger/*.js"),
  ],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
