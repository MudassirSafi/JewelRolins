// src/components/AdminLayout.jsx
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold rounded-lg shadow font-semibold text-white bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] hover:opacity-90 transition">
          ⚡ Admin Panel
        </h2>
        <nav className="space-y-3">
          <Link
            to="/admin/dashboard"
            className="block px-3 py-2 rounded-md hover:bg-[#AB80F4]/10 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/add"
            className="block px-3 py-2 rounded-md hover:bg-[#AB80F4]/10 transition"
          >
            Add Product
          </Link>
          <Link
            to="/admin/orders"
            className="block px-3 py-2 rounded-md hover:bg-[#AB80F4]/10 transition"
          >
            Orders
          </Link>
          <Link
            to="/admin/users"
            className="block px-3 py-2 rounded-md hover:bg-[#AB80F4]/10 transition"
          >
            Users
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-md bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90 transition"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
