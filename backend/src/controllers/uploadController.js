import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedImages = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "netsoko_products",
      });
      uploadedImages.push(result.secure_url);
      fs.unlinkSync(file.path); // clean temp file
    }

    return res.status(200).json({ images: uploadedImages });
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    return res.status(500).json({ message: "Image upload failed" });
  }
};
