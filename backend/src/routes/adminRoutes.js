import express from "express";
import { protect, verifyAdmin } from "../middleware/authMiddleware.js";
import { getComplaints, markComplaintRead, getUnreadComplaintsCount } from "../controllers/adminController.js";
import { createProduct, applyDiscount, updateStock, getProducts, deleteProduct, getUsers, deleteUser, getOrders, updateOrder, getAnalytics, updateProduct } from "../controllers/adminController.js";

const router = express.Router();

router.get("/complaints", protect, verifyAdmin, getComplaints);
router.put("/complaints/:id/read", protect, verifyAdmin, markComplaintRead);
router.get("/complaints/unread/count", protect, verifyAdmin, getUnreadComplaintsCount);
router.use(protect, verifyAdmin);
router.post("/products", createProduct);
router.put("/products/:id/discount", applyDiscount);
router.put("/products/:id/stock", updateStock);
router.get("/products", getProducts);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id", updateProduct);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.get("/orders", getOrders);
router.put("/orders/:id", updateOrder);
router.get("/analytics", getAnalytics);

export default router;
