import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Contact Us
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Have questions, feedback, or need support? Fill out the form below or
          reach us directly. You can also use the chatbot for quick feedback!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          />
          <textarea
            rows="5"
            placeholder="Your Message"
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full p-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          />
          <button
            type="submit"
            className="bg-yellow-400 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-300 transition"
          >
            Send Message
          </button>
        </form>

        <div className="mt-10 text-gray-700 dark:text-gray-300">
          <p><strong>Email:</strong> <link></link>netsoko.care@gmail.com</p>
          <p><strong>Phone:</strong> +254 701 156 348</p>
          <p><strong>Location:</strong> Nairobi, Kenya</p>
        </div>
      </div>
    </div>
  );
}
