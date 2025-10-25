import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const frontendURL = process.env.FRONTEND_URL || "https://netsoko-mall-1.onrender.com";

export const sendMail = async (email, verificationCode) => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM, // must match verified sender in SendGrid
      subject: "Verify Your NetSoko Account",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333">
          <h2>Verify Your Email</h2>
          <p>Hi there! Please use the verification code below to verify your email:</p>
          <h1 style="background:#f4f4f4; padding:10px; display:inline-block; border-radius:8px;">${verificationCode}</h1>
          <p>Or click the button below to verify directly:</p>
          <a href="${frontendURL}/verify?email=${email}&code=${verificationCode}"
             style="background:#4F46E5; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">
            Verify Email
          </a>
          <br><br>
          <p>If you didn’t request this, you can ignore the email.</p>
          <p>— NetSoko Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Verification email sent to ${email}`);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};