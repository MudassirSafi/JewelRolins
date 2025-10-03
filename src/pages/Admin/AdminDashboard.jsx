// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const { getAllUsers } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const load = () => {
      const stored = JSON.parse(localStorage.getItem("custom_products") || "[]");
      setProducts(stored);
      const allOrders = JSON.parse(localStorage.getItem("all_orders") || "[]");
      setOrders(allOrders);
    };

    load();
    const handleStorageOrCustom = () => load();
    window.addEventListener("storage", handleStorageOrCustom);
    window.addEventListener("custom_products_changed", handleStorageOrCustom);

    return () => {
      window.removeEventListener("storage", handleStorageOrCustom);
      window.removeEventListener("custom_products_changed", handleStorageOrCustom);
    };
  }, []);

  const users = getAllUsers();

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const updated = products.filter((p) => String(p.id) !== String(id));
    setProducts(updated);
    localStorage.setItem("custom_products", JSON.stringify(updated));
    try {
      window.dispatchEvent(new Event("storage"));
    } catch {}
    window.dispatchEvent(new Event("custom_products_changed"));
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] bg-clip-text text-transparent">
          Admin Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-sm text-gray-500">Products</div>
            <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--brand)]">
              {products.length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-sm text-gray-500">Users</div>
            <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--brand)]">
              {users.length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-sm text-gray-500">Orders</div>
            <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--brand)]">
              {orders.length}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Products (local)</h2>
          <div className="flex gap-2 flex-wrap">
            <Link
              to="/admin/add"
              className="px-4 py-2 rounded bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] text-white shadow hover:opacity-90 transition text-sm sm:text-base"
            >
              + Add Product
            </Link>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded border bg-white hover:bg-gray-50 transition text-sm sm:text-base"
            >
              View Store
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm md:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 sm:p-3">ID</th>
                <th className="p-2 sm:p-3">Title</th>
                <th className="p-2 sm:p-3">Category</th>
                <th className="p-2 sm:p-3">Price</th>
                <th className="p-2 sm:p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No local products yet.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-2 sm:p-3">{p.id}</td>
                    <td className="p-2 sm:p-3 max-w-[10rem] truncate" title={p.title}>
                      {p.title}
                    </td>
                    <td className="p-2 sm:p-3">{p.category}</td>
                    <td className="p-2 sm:p-3">PKR {p.finalPrice ?? p.price}</td>
                    <td className="p-2 sm:p-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => navigate(`/admin/edit/${p.id}`)}
                          className="px-3 py-1 border rounded hover:bg-gray-100 text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-3 py-1 border rounded text-red-600 hover:bg-red-50 text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
