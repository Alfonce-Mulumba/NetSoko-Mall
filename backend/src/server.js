import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { prisma } from "./config/db.js";
import logger from "./utils/logger.js";
import { authLimiter, generalLimiter } from "./middleware/rateLimiter.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// ✅ Import routes
import uploadRoutes from "./routes/uploadRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Basic middleware
app.use(helmet());
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));

// ✅ CORS setup
const FRONTEND = process.env.FRONTEND_URL || "https://netsoko-mall-1.onrender.com";

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === FRONTEND) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // keep this to allow cookies
  })
);

// ✅ Rate limiting
app.use(generalLimiter);

// ✅ Connect Prisma
(async () => {
  try {
    await prisma.$connect();
    logger.info("✅ Connected to PostgreSQL via Prisma");
  } catch (err) {
    logger.error({ msg: "DB Connection Error", error: err.message });
  }
})();

// ✅ Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/orders", orderRoutes);

// 🧠 IMPORTANT FIX — mount product routes directly (not `/products/products`)
app.use("/api/products", productRoutes); // ✅ Correct

// ✅ Admin routes separate
app.use("/api/admin", adminRoutes);

app.use("/api/complaints", complaintRoutes);
app.use("/api/addresses", deliveryRoutes);
app.use("/api/upload", uploadRoutes);

// ✅ Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
