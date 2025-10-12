import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';
import { prisma } from "../config/db.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, phone: true, role: true },
      });

      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      req.user = user; // ✅ This line is what sets req.user
      next();
    } catch (error) {
      console.error("protect middleware error:", error.message);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});


export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
};

export { protect as authMiddleware };
export { verifyAdmin as adminMiddleware };
