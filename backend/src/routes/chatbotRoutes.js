import express from "express";
import { checkOrderStatus, reportProblem } from "../controllers/chatbotController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/order-status", authMiddleware, checkOrderStatus);
router.post("/report", authMiddleware, reportProblem);

export default router;
