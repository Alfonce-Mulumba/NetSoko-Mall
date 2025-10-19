import { prisma } from "../config/db.js";

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cartItem = await prisma.cartItem.upsert({
      where: { userId_productId: { userId: req.user.id, productId } },
      update: { quantity: quantity },
      create: { userId: req.user.id, productId, quantity },
    });
    res.status(201).json(cartItem);
  } catch (err) {
    next(err);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.cartItem.delete({ where: { id: Number(id) } });
    res.json({ message: "Item removed" });
  } catch (err) {
    next(err);
  }
};
