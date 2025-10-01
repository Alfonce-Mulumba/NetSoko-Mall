import React, { useState } from "react";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import api from "../api/index.js";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("menu");
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState(null);

  const checkStatus = async () => {
    try {
      const res = await api.checkOrderStatus({ orderId });
      setReply(`Order #${res.data.orderId} is "${res.data.status}" — total ${res.data.total}`);
    } catch (err) {
      setReply(err?.response?.data?.message || "Error checking order");
    }
  };

  const sendReport = async () => {
    try {
      const res = await api.reportProblem({ message });
      setReply(res.data.message || "Received");
      setMode("menu");
      setMessage("");
    } catch (err) {
      setReply(err?.response?.data?.message || "Error sending report");
    }
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div className="flex flex-col items-end gap-2">
        {open && (
          <div className="w-80 bg-white p-4 rounded shadow-lg">
            <h4 className="font-semibold">Help Center</h4>
            {reply && <div className="mt-2 p-2 bg-gray-50 rounded">{reply}</div>}

            {mode === "menu" && (
              <div className="mt-3 flex flex-col gap-2">
                <button onClick={() => { setMode("status"); setReply(null); }} className="p-2 bg-primary text-white rounded">Check order status</button>
                <button onClick={() => { setMode("report"); setReply(null); }} className="p-2 bg-gray-100 rounded">Report a problem</button>
              </div>
            )}

            {mode === "status" && (
              <div className="mt-3">
                <input value={orderId} onChange={(e)=>setOrderId(e.target.value)} placeholder="Order ID" className="w-full p-2 border rounded" />
                <div className="flex gap-2 mt-2">
                  <button onClick={checkStatus} className="flex-1 p-2 bg-primary text-white rounded">Check</button>
                  <button onClick={()=>setMode("menu")} className="flex-1 p-2 bg-gray-200 rounded">Back</button>
                </div>
              </div>
            )}

            {mode === "report" && (
              <div className="mt-3">
                <textarea value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Describe the problem" className="w-full p-2 border rounded h-28" />
                <div className="flex gap-2 mt-2">
                  <button onClick={sendReport} className="flex-1 p-2 bg-primary text-white rounded">Send</button>
                  <button onClick={()=>setMode("menu")} className="flex-1 p-2 bg-gray-200 rounded">Back</button>
                </div>
              </div>
            )}
          </div>
        )}

        <button onClick={() => setOpen(o => !o)} className="bg-primary text-white p-3 rounded-full shadow-lg">
          <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
