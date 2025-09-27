// src/controllers/productController.js
import { prisma } from "../config/db.js";

// ✅ Public: Get all products with images + sizes
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { images: true, sizes: true },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

// ✅ Public: Get product by ID
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
// src/controllers/productController.js

// ✅ Search & filter products
export const searchProducts = async (req, res) => {
  try {
    const {
      q,              // search query (name, description)
      category,       // filter by category
      minPrice,       // price range
      maxPrice,
      sort = "newest", // default sorting
      page = 1,
      limit = 10
    } = req.query;

    const filters = {};

    // 🔎 Search by keyword
    if (q) {
      filters.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    // 📂 Filter by category
    if (category) {
      filters.category = { equals: category };
    }

    // 💰 Filter by price range
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = parseFloat(minPrice);
      if (maxPrice) filters.price.lte = parseFloat(maxPrice);
    }

    // 🔄 Sorting
    let orderBy = { createdAt: "desc" }; // default newest
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };
    if (sort === "newest") orderBy = { createdAt: "desc" };

    // 📄 Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // 📦 Query products
    const products = await prisma.product.findMany({
      where: filters,
      include: { images: true, sizes: true },
      orderBy,
      skip,
      take,
    });

    // 📊 Total count
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


// ✅ Admin: Create product
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

// ✅ Admin: Update product
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

// ✅ Admin: Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: Number(id) } });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};
