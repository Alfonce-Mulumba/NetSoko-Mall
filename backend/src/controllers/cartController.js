import { prisma } from "../config/db.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, price: true, discount: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Compute effective price (after discount)
    const effectivePrice =
      product.discount && product.discount > 0
        ? product.price - (product.price * product.discount) / 100
        : product.price;

    // If product already exists in cart, update it
    const existing = await prisma.cart.findFirst({
      where: { userId, productId },
    });

    let cartItem;
    if (existing) {
      cartItem = await prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity, price: effectivePrice },
      });
    } else {
      cartItem = await prisma.cart.create({
        data: { userId, productId, quantity, price: effectivePrice },
      });
    }

    res.status(201).json(cartItem);
  } catch (err) {
    console.error("Error adding product to cart:", err);
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
            description: true,
            price: true,
            discount: true,
            images: { select: { url: true } },
          },
        },
      },
    });

    // Ensure frontend gets computed discounted price as well
    const formatted = items.map((item) => {
      const product = item.product;
      const discountedPrice =
        product.discount && product.discount > 0
          ? product.price - (product.price * product.discount) / 100
          : product.price;

      return {
        ...item,
        product: {
          ...product,
          discountedPrice,
        },
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching cart:", err);
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
    console.error("Error removing from cart:", err);
    res.status(500).json({
      message: "Error removing from cart, try again",
      error: err.message,
    });
  }
};
