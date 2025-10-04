import { prisma } from "../config/db.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // If product already exists in cart, update instead of duplicate
    const existing = await prisma.cart.findFirst({
      where: { userId, productId },
    });

    let cartItem;
    if (existing) {
      cartItem = await prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      cartItem = await prisma.cart.create({
        data: { userId, productId, quantity },
      });
    }

    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({
      message: "Error adding product to cart",
      error: err.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await prisma.cart.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
            images: {
              select: { url: true }, // ✅ fetch product images
            },
          },
        },
      },
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching cart",
      error: err.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cart.delete({ where: { id: Number(id) } });
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({
      message: "Error removing from cart, try again",
      error: err.message,
    });
  }
};
