import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All DB logic should be inside controller functions, not here
// So remove any top-level prisma calls

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:id", protect, removeFromCart);

export default router;
