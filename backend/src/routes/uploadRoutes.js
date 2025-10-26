import express from "express";
import multer from "multer";
import { uploadImages } from "../controllers/uploadController.js";

const router = express.Router();

// temp storage for uploaded files
const upload = multer({ dest: "uploads/" });

// POST /api/upload
router.post("/", upload.array("images"), uploadImages);

export default router;
