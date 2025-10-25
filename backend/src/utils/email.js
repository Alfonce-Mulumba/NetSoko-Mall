import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const frontendURL = process.env.FRONTEND_URL || "https://netsoko-mall-1.onrender.com";

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM,  // verified sender
      subject: "Verify Your Email",
      html: `
        <h2>Verify Your Email</h2>
        <p>Verification code sent to <strong>${email}</strong></p>
        <a href="${frontendURL}/verify?code=${verificationCode}">Verify Email</a>
        <br/>
        <a href="${frontendURL}/resend">Resend code</a>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ Verification email sent to ${email}`);
  } catch (err) {
    if (err.response) {
      console.error("❌ Email send failed:", err.response.body);
    } else {
      console.error("❌ Email send failed:", err.message);
    }
  }
};