import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = async (email, verificationCode) => {
  try {
    const frontendURL = process.env.FRONTEND_URL || "https://netsoko-mall-1.onrender.com";

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM,  // verified sender
      subject: "Verify Your Email",
      html: `
        <h2>Verify Your Email</h2>
        <p>Hi,</p>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>Use the code to verify your NetSoko account or click the link below</p>
        <br/>
        <a href="${frontendURL}/verify-email?code=${verificationCode}" target="_blank">Verify Email</a>
        <a href="${frontendURL}/resend" >Resend code</a>
        <p>Thanks, <br/>NetSoko Team</p>
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