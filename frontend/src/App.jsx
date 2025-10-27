import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ChatbotWidget from "./components/ChatbotWidget.jsx";
import Spinner from "./components/Spinner.jsx"; // ✅ import spinner
import { useLoading } from "./context/LoadingContext.jsx"; // ✅ import loading context

// Pages
import Home from "./pages/Home.jsx";
import ProductList from "./pages/ProductList.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/CheckOut.jsx";
import Orders from "./pages/Orders.jsx";
import Profile from "./pages/Profile.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPasswordModal from "./components/ResetPasswordModal";

// Admin
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageProducts from "./pages/admin/ManageProducts.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import ManageOrders from "./pages/admin/ManageOrders.jsx";
import Analytics from "./pages/admin/Analytics.jsx";

// Misc
import Categories from "./pages/Categories.jsx";
import Specials from "./pages/Specials.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Blog from "./pages/Blog.jsx";
import NotFound from "./pages/NotFound.jsx";

function PrivateRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  if (role && user?.role?.toLowerCase() !== role.toLowerCase()) return <Navigate to="/" />;
  return children;
}

function App() {
  const { loading } = useLoading(); // ✅ get loading state

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Global spinner */}
      {loading && <Spinner />}

      {/* Global Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 pt-[80px] md:pt-[90px] transition-all duration-300">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/specials" element={<Specials />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />

          {/* Shop */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/reset-password/:token" element={<ResetPasswordModal />} />

          {/* Private */}
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          {/* Not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer & Chatbot */}
      <Footer />
      <ChatbotWidget />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
