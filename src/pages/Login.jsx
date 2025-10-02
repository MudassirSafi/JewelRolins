// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const success = login(email, password);
    if (!success) {
      setError("Invalid email or password. Please try again!");
      return;
    }

    // ✅ get current logged in user
    const currentUser = JSON.parse(localStorage.getItem("muhi_user"));

    // ✅ role-based redirect
    if (currentUser?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
          Login
        </h2>

        {/* Email input */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password input */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Error message */}
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] hover:opacity-90 text-white font-semibold py-2 rounded transition"
        >
          Login
        </button>

        {/* Register link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[var(--brand)] hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
