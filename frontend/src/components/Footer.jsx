import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="app-container py-6 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} WebWave Mall. All rights reserved.</p>
      </div>
    </footer>
  );
}
