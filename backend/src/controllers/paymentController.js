import { prisma } from "../config/db.js";
import { sendMail } from "../utils/email.js";

export const confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, amount } = req.body;

    const order = await prisma.order.findUnique({ where: { id: Number(orderId) }, include: { user: true } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "paid" },
    });

    await sendMail(
      order.user.email,
      "NetSoko Payment Receipt",
      `
      <h2>Payment Receipt</h2>
      <p>Order <strong>#${order.id}</strong> has been paid successfully.</p>
      <p>Amount: <strong>$${amount}</strong></p>
      <p>Payment Method: <strong>${paymentMethod}</strong></p>
      <p>Thank you for shopping with NetSoko!</p>
      `
    );

    res.json({ message: "Payment confirmed and receipt sent" });
  } catch (error) {
    console.error("confirmPayment error:", error);
    res.status(500).json({ message: "Error confirming payment", error: error.message });
  }
};
