import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const cart = await prisma.cart.findMany({
  where: { userId: req.user?.id || 0 }, // fallback to 0 if not logged in
});
res.json(cart || []);

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:id", protect, removeFromCart);

export default router;
