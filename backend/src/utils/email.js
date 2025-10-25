import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = async (to, message) => {
  try {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM, // your verified sender email
      subject: "NetSoko Email Verification",
      text: message,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
      if (err.response) {
          console.error("❌ Email send failed:",
              err.response.body);
      } else {
          console.error("❌ Email send failed:", err.message);
      }
  }
};