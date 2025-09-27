// backend/src/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { prisma } from "./config/db.js"; // Prisma client
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";  // ✅ admin
import orderRoutes from "./routes/orderRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Test DB connection
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL via Prisma");
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
  }
})();

// Default route
app.get("/", (req, res) => {
  res.send("🌍 Net-Soko API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/addresses", deliveryRoutes);
// ✅ Admin routes (protected with middleware inside routes file)
app.use("/api/admin", adminRoutes);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
