// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // if redirected to login from private route, we can go back after login
  const from = location.state?.from || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    // demo login — replace with backend validate when available
    login(email, password);
    navigate(from, { replace: true });
  };

  return (
    <motion.div
      className="min-h-[80vh] flex items-center justify-center px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#006DFF]"
          />
          <input
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#006DFF]"
          />
          <button
            type="submit"
            className="w-full py-2 bg-[#006DFF] hover:bg-blue-700 text-white rounded font-semibold"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#006DFF] hover:underline">Register</Link>
        </p>
      </div>
    </motion.div>
  );
}
