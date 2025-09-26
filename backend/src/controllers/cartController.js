// backend/src/controllers/cartController.js
import { prisma } from "../config/db.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const cartItem = await prisma.cart.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });

    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await prisma.cart.findMany({
      where: { userId },
      include: {
        product: { select: { name: true, price: true } },
      },
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cart.delete({ where: { id: Number(id) } });
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing from cart', error: err.message });
  }
};
