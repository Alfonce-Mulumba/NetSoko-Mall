// backend/src/routes/adminRoutes.js
import express from "express";
import {
  getProducts,
  deleteProduct,
  getUsers,
  deleteUser,
  getOrders,
  updateOrder,
  getAnalytics,
} from "../controllers/adminController.js";
import { protect, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ All admin routes require authentication + admin role
router.use(protect, verifyAdmin);

// Product routes
router.get("/products", getProducts);
router.delete("/products/:id", deleteProduct);

// User routes
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

// Order routes
router.get("/orders", getOrders);
router.put("/orders/:id", updateOrder);

// Analytics
router.get("/analytics", getAnalytics);

export default router;
