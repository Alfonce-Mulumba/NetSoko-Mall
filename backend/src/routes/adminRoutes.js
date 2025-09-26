// backend/src/routes/adminRoutes.js
import express from 'express';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import { pool } from '../config/db.js';

const router = express.Router();

// Add product
router.post('/products', verifyAdmin, async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const product = await db.query(
      'INSERT INTO products(name, price, stock) VALUES($1,$2,$3) RETURNING *',
      [name, price, stock]
    );
    res.json(product.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error adding product', error: err.message });
  }
});

// Get all orders
router.get('/orders', verifyAdmin, async (req, res) => {
  try {
    const orders = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(orders.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

export default router;
