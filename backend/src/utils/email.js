// backend/src/utils/email.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Generic sendMail wrapper
 */
export const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Net-Soko" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("sendMail error:", err.message);
  }
};
