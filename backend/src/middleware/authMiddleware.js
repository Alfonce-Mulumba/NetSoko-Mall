// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { prisma, JWT_SECRET } from "../config/db.js";

// ✅ Protect routes (verify JWT and attach user)
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Fetch user from DB (excluding sensitive info like password)
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      });

      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      req.user = user; // ✅ Attach user to request
      return next();
    } catch (error) {
      console.error("Protect middleware error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
      return;
    }
  }

  // No token provided
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }
});

// ✅ Verify admin role
export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied, admin only" });
};

// ✅ Export middleware
export { protect as authMiddleware };
export { verifyAdmin as adminMiddleware };
