import { prisma, JWT_SECRET } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Register User
export const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, phone, password: hashedPassword },
  });

  res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    token: jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "30d" }),
  });
};

// ✅ Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    token: jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "30d" }),
  });
};

// ✅ Get Profile (for /profile route)
export const getProfile = async (req, res) => {
  const userId = req.user?.id; // req.user should be set by auth middleware
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, phone: true, role: true },
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};
