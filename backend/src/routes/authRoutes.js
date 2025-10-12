import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendCode,
  getProfile
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.post("/verify", asyncHandler(verifyEmail));
router.post("/forgot", asyncHandler(forgotPassword));
router.post("/reset", asyncHandler(resetPassword));
router.post("/resend-code", resendCode);
router.get("/profile", protect, asyncHandler(getProfile));

export default router;
