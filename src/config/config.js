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
  jwtSecret: process.env.JWT_SECRET,
};
