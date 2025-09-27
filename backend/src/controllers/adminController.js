// backend/src/controllers/adminController.js
import { prisma } from "../config/db.js";

// ✅ Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// ✅ Delete product by ID
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

// ✅ Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        is_verified: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// ✅ Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

// ✅ Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        products: true,
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// ✅ Update order status
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};

// ✅ Analytics (counts)
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({ where: { status: "pending" } });

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics", error: error.message });
  }
};
