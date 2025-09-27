// backend/src/controllers/authController.js
import { prisma, JWT_SECRET } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// helper: send email (wrapped)
const sendMail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Net-Soko" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  } catch (err) {
    // don't throw to user — log server side
    console.error("sendMail error:", err?.message || err);
  }
};

/**
 * Register: accepts { name, email, phone, countryCode, password }
 * - creates user with verification_code and verification_expires
 * - sends verification email with code
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const hashed = await bcrypt.hash(password, 12);
    const code = Math.floor(100000 + Math.random() * 900000);
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashed,
        verification_code: code,
        verification_expires: expires,
        is_verified: false,
        role: "customer",
      },
    });

    // ✅ Just use sendMail (you already defined it)
    await sendMail(email, "Verify your Net-Soko account", `Your verification code is: ${code}`);

    res.json({ message: "User registered. Check your email for verification code." });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ message: "Error registering", error: err.message });
  }
};


/**
 * Verify: { email, code }
 */
export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: "email and code are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.is_verified) return res.json({ message: "Already verified" });

    if (!user.verification_code || !user.verification_expires) {
      return res.status(400).json({ message: "No verification code present. Request a new one." });
    }

    if (new Date() > new Date(user.verification_expires)) {
      return res.status(400).json({ message: "Verification code expired. Request a new one." });
    }

    if (String(user.verification_code) !== String(code)) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    await prisma.user.update({
      where: { email },
      data: { is_verified: true, verification_code: null, verification_expires: null },
    });

    return res.json({ message: "Email verified. You can now login." });
  } catch (err) {
    console.error("verifyEmail error:", err);
    return res.status(500).json({ message: "Error verifying email", error: err?.message || String(err) });
  }
};
export const resendCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.is_verified) {
      return res.status(400).json({ message: "User already verified. Please login." });
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        verification_code: code,
        verification_expires: expires,
      },
    });

    await sendMail(email, "Resend Verification Code", `Your new verification code is: ${code}`);

    res.json({ message: "New verification code sent to your email." });
  } catch (err) {
    console.error("resendCode error:", err);
    res.status(500).json({ message: "Error resending code", error: err.message });
  }
};

/**
 * Login: { email, password }
 * - must be verified
 * - returns token and user basic info
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.is_verified) return res.status(403).json({ message: "Please verify your email before logging in." });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "8h" });

    return res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ message: "Error logging in", error: err?.message || String(err) });
  }
};

/**
 * Forgot password: { email }
 * - generate token (random), store hashed token + expiry on user, email token (or link)
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // generate a token (random string) and expiry (1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHashed = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        reset_password_token: resetTokenHashed,
        reset_password_expires: resetExpires,
      },
    });

    // Email the plain token (in prod you'd send a link, e.g. https://yourdomain/reset?token=...&email=...)
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}&email=${encodeURIComponent(
      email
    )}`;

    await sendMail(email, "Reset your Net-Soko password", `Use this link to reset your password (valid 1 hour):\n\n${resetUrl}`);

    return res.json({ message: "Reset instructions sent to email (if it exists)." });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ message: "Error in forgot password", error: err?.message || String(err) });
  }
};

/**
 * Reset password: { email, token, newPassword }
 * - validate token by hashing token and comparing with stored hash and expiry
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) return res.status(400).json({ message: "email, token and newPassword required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.reset_password_token || !user.reset_password_expires) {
      return res.status(400).json({ message: "No reset requested or token expired" });
    }

    if (new Date() > new Date(user.reset_password_expires)) {
      return res.status(400).json({ message: "Reset token expired. Request a new one." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    if (hashedToken !== user.reset_password_token) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashed,
        reset_password_token: null,
        reset_password_expires: null,
      },
    });

    return res.json({ message: "Password reset successful. You can now login with new password." });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ message: "Error resetting password", error: err?.message || String(err) });
  }
};
