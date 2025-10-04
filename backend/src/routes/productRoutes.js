import express from "express";
import {
  getProducts,
  getHotProducts,
  getProductById,
  searchProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/search", searchProducts);
router.get("/products", getProducts);
router.get("/products/hot", getHotProducts);
router.get("/:id", getProductById);

export default router;
