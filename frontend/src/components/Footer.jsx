import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-10">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} Net-Soko. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
