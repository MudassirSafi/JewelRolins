// src/pages/Admin/Orders.jsx
import api from "../../services/axiosConfig";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  // ✅ Fetch orders
  useEffect(() => {
    api.get("/api/orders")
      .then(res => {
        setOrders(res.data.orders || []);
        console.log("📦 Orders fetched:", res.data.orders || []);
      })
      .catch(err => {
        console.error("❌ Error fetching orders:", err?.response?.data || err.message);
      });
  }, []);

  // ✅ Change order status manually
  const changeStatus = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}`, { status });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
      console.log(`✅ Order ${orderId} status updated to: ${status}`);
    } catch (err) {
      alert("Error updating status: " + (err.response?.data?.message || err.message));
    }
  };

  // ✅ Verify Stripe Payment when redirected with session_id
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get("session_id");
        if (!sessionId) {
          console.log("ℹ️ No Stripe session_id found in URL, skipping verification.");
          return;
        }

        console.log("🔍 Verifying Stripe payment for session:", sessionId);

        const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const verifyRes = await axios.get(
          `${base}/api/payment/verify?session_id=${encodeURIComponent(sessionId)}`
        );

        const paymentStatus = verifyRes.data.payment_status;
        const orderId = verifyRes.data.orderId;

        console.log("💳 Stripe Verification Response:", verifyRes.data);

        if (paymentStatus === "paid" || paymentStatus === "succeeded") {
          console.log(`✅ Payment Successful for order: ${orderId}`);
          console.log("🎉 Payment status:", paymentStatus);

          // refresh orders list
          const refreshed = await api.get("/api/orders");
          setOrders(refreshed.data.orders || []);
          console.log("🔄 Orders refreshed after payment success.");
        } else if (paymentStatus === "unpaid" || paymentStatus === "pending") {
          console.warn(`⚠️ Payment NOT completed for order: ${orderId}`);
          console.warn("🕒 Payment status:", paymentStatus);
        } else {
          console.error("❌ Unknown payment status received:", paymentStatus);
        }
      } catch (error) {
        console.error("🚨 Payment verification failed:", error?.response?.data || error.message);
      }
    };

    verifyPayment();
  }, []);

  // ✅ No orders case
  if (!orders.length)
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4">Orders</h1>
        <div className="p-6 bg-white rounded shadow text-gray-500">No orders yet.</div>
      </div>
    );

  // ✅ Render orders normally
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
                  Order #{order._id || order.backendId || order.id || i}
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
                value={order.status || "Pending"}
                onChange={(e) => changeStatus(order._id, e.target.value)}
                className="border px-2 py-1 rounded text-sm sm:text-base"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
