// backend/src/routes/adminRoutes.js
import express from "express";
import { protect, verifyAdmin } from "../middleware/authMiddleware.js";

import {
  bulkUploadJSON,
  applyDiscount,
  updateStock,
  getProducts,
  deleteProduct,
  getUsers,
  deleteUser,
  getOrders,
  updateOrder,
  getAnalytics,
} from "../controllers/adminController.js";

const router = express.Router();

// ✅ All admin routes require authentication + admin role
router.use(protect, verifyAdmin);

// Bulk product upload (JSON)
router.post("/products/bulk/json", bulkUploadJSON);

// Manage discounts
router.put("/products/:id/discount", applyDiscount);

// Update stock
router.put("/products/:id/stock", updateStock);

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
