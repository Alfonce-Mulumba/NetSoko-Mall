import express from "express";
import {
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/deliveryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ All address routes must start from here:
router.get("/", protect, getAddresses);
router.post("/", protect, addAddress);
router.delete("/:id", protect, deleteAddress);
router.put("/:id/default", protect, setDefaultAddress);

export default router;
