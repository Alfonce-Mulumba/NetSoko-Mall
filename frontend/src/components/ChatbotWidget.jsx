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
  const [position, setPosition] = useState({ x: 24, y: 24 }); // draggable position
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const chatEndRef = useRef(null);

  // Initialize bot greeting
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

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const appendMessage = (from, text) => {
    setMessages((prev) => [...prev, { from, text }]);
  };

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
    }, 25);
  };

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
      setLoading(true);
      appendMessage("bot", "⏳ Checking order...");
      try {
        const res = await api.checkOrderStatus(userMsg);
        setMessages((prev) => prev.slice(0, -1));
        const total =
          res.data.orderItems?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;
        typeBotMessage(`✅ Order #${res.data.id} is "${res.data.status}" — total Ksh ${total}`);
      } catch (err) {
        setMessages((prev) => prev.slice(0, -1));
        typeBotMessage(err?.response?.data?.message || "❌ Error checking order, please try again.");
      }
      setLoading(false);
    } else if (userMsg.length > 5) {
      setLoading(true);
      appendMessage("bot", "⏳ Sending report...");
      try {
        const res = await api.createComplaint({ message: userMsg });
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

  // 🧩 Drag handling
  const handleMouseDown = (e) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div className="fixed z-50">
      {/* Chat window */}
      {open && (
        <div
          style={{
            transform: `translate(${position.x}px, ${-position.y}px)`,
          }}
          className="fixed bottom-6 right-6"
        >
          <div
            onMouseDown={handleMouseDown}
            className="cursor-move select-none flex flex-col bg-white dark:bg-gray-900 
                      rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700
                      w-[90vw] sm:w-80 md:w-96 lg:w-[420px] 
                      h-[70vh] sm:h-[480px] overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 bg-primary text-white flex justify-between items-center">
              <span className="font-bold">NetSokoBot</span>
              <button onClick={() => setOpen(false)} className="text-sm">✕</button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto bg-gray-50 dark:bg-gray-800">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-2 flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[75%] text-sm whitespace-pre-line shadow ${
                      m.from === "bot"
                        ? "bg-green-200 dark:bg-green-700 text-gray-900 dark:text-gray-100"
                        : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="mb-2 flex justify-start">
                  <div className="bg-green-200 dark:bg-green-700 px-3 py-2 rounded-lg flex gap-1 shadow">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef}></div>
            </div>

            {/* Input */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex bg-white dark:bg-gray-900">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-grow px-2 border border-gray-300 dark:border-gray-600 rounded-full 
                           bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                           placeholder-gray-500 dark:placeholder-gray-400"
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
        </div>
      )}

      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(!open)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 
                     p-4 rounded-full shadow-lg text-white hover:scale-105 transition"
        >
          <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
