import { prisma } from "../config/db.js";
export const bulkUploadJSON = async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: "Invalid products data" });
    }

    const created = await prisma.product.createMany({
      data: products.map((p) => ({
        name: p.name,
        description: p.description || "",
        price: p.price,
        stock: p.stock || 0,
        category: p.category || null,
      })),
    });

    res.json({ message: "Products uploaded", count: created.count });
  } catch (err) {
    res.status(500).json({ message: "Error bulk uploading", error: err.message });
  }
};

export const applyDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { discountPercent } = req.body;

    if (!discountPercent || discountPercent <= 0 || discountPercent >= 100) {
      return res.status(400).json({ message: "Discount percent must be between 1 and 99" });
    }

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        discount: discountPercent,
      },
    });

    res.json({ message: "Discount applied", product });
  } catch (error) {
    res.status(500).json({ message: "Error applying discount", error: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: { stock },
    });

    res.json({ message: "Stock updated", product });
  } catch (err) {
    res.status(500).json({ message: "Error updating stock", error: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

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

export const getComplaints = async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      include: { user: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Error fetching complaints", error: err.message });
  }
};

export const markComplaintRead = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await prisma.complaint.update({
      where: { id: Number(id) },
      data: { isRead: true },
    });
    res.json({ message: "Complaint marked as read", complaint });
  } catch (err) {
    res.status(500).json({ message: "Error updating complaint", error: err.message });
  }
};

export const getUnreadComplaintsCount = async (req, res) => {
  try {
    const count = await prisma.complaint.count({
      where: { isRead: false },
    });
    res.json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ message: "Error fetching unread complaints", error: err.message });
  }
};