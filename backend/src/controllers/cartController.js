// backend/src/controllers/cartController.js
import { JWT_SECRET, pool } from "../config/db.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const cartItem = await db.query(
      'INSERT INTO cart(user_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *',
      [userId, productId, quantity]
    );
    res.status(201).json(cartItem.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await db.query(
      'SELECT c.id, p.name, p.price, c.quantity FROM cart c JOIN products p ON c.product_id=p.id WHERE c.user_id=$1',
      [userId]
    );
    res.json(items.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM cart WHERE id=$1', [id]);
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing from cart', error: err.message });
  }
};
