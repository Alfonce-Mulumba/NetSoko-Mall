import { prisma } from "../config/db.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1, colorId, sizeId, price } = req.body;

    const safeColorId = colorId || null;
    const safeSizeId = sizeId || null;

    // Step 1: check if item already exists in cart
    const existingItem = await prisma.cart.findFirst({
      where: {
        userId,
        productId,
        colorId: safeColorId,
        sizeId: safeSizeId,
      },
    });

    let cartItem;
    if (existingItem) {
      // Step 2a: update quantity
      cartItem = await prisma.cart.update({
        where: { id: existingItem.id },
        data: {
          quantity: { increment: quantity },
          price,
        },
      });
    } else {
      // Step 2b: create new entry
      cartItem = await prisma.cart.create({
        data: {
          userId,
          productId,
          quantity,
          price,
          colorId: safeColorId,
          sizeId: safeSizeId,
        },
      });
    }

    res.status(200).json(cartItem);
  } catch (error) {
    console.error("❌ Add to cart failed:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await prisma.cart.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: { images: true },
        },
      },
    });
    res.json(cart);
  } catch (err) {
    console.error("❌ Cart fetch failed:", err);
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.cart.delete({ where: { id: Number(id) } });
    res.json({ message: "Item removed" });
  } catch (err) {
    console.error("❌ Remove failed:", err);
    next(err);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const updated = await prisma.cart.update({
      where: { id: Number(id) },
      data: { quantity },
    });
    res.json(updated);
  } catch (err) {
    console.error("❌ Update quantity failed:", err);
    next(err);
  }
};
