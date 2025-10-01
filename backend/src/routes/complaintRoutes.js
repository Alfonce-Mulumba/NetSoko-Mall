import express from "express";
import { protect, verifyAdmin } from "../middleware/authMiddleware.js";
import {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
} from "../controllers/complaintController.js";

const router = express.Router();

router.post("/", protect, createComplaint);
router.get("/", protect, verifyAdmin, getAllComplaints);
router.put("/:id", protect, verifyAdmin, updateComplaintStatus);

export default router;
