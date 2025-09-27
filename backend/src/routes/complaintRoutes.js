import express from "express";
import { protect, verifyAdmin } from "../middleware/authMiddleware.js";
import {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
} from "../controllers/complaintController.js";

const router = express.Router();

// User: submit complaint
router.post("/", protect, createComplaint);

// Admin: view all complaints
router.get("/", protect, verifyAdmin, getAllComplaints);

// Admin: update complaint status
router.put("/:id", protect, verifyAdmin, updateComplaintStatus);

export default router;
