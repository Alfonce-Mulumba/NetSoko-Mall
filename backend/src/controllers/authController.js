import { prisma, JWT_SECRET } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/email.js";

export const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = Math.floor(100000 + Math.random() * 900000);
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        verification_code: code,
        verification_expires: expires,
        is_verified: false,
      },
    });

    try {
      await sendMail(
        user.email,
        `Your NetSoko verification code is: ${code}`
      );
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      return res.status(500).json({
        message: "User registered, but verification email failed to send",
        user: { id: user.id, name: user.name, email: user.email },
      });
    }

    return res.status(201).json({
      message: "Verification email sent. Please check your inbox.",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error registering user" });
  }
};

export const verifyUser = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) return res.status(400).json({ message: "Email and code required" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.is_verified) return res.status(400).json({ message: "User already verified" });

    if (user.verification_code !== parseInt(code)) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (new Date() > user.verification_expires) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    // Update user as verified
    await prisma.user.update({
      where: { email },
      data: {
        is_verified: true,
        verification_code: null,
        verification_expires: null,
      },
    });

    return res.json({ message: "Account verified successfully" });
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).json({ message: "Server error verifying account" });
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.is_verified) return res.status(400).json({ message: "User already verified" });

    // Generate new code
    const code = Math.floor(100000 + Math.random() * 900000);
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        verification_code: code,
        verification_expires: expires,
      },
    });

    try {
      await sendMail(email, `Your new verification code is: ${code}`);
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    res.json({ message: "📨 A new verification code has been sent to your email." });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ message: "Server error resending OTP" });
  }
};
// LOGIN USER
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "30d" });

    res.json({
      user: { id: user.id, name: user.name, role: user.role, email: user.email, phone: user.phone },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error logging in" });
  }
};

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};
