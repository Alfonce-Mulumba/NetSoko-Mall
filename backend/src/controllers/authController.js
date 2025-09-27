// backend/src/controllers/authController.js
import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Configure transporter (Gmail example — ensure EMAIL_USER / EMAIL_PASS set)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// helper to send email
const sendMail = async ({ to, subject, text, html }) => {
  await transporter.sendMail({
    from: `"Net-Soko" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
};

// --- Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const code = Math.floor(100000 + Math.random() * 900000);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashed,
        verification_code: code,
        is_verified: false,
        role: "customer",
      },
    });

    // send verification email (non-blocking)
    sendMail({
      to: email,
      subject: "Verify your Net-Soko account",
      text: `Your Net-Soko verification code is: ${code}`,
    }).catch((e) => console.error("Send verify email error:", e.message));

    res.json({
      message: "User registered. Check your email for verification code.",
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Error registering user" });
  }
};

// --- Verify
export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.verification_code && String(user.verification_code) === String(code)) {
      const updated = await prisma.user.update({
        where: { email },
        data: { is_verified: true, verification_code: null },
      });

      const token = jwt.sign({ id: updated.id, email: updated.email, role: updated.role }, JWT_SECRET, {
        expiresIn: "2h",
      });

      return res.json({
        message: "Email verified successfully",
        token,
        user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role },
      });
    }

    return res.status(400).json({ message: "Invalid verification code" });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ message: "Error verifying email" });
  }
};

// --- Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.is_verified) return res.status(403).json({ message: "Please verify your email before logging in." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "2h" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
};

// --- Forgot password (send reset code)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // respond generically so attackers can't probe emails
      return res.json({ message: "If that email exists, a reset code has been sent." });
    }

    // generate 6-digit numeric code
    const resetCode = Math.floor(100000 + Math.random() * 900000);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await prisma.user.update({
      where: { email },
      data: { reset_code: resetCode, reset_expires: expires },
    });

    // send email (fire-and-forget)
    sendMail({
      to: email,
      subject: "Net-Soko password reset code",
      text: `Your password reset code is: ${resetCode}. It expires in 1 hour.`,
    }).catch((e) => console.error("Send reset email error:", e.message));

    // Generic success response
    return res.json({ message: "If that email exists, a reset code has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Error requesting password reset" });
  }
};

// --- Reset password (verify code, set new password)
export const resetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;
    if (!email || !code || !password) return res.status(400).json({ message: "Email, code and password are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.reset_code || !user.reset_expires) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    // Check expiry
    const now = new Date();
    if (user.reset_expires < now) {
      // clear expired code
      await prisma.user.update({ where: { email }, data: { reset_code: null, reset_expires: null } });
      return res.status(400).json({ message: "Reset code has expired. Request a new one." });
    }

    // Validate code
    if (String(user.reset_code) !== String(code)) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashed, reset_code: null, reset_expires: null },
    });

    // Optionally, send confirmation email
    sendMail({
      to: email,
      subject: "Your Net-Soko password was reset",
      text: `Your password was successfully reset. If you did not perform this action, contact support immediately.`,
    }).catch((e) => console.error("Send reset confirmation error:", e.message));

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Error resetting password" });
  }
};
