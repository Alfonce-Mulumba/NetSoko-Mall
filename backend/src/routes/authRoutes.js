// backend/src/routes/authRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendCode,
} from "../controllers/authController.js";

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Verify email (POST body { email, code })
router.post("/verify", verifyEmail);

// Forgot / Reset
router.post("/forgot", forgotPassword);      // { email }
router.post("/reset", resetPassword);        // { email, token, newPassword }
router.post("/resend-code", resendCode); 

export default router;
