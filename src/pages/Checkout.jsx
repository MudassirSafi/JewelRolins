// src/pages/Checkout.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { motion } from "framer-motion";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    phone: "",
    cardNumber: "",
    easypaisaNumber: "",
    jazzcashNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((s, p) => s + (Number(p.price) || 0) * (p.qty || 1), 0);
  const shipping = subtotal > 0 ? 150 : 0;
  const total = subtotal + shipping;

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const getEstimatedDelivery = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderDetails = {
      id: `order_${Date.now()}`,
      name: form.name,
      email: form.email,
      address: form.address,
      city: form.city,
      phone: form.phone,
      items: cart,
      subtotal,
      shipping,
      total,
      date: new Date().toLocaleString(),
      delivery: getEstimatedDelivery(),
    };

    try {
      // send to backend (your existing test server)
      const response = await fetch("http://localhost:5000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });

      if (!response.ok) {
        const txt = await response.text().catch(() => "");
        throw new Error(`Network response was not ok: ${response.status} ${txt}`);
      }

      const data = await response.json();

      // Save to localStorage for success page
      const toStore = { ...orderDetails, paymentStatus: "Paid (Test Mode)", backendStoredId: data.storedOrderId || data.id };
      localStorage.setItem("lastOrder", JSON.stringify(toStore));

      // Also append to all_orders so admin can track multiple orders
      try {
        const all = JSON.parse(localStorage.getItem("all_orders") || "[]");
        all.unshift(toStore);
        localStorage.setItem("all_orders", JSON.stringify(all));
      } catch (err) {
        console.warn("Could not persist order to all_orders:", err);
      }

      clearCart();
      setLoading(false);
      navigate("/success");
    } catch (err) {
      setLoading(false);
      alert("Payment/order failed: " + (err.message || err));
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div className="max-w-3xl w-full bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="w-full border px-3 py-2 rounded" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="w-full border px-3 py-2 rounded" required />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full border px-3 py-2 rounded" required />
          <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full border px-3 py-2 rounded" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border px-3 py-2 rounded" required />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="Card number (test)" className="w-full border px-3 py-2 rounded" />
            <input name="easypaisaNumber" value={form.easypaisaNumber} onChange={handleChange} placeholder="Easypaisa (optional)" className="w-full border px-3 py-2 rounded" />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600">Subtotal: PKR {subtotal}</div>
              <div className="text-sm text-gray-600">Shipping: PKR {shipping}</div>
              <div className="font-semibold">Total: PKR {total}</div>
            </div>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-[#006DFF] text-white rounded">
              {loading ? "Processing..." : "Pay & Place Order"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
