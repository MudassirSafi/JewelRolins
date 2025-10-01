// src/pages/Success.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Success() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // get order details from localStorage
    const savedOrder = localStorage.getItem("lastOrder");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
      localStorage.removeItem("lastOrder"); // clear after showing
    }
  }, []);

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto px-4 lg:px-8 py-16 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-green-600 text-6xl mb-4">✓</div>
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
        Order Successful!
      </h1>

      {order ? (
        <div className="text-left bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-3">
            Thank you, {order.name}!
          </h2>

          <p className="text-gray-700 mb-1">
            <span className="font-medium">Order ID:</span> {order.id}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-medium">Estimated Delivery:</span>{" "}
            {order.delivery}
          </p>

          <p className="text-gray-700 mb-2">Your order will be shipped to:</p>
          <p className="text-gray-600 mb-4">
            {order.address}, {order.city} <br />
            📞 {order.phone}
          </p>

          <div className="border-t pt-3">
            <h3 className="font-semibold mb-2">Order Summary:</h3>
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm border-b py-1"
              >
                <span>
                  {item.title} × {item.qty}
                </span>
                <span>PKR {(item.price * item.qty).toFixed(0)}</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold mt-3">
              <span>Total</span>
              <span>PKR {order.total.toFixed(0)}</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
      )}

      <Link
        to="/"
        className="px-6 py-3 rounded-lg shadow bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] text-white hover:opacity-90 transition"
      >
        Continue Shopping
      </Link>
    </motion.div>
  );
}
