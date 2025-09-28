import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { confirmPayment } from "../controllers/paymentController.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.post("/confirm", protect, asyncHandler(confirmPayment));

export default router;
