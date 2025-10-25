import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import {registerUser, loginUser, getProfile, verifyUser} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", asyncHandler(registerUser));
router.post("verify", asyncHandler(verifyUser));
router.post("/login", asyncHandler(loginUser));
router.get("/profile", protect, asyncHandler(getProfile));

export default router;
