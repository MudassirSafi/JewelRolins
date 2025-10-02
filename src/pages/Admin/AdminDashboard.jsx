import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

/**
 * Admin dashboard: shows quick counts and product table (from localStorage.custom_products).
 * Delete here mutates localStorage so changes persist for the UI.
 */
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

    // Listen for changes to custom_products (other tabs or same-tab)
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

    // notify other/listening components
    try {
      window.dispatchEvent(new Event("storage"));
    } catch {}
    window.dispatchEvent(new Event("custom_products_changed"));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Products</div>
          <div className="text-2xl font-semibold">{products.length}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Users</div>
          <div className="text-2xl font-semibold">{users.length}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Orders</div>
          <div className="text-2xl font-semibold">{orders.length}</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Products (local)</h2>
        <div className="flex gap-2">
          <Link
            to="/admin/add"
            className="px-4 py-2 rounded bg-[#006DFF] text-white"
          >
            + Add Product
          </Link>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded border"
          >
            View Store
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
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
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3">{p.title}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">PKR {p.finalPrice ?? p.price}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/edit/${p.id}`)}
                        className="px-3 py-1 border rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1 border rounded text-red-600"
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
  );
}
