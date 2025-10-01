// src/context/CartContext.jsx
import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("muhi_cart_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("muhi_cart_v1", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const updated = prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + qty } : p
        );
        return updated.filter((p) => p.qty > 0); // remove if qty drops to 0
      }

      // ✅ store discount info
      const origPrice = Number(product.originalPrice ?? product.price);
      const discount = Number(product.discount) || 0;
      const finalPrice =
        product.finalPrice ??
        Math.round((origPrice * (1 - discount / 100)) * 100) / 100;

      return [
        {
          ...product,
          originalPrice: origPrice,
          discount,
          price: finalPrice, // price always = discounted
          qty,
        },
        ...prev,
      ];
    });
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((p) => p.id !== id));

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((s, p) => s + (p.qty || 0), 0);

  const subtotal = cart.reduce(
    (sum, p) => sum + (Number(p.price) || 0) * (p.qty || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
