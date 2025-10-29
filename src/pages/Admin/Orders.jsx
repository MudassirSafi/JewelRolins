// src/pages/Admin/Orders.jsx
import api from "../../services/axiosConfig";
import React, { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  api.get("/api/orders")
    .then(res => setOrders(res.data.orders || []));
}, []);

const changeStatus = async (orderId, status) => {
  try {
    await api.put(`/api/orders/${orderId}`, { status });
    setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
  } catch (err) {
    alert("Error updating status: " + (err.response?.data?.message || err.message));
  }
};

  if (!orders.length)
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4">Orders</h1>
        <div className="p-6 bg-white rounded shadow text-gray-500">No orders yet.</div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4">Orders</h1>

      <div className="space-y-4">
        {orders.map((order, i) => (
          <div key={i} className="bg-white p-4 rounded shadow text-sm sm:text-base">
            {/* Order Info */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <div className="font-semibold">
                  Order #{order.backendStoredId || order.backendId || order.id || i}
                </div>
                <div className="text-gray-600 text-xs sm:text-sm">Placed: {order.date}</div>
                <div className="text-gray-600 text-xs sm:text-sm">By: {order.email || order.name}</div>
              </div>

              <div className="sm:text-right">
                <div className="font-semibold">PKR {order.total}</div>
                <div className="text-gray-600 text-xs sm:text-sm">Delivery: {order.delivery}</div>
              </div>
            </div>

            {/* Items */}
            <div className="mt-3">
              <div className="font-semibold mb-2">Items</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {order.items?.map((it, j) => (
                  <div key={j} className="border rounded p-2">
                    <div className="font-medium">{it.title}</div>
                    <div className="text-gray-600 text-xs sm:text-sm">
                      Price: PKR {it.price} × {it.qty || 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-gray-600 text-xs sm:text-sm">Admin Status:</span>
              <select
                value={order.adminStatus || "pending"}
                onChange={(e) => changeStatus(i, e.target.value)}
                className="border px-2 py-1 rounded text-sm sm:text-base"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
