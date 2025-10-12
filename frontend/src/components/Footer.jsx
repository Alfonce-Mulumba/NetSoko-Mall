import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-center py-4 mt-10 border-t border-gray-700">
      <p>Copyright © {new Date().getFullYear()} | NetSoko | All rights reserved.</p>
    </footer>
  );
}
