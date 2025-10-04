import React, { useState, useContext, useEffect, useRef } from "react";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../context/AuthContext";
import api from "../api/index.js";

export default function ChatbotWidget() {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      setMessages([
        {
          from: "bot",
          text: `👋 Hi ${user.name || "there"}! I’m NetSokoBot.\nChoose an option:\n1️⃣ Check order status\n2️⃣ Report a problem`,
        },
      ]);
    }
  }, [user]);

  // scroll to bottom on every message update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const appendMessage = (from, text) => {
    setMessages((prev) => [...prev, { from, text }]);
  };

  // Bot typing effect
  const typeBotMessage = (fullText) => {
    let i = 0;
    setMessages((prev) => [...prev, { from: "bot", text: "" }]);

    const interval = setInterval(() => {
      i++;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = fullText.slice(0, i);
        return updated;
      });
      if (i >= fullText.length) clearInterval(interval);
    }, 30);
  };

  // Handle sending user input
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    appendMessage("user", userMsg);
    setInput("");

    if (userMsg === "1") {
      typeBotMessage("Please enter your Order ID:");
    } else if (userMsg === "2") {
      typeBotMessage("Please describe the problem, and I’ll forward it to support:");
    } else if (/^\d+$/.test(userMsg)) {
      // Numeric = Order ID
      setLoading(true);
      appendMessage("bot", "⏳ Checking order...");
      try {
        const res = await api.checkOrderStatus(userMsg);
        setMessages((prev) => prev.slice(0, -1)); // remove "checking..."
        const total =
          res.data.orderItems?.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ) || 0;
        typeBotMessage(
          `✅ Order #${res.data.id} is "${res.data.status}" — total Ksh ${total}`
        );
      } catch (err) {
        setMessages((prev) => prev.slice(0, -1));
        typeBotMessage(err?.response?.data?.message || "❌ Error checking order.");
      }
      setLoading(false);
    } else if (userMsg.length > 5) {
      // Long text = complaint
      setLoading(true);
      appendMessage("bot", "⏳ Sending report...");
      try {
        const res = await api.reportProblem({ message: userMsg });
        setMessages((prev) => prev.slice(0, -1));
        typeBotMessage(
          res.data.message ||
            "✅ Your issue has been reported successfully. We will reach out via email."
        );
      } catch (err) {
        setMessages((prev) => prev.slice(0, -1));
        typeBotMessage(err?.response?.data?.message || "❌ Error sending report.");
      }
      setLoading(false);
    } else {
      typeBotMessage("Please choose:\n1️⃣ Check order status\n2️⃣ Report a problem");
    }
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      {/* Chat Window */}
      {open && (
        <div className="flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-80 h-[480px] overflow-hidden">
          {/* Header */}
          <div className="p-3 bg-primary text-white flex justify-between items-center">
            <span className="font-bold">NetSokoBot</span>
            <button onClick={() => setOpen(false)} className="text-sm">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto bg-[#ece5dd]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-2 flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[75%] text-sm whitespace-pre-line shadow ${
                    m.from === "bot"
                      ? "bg-[#dcf8c6] text-gray-900" // WhatsApp green
                      : "bg-white text-gray-900" // WhatsApp white
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="mb-2 flex justify-start">
                <div className="bg-[#dcf8c6] px-3 py-2 rounded-lg flex gap-1 shadow">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input */}
          <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-grow px-2 border border-gray-300 rounded-full bg-white text-gray-800 placeholder-gray-500"
              placeholder="Type here..."
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-primary text-white px-3 py-1 rounded-full"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-full shadow-lg text-white"
      >
        <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
      </button>
    </div>
  );
}
