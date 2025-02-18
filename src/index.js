// index.js
import express from "express";
import cors from "cors";
import { connectDB } from "./config/config.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { swaggerUi, specs } from "./config/swagger.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Conecta a la base de datos
connectDB();

app.use(express.json());
app.use(cors());

// Documentación Swagger en http://localhost:5000/api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Rutas de la API
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use(errorHandler);

app.listen(5000, () => {
  console.log("✅ Servidor corriendo en http://localhost:5000");
});
