// src/routes/productRoutes.js
import express from "express";
import {
  getProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,

} from "../controllers/productController.js";
import { protect, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/search", searchProducts); // 🔍 Search & filter
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin
router.post("/", createProduct);    // requires admin auth in real case
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
