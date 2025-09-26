// backend/src/routes/paymentRoutes.js
import express from "express";
import { initPayment, confirmPayment } from "../controllers/paymentController.js";

const router = express.Router();

// POST /api/payments/init
router.post("/init", initPayment);

// POST /api/payments/confirm
router.post("/confirm", confirmPayment);

export default router;
