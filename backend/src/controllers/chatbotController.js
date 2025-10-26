import nodemailer from "nodemailer";
import { prisma } from "../config/db.js";

export const checkOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    if (!orderId) return res.status(400).json({ message: "Order ID is required" });

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId), userId },
      include: { orderItems: { include: { product: true } } },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json({
      orderId: order.id,
      status: order.status,
      total: order.totalAmount,
      items: order.orderItems.map(i => ({
        product: i.product.name,
        quantity: i.quantity,
        price: i.price,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Error checking order status", error: err.message });
  }
};

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey", // SendGrid requires literal 'apikey' as username
    pass: process.env.SENDGRID_API_KEY,
  },
});

export const reportProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) return res.status(400).json({ message: "Message is required" });

    const complaint = await prisma.complaint.create({
      data: { userId, message },
      include: { user: true },
    });

    // Notify admin
    await transporter.sendMail({
      from: process.env.SENDGRID_SENDER,
      to: process.env.ADMIN_EMAIL,
      subject: `🚨 New Complaint from ${complaint.user.email}`,
      text: `Complaint ID: ${complaint.id}\nUser: ${complaint.user.email}\n\n${complaint.message}`,
    });

    // Acknowledge user
    await transporter.sendMail({
      from: process.env.SENDGRID_SENDER,
      to: complaint.user.email,
      subject: "Your complaint has been received",
      text: `Hello ${complaint.user.name},\n\nWe’ve received your complaint:\n"${complaint.message}"\n\nOur support team will reach out shortly.\n\nComplaint ID: ${complaint.id}`,
    });

    return res.json({
      message: "Your complaint has been received. We will reach out via email.",
      complaintId: complaint.id,
    });
  } catch (err) {
    res.status(500).json({ message: "Error reporting problem", error: err.message });
  }
};
