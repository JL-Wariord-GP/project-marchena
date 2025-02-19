import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Conectado");
  } catch (error) {
    console.error("❌ Error conectando MongoDB", error);
    process.exit(1);
  }
};

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
    user: process.env.EMAIL_USER || "example@gmail.com", // Cambia esto por tu correo
    pass: process.env.EMAIL_PASS || "clavesecreta", // Cambia esto por tu contraseña o app password
    fromName: process.env.EMAIL_FROM_NAME || "Autenticacion",
  },
};