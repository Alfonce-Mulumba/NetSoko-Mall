// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { prisma, JWT_SECRET } from "../config/db.js";

// Middleware: check if user has valid token
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Fetch full user from DB
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; // attach full user object to request
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware: check if user is admin
export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
};

// ✅ alias for backward compatibility
export { protect as authMiddleware };
export { verifyAdmin as adminMiddleware };
