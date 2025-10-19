import express from "express";
import { getProducts, getHotProducts, getProductById, searchProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/hot", getHotProducts);
router.get("/search", searchProducts);
router.get("/:id", getProductById);

export default router;
