import React, { useState } from "react";

export default function Toast() {
  const [msg, setMsg] = useState(null);

  return msg ? (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
      {msg}
    </div>
  ) : null;
}
