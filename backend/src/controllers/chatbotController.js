import Order from "../models/orderModel.js";

export const chatbotReply = async (req, res) => {
  try {
    const { question, userId } = req.body;

    let answer = "Sorry, I didn’t understand that. Please rephrase your question.";

    if (question?.toLowerCase().includes("order status")) {
      const order = await Order.findOne({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });

      answer = order
        ? `Your latest order (#${order.id}) is currently ${order.status}.`
        : "You don’t have any orders yet.";
    }

    if (question?.toLowerCase().includes("help") || question?.toLowerCase().includes("agent")) {
      answer = "I’m connecting you to a human support agent. Please hold on.";
    }

    res.json({ reply: answer });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ message: "Chatbot service unavailable" });
  }
};
