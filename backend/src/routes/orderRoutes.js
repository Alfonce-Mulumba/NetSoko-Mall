// backend/src/routes/orderRoutes.js
import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  placeOrder,
  getOrders,
  getOrderById,
  getAllOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, asyncHandler(placeOrder));
router.get("/", protect, asyncHandler(getOrders));
router.get("/:id", protect, asyncHandler(getOrderById));  // User/Admin: get single order
router.get("/admin/all", protect, getAllOrders); // Admin: all orders

export default router;
