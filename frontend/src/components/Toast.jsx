import React, { useEffect, useState } from "react";

export default function Toast() {
  // lightweight global toast via localStorage simple approach
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const handler = () => {
      const payload = localStorage.getItem("app:toast");
      if (payload) {
        setMsg(JSON.parse(payload));
        localStorage.removeItem("app:toast");
        setTimeout(() => setMsg(null), 3500);
      }
    };
    window.addEventListener("storage", handler);
    handler();
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (!msg) return null;
  return (
    <div className="fixed right-6 bottom-6 bg-white p-4 border rounded shadow-md">
      <div className="font-semibold">{msg.title}</div>
      <div className="text-sm">{msg.body}</div>
    </div>
  );
}
