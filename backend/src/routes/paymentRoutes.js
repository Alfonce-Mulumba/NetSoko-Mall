import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { confirmPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/confirm", protect, confirmPayment);

export default router;
