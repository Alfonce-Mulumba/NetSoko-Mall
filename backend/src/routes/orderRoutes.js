// backend/src/routes/orderRoutes.js
import express from "express";
import {
  placeOrder,
  getOrders,
  getOrderById,
  getAllOrders,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);      // Place order
router.get("/", protect, getOrders);        // User: get their orders
router.get("/:id", protect, getOrderById);  // User/Admin: get single order
router.get("/admin/all", protect, getAllOrders); // Admin: all orders

export default router;
