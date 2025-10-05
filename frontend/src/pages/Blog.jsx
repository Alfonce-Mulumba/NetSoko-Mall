import React from "react";

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "Top 5 Gadgets to Buy This Year",
      date: "October 2025",
      summary:
        "Discover the latest must-have electronics making waves in Kenya's tech scene.",
    },
    {
      id: 2,
      title: "Smart Shopping with NetSoko",
      date: "September 2025",
      summary:
        "Learn how NetSoko helps you shop smarter with verified sellers and secure payments.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition p-6 md:p-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        NetSoko Blog
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {post.date}
            </p>
            <p className="text-gray-700 dark:text-gray-300">{post.summary}</p>
            <button className="text-yellow-500 mt-4 hover:underline">
              Read More →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
