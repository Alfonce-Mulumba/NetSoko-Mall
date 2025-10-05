import { prisma } from "../config/db.js";
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, images, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        category: category || null,
        stock: stock ? parseInt(stock) : 0,   // ✅ safe default
        images: images && images.length > 0 
          ? { create: images.map((url) => ({ url })) }
          : undefined,                        // ✅ no crash if no images
      },
      include: { images: true },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Create product failed:", err);
    res.status(500).json({ error: "Create product failed", details: err.message });
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

// ✅ Fetch ALL products (for shop)
export const getProducts = async (req, res) => {
  try {
    const { limit, sort } = req.query;

    let orderBy = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };

    const products = await prisma.product.findMany({
      include: { images: true },
      orderBy,
      take: limit ? parseInt(limit) : undefined,
    });

    res.json({ products });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// ✅ Fetch only HOT products (for homepage featured)
export const getHotProducts = async (req, res) => {
  try {
    const { limit } = req.query;

    const products = await prisma.product.findMany({
      where: { hot: true },
      include: { images: true },
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit) : 8,
    });

    res.json({ products });
  } catch (error) {
    console.error("❌ Error fetching hot products:", error);
    res.status(500).json({ message: "Error fetching hot products", error: error.message });
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
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, discount, hot, stock, images } = req.body;

    const data = {
      name,
      description,
      category,
      price: price !== undefined ? parseFloat(price) : undefined,
      discount: discount !== undefined ? parseInt(discount) : undefined,
      hot: hot !== undefined ? Boolean(hot) : undefined,
      stock: stock !== undefined ? parseInt(stock) : undefined,
    };

    // ✅ Handle images carefully
    if (Array.isArray(images)) {
      data.images = {
        deleteMany: {}, // clear old ones
        create: images.map((img) =>
          typeof img === "string" ? { url: img } : { url: img.url }
        ),
      };
    }

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data,
      include: { images: true },
    });

    res.json({ message: "✅ Product updated successfully", product });
  } catch (err) {
    console.error("❌ Update product failed:", err);
    res.status(500).json({ error: "Update product failed", details: err.message });
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
    const timeframe = req.query.timeframe || "week"; // day | week | month | year
    const now = new Date();
    let start;

    if (timeframe === "day") {
      start = new Date(now);
      start.setDate(now.getDate() - 1);
    } else if (timeframe === "week") {
      start = new Date(now);
      start.setDate(now.getDate() - 7);
    } else if (timeframe === "month") {
      start = new Date(now);
      start.setMonth(now.getMonth() - 1);
    } else {
      start = new Date(now);
      start.setFullYear(now.getFullYear() - 1);
    }

    // ✅ Fetch data
    const [orders, users, products] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: start } },
        include: { orderItems: { include: { product: true } } },
      }),
      prisma.user.findMany({
        where: { createdAt: { gte: start } },
        select: { id: true, createdAt: true },
      }),
      prisma.product.findMany({
        select: { id: true, name: true, stock: true, price: true },
      }),
    ]);

    // ✅ Totals
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({ where: { status: "pending" } });

    // ✅ Compute total sales
    let totalSales = 0;
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const price = item.price ?? item.product?.price ?? 0;
        totalSales += price * (item.quantity ?? 1);
      });
    });

    // ✅ Sales over time
    const startDate = new Date(start);
    const endDate = new Date();
    const daysBetween = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const salesOverTime = [];

    for (let i = 0; i <= daysBetween; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);
      const label = current.toISOString().slice(5, 10);

      const sales = orders.reduce((sum, order) => {
        const orderDate = new Date(order.createdAt);
        if (
          orderDate.getFullYear() === current.getFullYear() &&
          orderDate.getMonth() === current.getMonth() &&
          orderDate.getDate() === current.getDate()
        ) {
          order.orderItems.forEach(
            item => (sum += (item.price ?? item.product?.price ?? 0) * (item.quantity ?? 1))
          );
        }
        return sum;
      }, 0);

      const orderCount = orders.filter(o => {
        const d = new Date(o.createdAt);
        return (
          d.getFullYear() === current.getFullYear() &&
          d.getMonth() === current.getMonth() &&
          d.getDate() === current.getDate()
        );
      }).length;

      const userCount = users.filter(u => {
        const d = new Date(u.createdAt);
        return (
          d.getFullYear() === current.getFullYear() &&
          d.getMonth() === current.getMonth() &&
          d.getDate() === current.getDate()
        );
      }).length;

      salesOverTime.push({ label, sales, orders: orderCount, users: userCount });
    }

    // ✅ Sales by product
    const salesByProduct = {};
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const name = item.product?.name || "Unknown";
        const value = (item.price ?? item.product?.price ?? 0) * (item.quantity ?? 1);
        salesByProduct[name] = (salesByProduct[name] || 0) + value;
      });
    });

    const topProducts = Object.entries(salesByProduct)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);

    // ✅ Product stock (top 10)
    const stockLevels = products
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 10)
      .map(p => ({ name: p.name, stock: p.stock }));

    // ✅ Response
    res.json({
      totals: {
        totalUsers,
        totalProducts,
        totalOrders,
        pendingOrders,
        totalSales,
      },
      salesOverTime,
      topProducts,
      stockLevels,
    });
  } catch (error) {
    console.error("❌ Error fetching analytics:", error);
    res.status(500).json({
      message: "Error fetching analytics",
      error: error.message,
    });
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