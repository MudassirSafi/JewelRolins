// src/pages/Cart.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import cartAnimation from "../assets/Shopping.json";

export default function Cart() {
  const { cart, removeFromCart, clearCart, addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, p) => sum + (Number(p.price) || 0) * (p.qty || 1),
    0
  );

  if (!cart.length) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>

        <div className="flex justify-center mb-6">
          {/* responsive Lottie size */}
          <Lottie
            animationData={cartAnimation}
            loop
            autoplay
            className="w-56 h-56 sm:w-72 sm:h-72"
          />
        </div>

        <Link
          to="/"
          className="inline-block mt-2 px-5 py-2 rounded bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] text-white hover:opacity-90 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto px-3 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
        Your Cart
      </h1>

      {/* single column on mobile, 3 columns on md+ (items take 2 cols, summary 1 col) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart items list */}
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => {
            const orig = Number(item.originalPrice || item.price);
            const unit = Number(item.price);
            const disc = Number(item.discount) || 0;

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border rounded-lg p-3 bg-white shadow-sm"
              >
                {/* responsive image: full width on mobile, fixed square on sm+ */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full sm:w-24 h-44 sm:h-24 object-cover rounded flex-shrink-0"
                />

                {/* details: allow truncation by using min-w-0 */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.title}</h3>

                  {disc > 0 ? (
                    <div className="text-sm">
                      <span className="line-through text-gray-500 mr-2">
                        PKR {orig}
                      </span>
                      <span className="font-semibold text-[var(--brand)]">
                        PKR {unit}
                      </span>
                      <span className="ml-2 text-green-600 text-xs">
                        {disc}% OFF
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm font-semibold">PKR {unit}</p>
                  )}

                  {/* qty controls - flow naturally under details on mobile */}
                  <div className="mt-3 sm:mt-2 flex items-center gap-2">
                    <button
                      aria-label={`Decrease quantity of ${item.title}`}
                      onClick={() => addToCart(item, -1)}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      −
                    </button>

                    <div className="px-3">{item.qty}</div>

                    <button
                      aria-label={`Increase quantity of ${item.title}`}
                      onClick={() => addToCart(item, 1)}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* item totals: tucked to the right on sm+; below on mobile */}
                <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-right flex-shrink-0 sm:w-32">
                  <div className="font-semibold">
                    PKR {(unit * (item.qty || 1)).toFixed(0)}
                  </div>
                  {disc > 0 && (
                    <div className="text-xs text-green-600">
                      Saved PKR {((orig - unit) * (item.qty || 1)).toFixed(0)}
                    </div>
                  )}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-2 px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <aside className="border rounded-lg p-5 h-fit bg-white shadow-sm md:sticky md:top-24">
          <div className="text-lg font-semibold mb-3">Order Summary</div>
          <div className="flex justify-between mb-2">
            <div>Subtotal</div>
            <div className="font-semibold">PKR {subtotal.toFixed(0)}</div>
          </div>
          <div className="text-sm text-gray-500 mb-4">
            Shipping calculated at checkout
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full px-4 py-2 mb-3 rounded bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] text-white hover:opacity-90 transition"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={clearCart}
            className="w-full px-4 py-2 border rounded text-sm hover:bg-gray-50"
          >
            Clear Cart
          </button>
        </aside>
      </div>
    </motion.div>
  );
}
