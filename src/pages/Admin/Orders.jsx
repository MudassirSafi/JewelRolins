// src/pages/Admin/Orders.jsx
import React, { useEffect, useState } from "react";

/**
 * Displays orders saved in localStorage 'all_orders'.
 * Each order will show basic details and list of items.
 */
export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("all_orders") || "[]");
    setOrders(all);
  }, []);

  const changeStatus = (idx, status) => {
    const copy = [...orders];
    copy[idx].adminStatus = status;
    setOrders(copy);
    localStorage.setItem("all_orders", JSON.stringify(copy));
  };

  if (!orders.length)
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Orders</h1>
        <div className="p-6 bg-white rounded shadow text-gray-500">No orders yet.</div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>

      <div className="space-y-4">
        {orders.map((order, i) => (
          <div key={i} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">Order #{order.backendStoredId || order.backendId || order.id || i}</div>
                <div className="text-sm text-gray-600">Placed: {order.date}</div>
                <div className="text-sm text-gray-600">By: {order.email || order.name}</div>
              </div>

              <div className="text-right">
                <div className="font-semibold">PKR {order.total}</div>
                <div className="text-sm text-gray-600">Delivery: {order.delivery}</div>
              </div>
            </div>

            <div className="mt-3">
              <div className="font-semibold mb-2">Items</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {order.items?.map((it, j) => (
                  <div key={j} className="border rounded p-2">
                    <div className="font-medium">{it.title}</div>
                    <div className="text-sm text-gray-600">
                      Price: PKR {it.price} × {it.qty || 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex gap-2 items-center">
              <span className="text-sm text-gray-600">Admin Status:</span>
              <select
                value={order.adminStatus || "pending"}
                onChange={(e) => changeStatus(i, e.target.value)}
                className="border px-2 py-1 rounded"
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
