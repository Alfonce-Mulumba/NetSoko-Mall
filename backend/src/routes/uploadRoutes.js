// backend/src/routes/uploadRoutes.js
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// configure cloudinary
console.log("Cloudinary ENV:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✔️ set" : "❌ missing",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer to handle file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.array("images"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadPromises = req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        })
    );

    const urls = await Promise.all(uploadPromises);
    res.json({ urls }); // ✅ always return { urls: [] }
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

export default router;
