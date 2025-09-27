// frontend/src/hooks/useAdminAuth.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useAdminAuth() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "admin") {
      setIsAdmin(true);
    } else {
      navigate("/dashboard"); // redirect customer
    }
    setLoading(false);
  }, [navigate]);

  return { loading, isAdmin };
}
