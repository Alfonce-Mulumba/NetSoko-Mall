// backend/src/controllers/authController.js
import { JWT_SECRET, pool } from "../config/db.js";
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

    const newUser = await pool.query(
      'INSERT INTO users(name, email, phone, password, verification_code, is_verified) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, email, phone, hashed, code, false]
    );

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
    const user = await pool.query('SELECT * FROM users WHERE email=$1', [email]);

    if (!user.rows.length) return res.status(404).json({ message: 'User not found' });

    if (user.rows[0].verification_code == code) {
      await pool.query('UPDATE users SET is_verified=true WHERE email=$1', [email]);
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

    const user = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (!user.rows.length) return res.status(404).json({ message: 'User not found' });

    const dbUser = user.rows[0];

    if (!dbUser.is_verified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, dbUser.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: dbUser.id, email: dbUser.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: dbUser.id, name: dbUser.name, email: dbUser.email }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};
