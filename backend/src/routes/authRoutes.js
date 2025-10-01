import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendCode,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.post("/verify", asyncHandler(verifyEmail));
router.post("/forgot", asyncHandler(forgotPassword));
router.post("/reset", asyncHandler(resetPassword));
router.post("/resend-code", resendCode); 

export default router;
