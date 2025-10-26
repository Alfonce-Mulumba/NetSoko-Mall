import sgMail from "@sendgrid/mail";

import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const frontendURL = process.env.FRONTEND_URL || "https://netsoko-mall-1.onrender.com";

export const sendMail = async (email, verificationCode) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM,
    subject: "Verify Your NetSoko Account",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333">
        <h2>Verify Your Email</h2>
        <p>Use this verification code:</p>
        <h1 style="background:#f4f4f4; padding:10px; display:inline-block; border-radius:8px;">${verificationCode}</h1>
        <p>Or click to verify directly:</p>
        <a href="${process.env.FRONTEND_URL}/verify?email=${email}&code=${verificationCode}"
           style="background:#4F46E5; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">
          Verify Email
        </a>
      </div>
    `,
  };

  await sgMail.send(msg); // <-- let it throw errors
};


export const sendForgotPasswordEmail = async (email, code) => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM,
      subject: "NetSoko Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333">
          <h2>Password Reset Request</h2>
          <p>Your password reset code is:</p>
          <h1 style="background:#f4f4f4; padding:10px; display:inline-block; border-radius:8px;">${code}</h1>
          <p>Or click to reset password directly:</p>
          <a href="${frontendURL}/reset-password?email=${email}&code=${code}"
             style="background:#4F46E5; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">
            Reset Password
          </a>
          <p>If you didn’t request this, ignore this email.</p>
          <p>— NetSoko Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Forgot password email sent to ${email}`);
  } catch (err) {
    console.error("❌ Forgot password email failed:", err.response?.body || err.message);
  }
};

export const sendComplaintEmail = async ({ userEmail, userName, message, adminEmail }) => {
  try {
    // Email to admin
    await sgMail.send({
      to: adminEmail || process.env.ADMIN_EMAIL || "netsoko.care@gmail.com",
      from: process.env.SENDGRID_FROM,
      subject: `New complaint from ${userName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333">
          <h2>New Complaint Submitted</h2>
          <p><strong>User:</strong> ${userName} (${userEmail})</p>
          <p><strong>Message:</strong> ${message}</p>
        </div>
      `,
    });
    console.log(`✅ Complaint email sent to admin (${adminEmail})`);

    // Confirmation email to user
    await sgMail.send({
      to: userEmail,
      from: process.env.SENDGRID_FROM,
      subject: "We received your complaint",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333">
          <h2>Complaint Received</h2>
          <p>Hi ${userName},</p>
          <p>We received your complaint and our team will get back to you soon:</p>
          <blockquote>${message}</blockquote>
          <p>Thank you for reaching out!</p>
          <p>— NetSoko Team</p>
        </div>
      `,
    });
    console.log(`✅ Complaint confirmation email sent to ${userEmail}`);
  } catch (err) {
    console.error("❌ Complaint email failed:", err.response?.body || err.message);
  }
};
