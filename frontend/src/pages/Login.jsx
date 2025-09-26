import React from "react";

const Login = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <form className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-green-600">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Login
        </button>
        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <a href="/register" className="text-green-600 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
