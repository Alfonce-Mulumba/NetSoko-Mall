import { prisma } from "../config/db.js";

export const getProducts = async (req, res, next) => {
  try {
    const { limit = 12, sort } = req.query;
    const products = await prisma.product.findMany({
      take: Number(limit),
      orderBy: sort
        ? sort === "price_asc"
          ? { price: "asc" }
          : sort === "price_desc"
          ? { price: "desc" }
          : { createdAt: "desc" }
        : { createdAt: "desc" },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getHotProducts = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await prisma.product.findMany({
      where: { hot: true },
      take: limit,
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const { q = "", minPrice = 0, maxPrice = 1000000, limit = 24 } = req.query;
    const products = await prisma.product.findMany({
      where: {
        name: { contains: q, mode: "insensitive" },
        price: { gte: Number(minPrice), lte: Number(maxPrice) },
      },
      take: Number(limit),
    });
    res.json({ products });
  } catch (err) {
    next(err);
  }
};
