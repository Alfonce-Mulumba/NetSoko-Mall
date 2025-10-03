import dotenv from "dotenv";

dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";

import uploadRoutes from "./routes/uploadRoutes.js";
import { fileURLToPath } from "url";
import { prisma } from "./config/db.js"; // Prisma client
import logger from "./utils/logger.js";
import { authLimiter, generalLimiter } from "./middleware/rateLimiter.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";  // ✅ admin
import orderRoutes from "./routes/orderRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";


const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(helmet());

// CORS: allow frontend only by default (adjust FRONTEND_URL in .env)
const FRONTEND = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin === FRONTEND) return callback(null, true);
      if (process.env.CORS_WHITELIST?.split(",").includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(generalLimiter);
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));

(async () => {
  try {
    await prisma.$connect();
    logger.info("✅ Connected to PostgreSQL via Prisma");
  } catch (err) {
    logger.error({ msg: "DB Connection Error", error: err.message });
  }
})();

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/addresses", deliveryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
