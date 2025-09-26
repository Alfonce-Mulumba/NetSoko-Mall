import React, { useState } from "react";

function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I’m SokoBot 🤖 How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");

    // Mock backend response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "I’ll fetch your order status from backend..." }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4">
      {open && (
        <div className="bg-white shadow-lg rounded-lg w-80 h-96 flex flex-col animate-fadeIn">
          <div className="bg-primary text-white px-4 py-2 rounded-t-lg flex justify-between items-center">
            <span>SokoBot</span>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>
          <div className="flex-grow overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[70%] ${
                  msg.from === "bot"
                    ? "bg-gray-200 text-black self-start"
                    : "bg-primary text-white self-end ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-2 flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow border rounded-lg px-2 py-1"
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-primary text-white px-3 py-1 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="bg-primary text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        💬
      </button>
    </div>
  );
}

export default ChatbotWidget;
