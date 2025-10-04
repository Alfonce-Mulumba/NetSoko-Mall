import React, { useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I’m NetSokoBot 🤖. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    if (input.toLowerCase().includes("order")) {
      setMessages((m) => [...m, { from: "bot", text: "Checking your order status..." }]);
    } else {
      setMessages((m) => [...m, { from: "bot", text: "I’ll connect you with support." }]);
    }
    setInput("");
  };

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-primary text-white px-4 py-2 rounded-full shadow-lg"
      >
        Chat
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white dark:bg-gray-900 
                        border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg flex flex-col transition">
          <div className="p-3 bg-primary text-white font-bold">NetSokoBot</div>

          <div className="flex-grow p-3 overflow-y-auto h-64">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-2 ${m.from === "bot" ? "text-left" : "text-right"}`}
              >
                <span
                  className={`px-3 py-2 rounded-lg ${
                    m.from === "bot"
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      : "bg-green-200 dark:bg-green-700 text-gray-800 dark:text-gray-100"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex">
            <input
              className="flex-grow px-2 border border-gray-300 dark:border-gray-600 
                         rounded bg-white dark:bg-gray-800 
                         text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type here..."
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-primary text-white px-3 py-1 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
