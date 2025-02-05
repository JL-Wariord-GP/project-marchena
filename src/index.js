import express from "express";
import cors from "cors";
import { connectDB } from "./config/config.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);

app.listen(5000, () =>
  console.log("✅ Servidor corriendo en http://localhost:5000")
);
