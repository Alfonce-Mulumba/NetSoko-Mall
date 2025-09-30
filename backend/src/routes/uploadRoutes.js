import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Storage setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/"));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Allow only images
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => checkFileType(file, cb),
});

// POST /api/upload (multi-file)
router.post("/", upload.array("images", 5), (req, res) => {
  try {
    const urls = req.files.map((f) => `/uploads/${f.filename}`);
    res.json({ urls });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
