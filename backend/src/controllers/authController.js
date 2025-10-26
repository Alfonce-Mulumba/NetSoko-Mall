import { prisma, JWT_SECRET } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail , sendForgotPasswordEmail } from "../utils/email.js";


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
    const expires = new Date(Date.now() + 15 * 60 * 1000);

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

    // Send email — this will now throw if fails
    await sendMail(user.email, code);

    return res.status(201).json({
      message: "Verification email sent. Please check your inbox.",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Register error:", err); // <--- full error
    return res.status(500).json({ message: "Server error registering user", error: err.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code)
      return res.status(400).json({ message: "Email and code are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (String(user.verification_code) !== String(code)) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    await prisma.user.update({
      where: { email },
      data: {
          is_verified: true,
          verification_code: null,
          verification_expires: null},
    });

    return res.json({ message: "✅ Email verified successfully" });
  } catch (err) {
    console.error("verifyUser error:", err);
    res.status(500).json({ message: "Server error during verification" });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000);
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        verification_code: newCode,
        verification_expires: expires,
      },
    });

    await sendMail(
      email,
      `Your new NetSoko verification code is: ${newCode}`
    );

    res.json({ message: "📨 A new verification code has been sent" });
  } catch (err) {
    console.error("resendOtp error:", err);
    res.status(500).json({ message: "Server error during resend" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    // 2️⃣ Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // 3️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // 4️⃣ Check email verification status
    if (!user.is_verified) {
      // Generate a new 6-digit verification code
      const newCode = Math.floor(100000 + Math.random() * 900000);
      const expires = new Date(Date.now() + 15 * 60 * 1000); // expires in 15 min

      // Update user record
      await prisma.user.update({
        where: { email },
        data: {
          verification_code: newCode,
          verification_expires: expires,
        },
      });

      // Send email with new code
      try {
        await sendMail(
          email,
          `Your NetSoko verification code is: ${newCode}`
        );
      } catch (emailErr) {
        console.error("Resend verification email failed:", emailErr);
        return res.status(500).json({
          message: "Could not resend verification email. Try again later.",
        });
      }

      // Return response prompting user to verify
      return res.status(403).json({
        message:
          "Your account is not verified. A new verification code has been sent to your email.",
        redirect: "/verify",
        email,
      });
    }

    // 5️⃣ If verified, sign JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6️⃣ Return success
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Server error logging in",
      error: err.message,
    });
  }
};

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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // To prevent email enumeration, always respond with success
      return res.json({ message: "If this email exists, a reset code was sent." });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save reset token (store hashed for security)
    const hashedCode = await bcrypt.hash(code, 10);
    await prisma.passwordReset.upsert({
      where: { userId: user.id },
      update: { token: hashedCode, createdAt: new Date() },
      create: { userId: user.id, token: hashedCode },
    });

    // Send reset email
    await sendForgotPasswordEmail(user.email, code);

    res.json({ message: "Reset code sent if email exists." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Error sending reset email" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const resetEntry = await prisma.passwordReset.findUnique({
      where: { userId: user.id },
    });
    if (!resetEntry) return res.status(400).json({ message: "No reset request found" });

    const valid = await bcrypt.compare(token, resetEntry.token);
    if (!valid) return res.status(400).json({ message: "Invalid or expired code" });

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete reset entry after success
    await prisma.passwordReset.delete({ where: { userId: user.id } });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Error resetting password" });
  }
};

