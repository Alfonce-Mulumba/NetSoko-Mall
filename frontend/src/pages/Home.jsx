import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const products = [];

  const lines = [
    "🚀 Hot Deals🔥",
    "💎 Premium Brands",
    "🛒 Fast Checkout",
  ];

  const [displayed, setDisplayed] = useState(["", "", ""]);
  const [phase, setPhase] = useState("typing"); // typing | pausing | deleting
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let timer;

    if (phase === "typing") {
      if (charIndex < lines[lineIndex].length) {
        timer = setTimeout(() => {
          setDisplayed((prev) =>
            prev.map((l, i) => (i === lineIndex ? lines[i].slice(0, charIndex + 1) : l))
          );
          setCharIndex((c) => c + 1);
        }, 80);
      } else {
        if (lineIndex < lines.length - 1) {
          // move to next line
          setTimeout(() => {
            setLineIndex((i) => i + 1);
            setCharIndex(0);
          }, 400);
        } else {
          // all lines done -> pause
          setTimeout(() => setPhase("pausing"), 500);
        }
      }
    }

    if (phase === "pausing") {
      timer = setTimeout(() => {
        setPhase("deleting");
        setLineIndex(lines.length - 1);
        setCharIndex(lines[lines.length - 1].length);
      }, 5000); // pause 5s
    }

    if (phase === "deleting") {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setDisplayed((prev) =>
            prev.map((l, i) => (i === lineIndex ? lines[i].slice(0, charIndex - 1) : l))
          );
          setCharIndex((c) => c - 1);
        }, 60);
      } else {
        if (lineIndex > 0) {
          // move to previous line
          setTimeout(() => {
            setLineIndex((i) => i - 1);
            setCharIndex(lines[lineIndex - 1].length);
          }, 200);
        } else {
          // all lines deleted -> restart
          setPhase("typing");
          setLineIndex(0);
          setCharIndex(0);
        }
      }
    }

    return () => clearTimeout(timer);
  }, [phase, lineIndex, charIndex, displayed, lines]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/background.mp4"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Main Title */}
      <motion.h1
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 
                   text-4xl md:text-6xl text-white font-bold text-center drop-shadow-lg"
      >
        Welcome to <span className="text-indigo-400">NetSoko Mall</span>
      </motion.h1>

      {/* Typewriter Bullets */}
      <ul className="absolute top-1/3 left-12 text-lg md:text-2xl text-gray-200 max-w-xl space-y-2">
        {displayed.map((text, i) => (
          <li key={i} className="list-disc list-inside">
            {text}
            {i === lineIndex && phase !== "pausing" && <span className="animate-pulse">|</span>}
          </li>
        ))}
      </ul>

      {/* Flying Products */}
      {products.map((p, index) => (
        <motion.img
          key={index}
          src={p.src}
          className={`absolute ${p.className}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.1, 1, 0.8],
            y: [0, -30, 30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6,
            delay: index * 0.8,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      ))}

      {/* CTA Button */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <a
          href="/products"
          className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-xl font-semibold shadow-lg hover:bg-indigo-700 transition"
        >
          Shop Now
        </a>
      </div>
    </div>
  );
}
