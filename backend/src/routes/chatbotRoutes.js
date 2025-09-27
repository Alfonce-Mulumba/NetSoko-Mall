import express from "express";
import { checkOrderStatus, reportProblem } from "../controllers/chatbotController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Check order status (user must be logged in)
router.post("/order-status", authMiddleware, checkOrderStatus);

// Report problem (user must be logged in)
router.post("/report", authMiddleware, reportProblem);

export default router;
