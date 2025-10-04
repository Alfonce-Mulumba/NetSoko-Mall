// controllers/productController.js
import { prisma } from "../config/db.js";

// ✅ fetch all products (already exists, keep it)
export const getProducts = async (req, res) => {
  try {
    const { q, category, sort, minPrice, maxPrice, limit } = req.query;

    let where = {};
    if (q) where.name = { contains: q, mode: "insensitive" };
    if (category) where.category = category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    let orderBy = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };

    const products = await prisma.product.findMany({
      where,
      include: { images: true },
      orderBy,
      take: limit ? parseInt(limit) : undefined,
    });

    res.json({ products });
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// ✅ NEW: fetch only HOT products
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
  } catch (err) {
    console.error("❌ Error fetching hot products:", err);
    res.status(500).json({ error: "Failed to fetch hot products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { images: true, sizes: true },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      sort = "newest",
      page = 1,
      limit = 10
    } = req.query;

    const filters = {};

    if (q) {
      filters.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category) {
      filters.category = { equals: category };
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = parseFloat(minPrice);
      if (maxPrice) filters.price.lte = parseFloat(maxPrice);
    }

    let orderBy = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };
    if (sort === "newest") orderBy = { createdAt: "desc" };

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const products = await prisma.product.findMany({
      where: filters,
      include: { images: true, sizes: true },
      orderBy,
      skip,
      take,
    });

    const total = await prisma.product.count({ where: filters });

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error("searchProducts error:", error);
    res.status(500).json({ message: "Error searching products", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, images, sizes } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        images: { create: images?.map((url) => ({ url })) || [] },
        sizes: {
          create: sizes?.map((s) => ({ size: s.size, stock: s.stock })) || [],
        },
      },
      include: { images: true, sizes: true },
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, images, sizes } = req.body;
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        stock: stock ? parseInt(stock) : undefined,
        category,
        images: images
          ? { deleteMany: {}, create: images.map((url) => ({ url })) }
          : undefined,
        sizes: sizes
          ? { deleteMany: {}, create: sizes.map((s) => ({ size: s.size, stock: s.stock })) }
          : undefined,
      },
      include: { images: true, sizes: true },
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: Number(id) } });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};
