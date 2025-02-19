// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  direccion: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  password: { type: String, required: true },
  rol: {
    type: String,
    enum: ["cliente", "administrador", "repartidor"],
    default: "cliente",
  },
  verified: { type: Boolean, default: false },
});

export const User = mongoose.model("User", userSchema);
