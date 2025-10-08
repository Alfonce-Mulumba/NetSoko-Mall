import express from "express";
import {
  getProducts,
  getHotProducts,
  getProductById,
  searchProducts,
} from "../controllers/productController.js";

const router = express.Router();

// ✅ Final API endpoints:
// GET /api/products
// GET /api/products/hot
// GET /api/products/search
// GET /api/products/:id
router.get("/", getProducts);
router.get("/hot", getHotProducts);
router.get("/search", searchProducts);
router.get("/:id", getProductById);

export default router;
