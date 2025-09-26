// backend/src/routes/adminRoutes.js
import express from 'express';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import { prisma } from '../config/db.js';

const router = express.Router();

// Add product
router.post('/products', verifyAdmin, async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const product = await prisma.product.create({
      data: { name, price: Number(price), stock: Number(stock) },
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error adding product', error: err.message });
  }
});

// Get all orders
router.get('/orders', verifyAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

export default router;
