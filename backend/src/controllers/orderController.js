// backend/src/controllers/orderController.js
import { prisma } from "../config/db.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get cart items
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        status: "pending",
        products: {
          connect: cartItems.map((item) => ({ id: item.productId })),
        },
      },
      include: { products: true },
    });

    // Clear the cart after order
    await prisma.cart.deleteMany({ where: { userId } });

    res.status(201).json({ message: "Order placed", order, totalAmount });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error placing order", error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { products: true },
    });

    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

// backend/src/controllers/orderController.js

// ✅ Get a single order (normal user can only see their own)
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: { products: true },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order belongs to this user
    if (order.userId !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Not your order" });
    }

    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};

// ✅ Admin-only: View all orders with statuses
export const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const orders = await prisma.order.findMany({
      include: { products: true, user: { select: { id: true, email: true } } },
    });

    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching all orders", error: error.message });
  }
};
