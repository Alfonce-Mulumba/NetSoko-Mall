const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { buyer, products, totalAmount } = req.body;
    const order = await Order.create({ buyer, products, totalAmount });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
