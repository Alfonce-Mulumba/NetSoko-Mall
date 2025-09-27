import { prisma } from "../config/db.js";

// 1. Check order status
export const checkOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: "Order ID is required" });

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
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

// 2. Report a problem
export const reportProblem = async (req, res) => {
  try {
    const userId = req.user.id; // authenticated user
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });

    const complaint = await prisma.complaint.create({
      data: { userId, message },
      include: { user: true },
    });

    // (Optional) Notify admin via email
    // Here we just log, but in prod you’d send nodemailer to admin inbox
    console.log(`🚨 New complaint from ${complaint.user.email}: ${complaint.message}`);

    return res.json({
      message: "Your complaint has been received. We will reach out via email.",
      complaintId: complaint.id,
    });
  } catch (err) {
    res.status(500).json({ message: "Error reporting problem", error: err.message });
  }
};
