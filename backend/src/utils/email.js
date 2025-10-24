import nodemailer from "nodemailer";

export const sendMail = async (to, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // ✅ prevent long Gmail DNS timeout on Render
      pool: true,
      maxConnections: 1,
      rateLimit: 5,
    });

    const mailOptions = {
      from: `"NetSoko Support" <${process.env.EMAIL_USER}>`,
      to,
      subject: "NetSoko Email Verification",
      text: message,
    };

    // ✅ Add timeout & fail gracefully
    await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email send timeout")), 10000)
      ),
    ]);

    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    // Don’t crash the app — just continue
  }
};