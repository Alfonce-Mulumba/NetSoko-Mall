import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import {registerUser, loginUser, getProfile, verifyUser, resendOtp, resetPassword , forgotPassword} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", asyncHandler(registerUser));
router.post("/verify", asyncHandler(verifyUser));
router.post("/resend-otp", asyncHandler(resendOtp));
router.post("/login", asyncHandler(loginUser));
router.get("/profile", protect, asyncHandler(getProfile));
router.post("/reset", asyncHandler(resetPassword));
router.post("/forgot", asyncHandler(forgotPassword));

export default router;
