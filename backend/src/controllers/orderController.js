import { prisma } from "../config/db.js";
import { sendMail } from "../utils/email.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { deliveryAddressId} = req.body;
    const address = await prisma.deliveryAddress.findUnique({
      where: { id: Number(deliveryAddressId) },
    });

    if (!address || address.userId !== userId) {
      return res.status(400).json({ message: "Invalid delivery address" });
    }

    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId,
        status: "pending",
        deliveryAddressId,
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        orderItems: { include: { product: true } },
        deliveryAddress: true,
      },
    });

    await prisma.cart.deleteMany({ where: { userId } });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    await sendMail(
      user.email,
      "NetSoko Order Confirmation",
      `
      <h2>Dear ${user.name}, Thank you for shopping with us😎</h2>
      <p>Your order <strong>#${order.id}</strong> has been placed successfully.</p>
      <p>Total amount: <strong>$${totalAmount}</strong></p>
      <p>We will notify you when your items are shipped.</p>
      <p>To track your order status, login to your account, click chatbot assistant and enter order ID:<strong>#${order.id}</strong></p>
      <p>Kind Regards</p>
      <p>NetSoko Care</p>
      `
    );

    res.status(201).json({ message: "Order placed", order, totalAmount });
  } catch (error) {
    console.error("placeOrder error:", error);
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: { include: { product: true } },
      },
    });

    return res.json(orders);
  } catch (error) {
    console.error("getOrders error:", error);
    return res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        orderItems: { include: { product: true } },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Not your order" });
    }

    return res.json(order);
  } catch (error) {
    console.error("getOrderById error:", error);
    return res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const orders = await prisma.order.findMany({
      include: {
        orderItems: { include: { product: true } },
        user: { select: { id: true, email: true } },
      },
    });

    return res.json(orders);
  } catch (error) {
    console.error("getAllOrders error:", error);
    return res
      .status(500)
      .json({ message: "Error fetching all orders", error: error.message });
  }
};
