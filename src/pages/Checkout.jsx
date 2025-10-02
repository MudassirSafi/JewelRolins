// src/pages/Checkout.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
    paymentMethod: "cod",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    easypaisaNumber: "",
    jazzcashNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const subtotal = cart.reduce(
    (s, p) => s + (Number(p.price) || 0) * (p.qty || 1),
    0
  );
  const shipping = subtotal > 0 ? 150 : 0;
  const total = subtotal + shipping;

  // Input handler with safe/explicit formatting
  const handleChange = (e) => {
    const { name } = e.target;
    let value = e.target.value;

    if (name === "cardNumber") {
      // keep digits only, limit to 16 digits, format as "#### #### #### ####"
      value = value.replace(/\D/g, "").slice(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    } else if (name === "cardExpiry") {
      // MMYY -> MM/YY
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    } else if (name === "cardCVV") {
      value = value.replace(/\D/g, "").slice(0, 3);
    } else if (name === "phone") {
      // user phone: strict 11 digits
      value = value.replace(/\D/g, "").slice(0, 11);
    } else if (name === "easypaisaNumber" || name === "jazzcashNumber") {
      // explicit: Easypaisa / JazzCash both strict 11 digits
      value = value.replace(/\D/g, "").slice(0, 11);
    } else {
      // default: keep the raw value (for name, email, address, city, paymentMethod)
      // (for paymentMethod, we want the radio value)
      // no extra processing
    }

    setForm((s) => ({ ...s, [name]: value }));
  };

  // Validation
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name required";
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
      errs.email = "Valid email required";
    if (!form.address.trim()) errs.address = "Address required";
    if (!form.city.trim()) errs.city = "City required";
    if (!/^03[0-9]{9}$/.test(form.phone))
      errs.phone = "Enter valid phone (03XXXXXXXXX)";

    if (form.paymentMethod === "card") {
      const cleanCard = form.cardNumber.replace(/\s/g, "");
      if (!/^\d{16}$/.test(cleanCard))
        errs.cardNumber = "Card number must be 16 digits";
      if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(form.cardExpiry))
        errs.cardExpiry = "Expiry must be in MM/YY format";
      if (!/^[0-9]{3}$/.test(form.cardCVV))
        errs.cardCVV = "CVV must be 3 digits";
    }

    if (
      form.paymentMethod === "easypaisa" &&
      !/^03[0-9]{9}$/.test(form.easypaisaNumber)
    ) {
      errs.easypaisaNumber = "Enter valid Easypaisa number (03XXXXXXXXX)";
    }

    if (
      form.paymentMethod === "jazzcash" &&
      !/^03[0-9]{9}$/.test(form.jazzcashNumber)
    ) {
      errs.jazzcashNumber = "Enter valid JazzCash number (03XXXXXXXXX)";
    }

    return errs;
  };

  const getEstimatedDelivery = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    setErrors({});
    setLoading(true);

    const orderDetails = {
      id: `order_${Date.now()}`,
      ...form,
      items: cart,
      subtotal,
      shipping,
      total,
      date: new Date().toLocaleString(),
      delivery: getEstimatedDelivery(),
    };

    try {
      const response = await fetch(
        "http://localhost:5000/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderDetails),
        }
      );

      if (!response.ok) throw new Error("Network error while placing order");

      const data = await response.json();

      const toStore = {
        ...orderDetails,
        paymentStatus:
          form.paymentMethod === "cod" ? "Cash on Delivery" : "Paid (Test Mode)",
        backendStoredId: data.storedOrderId || data.id,
      };
      localStorage.setItem("lastOrder", JSON.stringify(toStore));

      const all = JSON.parse(localStorage.getItem("all_orders") || "[]");
      all.unshift(toStore);
      localStorage.setItem("all_orders", JSON.stringify(all));

      clearCart();
      setLoading(false);
      navigate("/success");
    } catch (err) {
      setLoading(false);
      alert("Order failed: " + err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        className="max-w-3xl w-full bg-white p-6 sm:p-8 rounded-xl shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          {["name", "email", "address", "city", "phone"].map((field) => (
            <div key={field}>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={
                  field === "phone"
                    ? "Phone (03XXXXXXXXX)"
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                type={field === "email" ? "email" : "text"}
                className="w-full border px-3 py-2 rounded"
                required
                // mobile friendly numeric keyboard for phone
                {...(field === "phone" ? { inputMode: "numeric" } : {})}
                autoComplete={
                  field === "email"
                    ? "email"
                    : field === "phone"
                    ? "tel"
                    : field === "address"
                    ? "street-address"
                    : undefined
                }
              />
              {errors[field] && (
                <p className="text-red-500 text-sm">{errors[field]}</p>
              )}
            </div>
          ))}

          {/* Payment Methods */}
          <div>
            <label className="font-semibold">Payment Method</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {["cod", "card", "easypaisa", "jazzcash"].map((method) => (
                <label
                  key={method}
                  className={`border rounded p-3 cursor-pointer flex items-center gap-2 ${
                    form.paymentMethod === method ? "border-[var(--accent)] bg-gray-50" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={form.paymentMethod === method}
                    onChange={handleChange}
                  />
                  {method === "cod"
                    ? "Cash on Delivery"
                    : method.charAt(0).toUpperCase() + method.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Conditional Payment Fields */}
          {form.paymentMethod === "card" && (
            <div className="space-y-3">
              <input
                name="cardNumber"
                value={form.cardNumber}
                onChange={handleChange}
                placeholder="#### #### #### ####"
                maxLength={19} // 16 digits + 3 spaces
                className="w-full border px-3 py-2 rounded"
                inputMode="numeric"
                autoComplete="cc-number"
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm">{errors.cardNumber}</p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    name="cardExpiry"
                    value={form.cardExpiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full border px-3 py-2 rounded"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                  />
                  {errors.cardExpiry && (
                    <p className="text-red-500 text-sm">{errors.cardExpiry}</p>
                  )}
                </div>
                <div>
                  <input
                    name="cardCVV"
                    value={form.cardCVV}
                    onChange={handleChange}
                    placeholder="CVV"
                    maxLength={3}
                    className="w-full border px-3 py-2 rounded"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                  />
                  {errors.cardCVV && (
                    <p className="text-red-500 text-sm">{errors.cardCVV}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {form.paymentMethod === "easypaisa" && (
            <div>
              <input
                name="easypaisaNumber"
                value={form.easypaisaNumber}
                onChange={handleChange}
                placeholder="Easypaisa Number (03XXXXXXXXX)"
                maxLength={11}
                className="w-full border px-3 py-2 rounded"
                inputMode="numeric"
              />
              {errors.easypaisaNumber && (
                <p className="text-red-500 text-sm">{errors.easypaisaNumber}</p>
              )}
            </div>
          )}

          {form.paymentMethod === "jazzcash" && (
            <div>
              <input
                name="jazzcashNumber"
                value={form.jazzcashNumber}
                onChange={handleChange}
                placeholder="JazzCash Number (03XXXXXXXXX)"
                maxLength={11}
                className="w-full border px-3 py-2 rounded"
                inputMode="numeric"
              />
              {errors.jazzcashNumber && (
                <p className="text-red-500 text-sm">{errors.jazzcashNumber}</p>
              )}
            </div>
          )}

          {/* Summary */}
          <div className="flex justify-between items-center pt-3">
            <div>
              <div className="text-sm text-gray-600">Subtotal: PKR {subtotal}</div>
              <div className="text-sm text-gray-600">Shipping: PKR {shipping}</div>
              <div className="font-semibold">Total: PKR {total}</div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 w-fit bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] hover:opacity-90 text-white font-semibold rounded transition"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
