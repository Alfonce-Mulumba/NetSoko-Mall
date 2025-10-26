import express from "express";
import { addToCart, getCart, removeFromCart, updateCartItem } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:id", protect, removeFromCart);
router.put("/:id", protect, updateCartItem);

export default router;
