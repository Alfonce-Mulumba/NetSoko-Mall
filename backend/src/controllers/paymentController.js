// backend/src/controllers/paymentController.js

// Initialize payment (dummy example)
export const initPayment = async (req, res) => {
  try {
    const { amount, phone } = req.body;

    if (!amount || !phone) {
      return res.status(400).json({ message: "Amount and phone are required" });
    }

    // Normally you'd call M-Pesa API here...
    res.json({
      success: true,
      message: "Payment initialized",
      data: { amount, phone }
    });
  } catch (err) {
    res.status(500).json({ message: "Error initializing payment", error: err.message });
  }
};

// Confirm payment (dummy example)
export const confirmPayment = async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    // Normally you'd verify with payment provider...
    res.json({
      success: true,
      message: "Payment confirmed",
      data: { transactionId }
    });
  } catch (err) {
    res.status(500).json({ message: "Error confirming payment", error: err.message });
  }
};
