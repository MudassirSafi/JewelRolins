// src/context/CartContext.jsx
import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

// localStorage current user key (same as AuthContext)
const CURRENT_USER_KEY = "muhi_user";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    } catch {
      return null;
    }
  };

  // ✅ normalize image path so it’s always a string
  const normalizeImage = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (typeof img === "object") {
      return img.default || img.src || img.url || "";
    }
    return "";
  };

  const sanitizeProduct = (p) => {
    if (!p) return p;
    const copy = { ...p };
    copy.image =
      normalizeImage(copy.image) ||
      normalizeImage(copy.img) ||
      (Array.isArray(copy.images) ? normalizeImage(copy.images[0]) : "") ||
      "";
    return copy;
  };

  const loadCartForUser = (user) => {
    try {
      if (user?.email) {
        const key = `muhi_cart_${encodeURIComponent(user.email)}`;
        const raw = localStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : [];
        setCart(Array.isArray(parsed) ? parsed.map(sanitizeProduct) : []);
      } else {
        // guest or nobody logged in => empty cart
        setCart([]);
      }
    } catch {
      setCart([]);
    }
  };

  // load cart on mount
  useEffect(() => {
    loadCartForUser(getCurrentUser());
  }, []);

  // listen for auth changes from AuthContext (login/logout)
  useEffect(() => {
    const handler = (e) => {
      const user = e?.detail?.user ?? getCurrentUser();
      loadCartForUser(user);
    };
    window.addEventListener("muhi:auth-change", handler);
    return () => window.removeEventListener("muhi:auth-change", handler);
  }, []);

  // persist cart to the current user's key whenever cart changes
  useEffect(() => {
    try {
      const user = getCurrentUser();
      if (user?.email) {
        const key = `muhi_cart_${encodeURIComponent(user.email)}`;
        localStorage.setItem(
          key,
          JSON.stringify(cart.map(sanitizeProduct)) // ✅ always save clean image
        );
      } else {
        localStorage.removeItem("muhi_cart_v1");
      }
    } catch {}
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const updated = prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + qty } : p
        );
        return updated.filter((p) => p.qty > 0);
      }

      const origPrice = Number(product.originalPrice ?? product.price);
      const discount = Number(product.discount) || 0;
      const finalPrice =
        product.finalPrice ??
        Math.round((origPrice * (1 - discount / 100)) * 100) / 100;

      const sanitized = sanitizeProduct(product);

      return [
        {
          ...sanitized,
          originalPrice: origPrice,
          discount,
          price: finalPrice,
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
