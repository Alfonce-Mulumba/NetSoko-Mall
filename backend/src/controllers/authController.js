// backend/src/controllers/authController.js
import { JWT_SECRET, prisma } from "../config/db.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// Send verification email
const sendVerificationEmail = async (email, code) => {
  await transporter.sendMail({
    from: '"Net-Soko" <no-reply@netsoko.com>',
    to: email,
    subject: 'Verify your Net-Soko account',
    text: `Your verification code is: ${code}`
  });
};

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

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
      },
    });

    await sendVerificationEmail(email, code);

    res.json({ message: 'User registered. Check your email for verification code.' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering', error: err.message });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.verification_code == code) {
      await prisma.user.update({
        where: { email },
        data: { is_verified: true },
      });
      res.json({ message: 'Email verified. You can now login.' });
    } else {
      res.status(400).json({ message: 'Invalid verification code' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error verifying email', error: err.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.is_verified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};
