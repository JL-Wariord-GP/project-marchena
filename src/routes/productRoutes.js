import express from "express";
import { fetchProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/", fetchProducts);

export default router;
