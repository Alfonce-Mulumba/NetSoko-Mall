// backend/src/routes/orderRoutes.js
import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import {
  placeOrder,
  getOrders,
  getOrderById,
  getAllOrders,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", asyncHandler(placeOrder));
router.get("/", asyncHandler(getOrders));
router.get("/:id", asyncHandler(getOrderById));  // User/Admin: get single order
router.get("/admin/all", protect, getAllOrders); // Admin: all orders

export default router;
