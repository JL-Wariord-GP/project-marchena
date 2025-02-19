// src/routes/emailRoutes.js
import express from "express";
import { sendWelcomeEmail } from "../controllers/emailController.js";

const router = express.Router();

router.post("/welcome", sendWelcomeEmail);

export default router;
