import { prisma } from "../config/db.js";

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
