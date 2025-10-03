import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const USERS_KEY = "muhi_users_v1";
const CURRENT_USER_KEY = "muhi_user";

/**
 * Simple client-side auth for demo/admin flow.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // ensure default admin exists
  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const adminExists = existing.some((u) => u.email === "admin@jewel.com");
      if (!adminExists) {
        const admin = {
          id: `u_admin`,
          firstName: "Admin",
          lastName: "User",
          email: "admin@jewel.com",
          password: "admin123",
          phone: "",
          role: "admin",
        };
        localStorage.setItem(USERS_KEY, JSON.stringify([admin, ...existing]));
      }
    } catch (e) {
      // noop
    }
  }, []);

  // persist current user
  useEffect(() => {
    try {
      if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(CURRENT_USER_KEY);
    } catch {}
  }, [user]);

  /**
   * login(email, password) -> returns true on success, false on failure
   * Also migrates guest cart (muhi_cart_v1) to user's cart if needed and
   * dispatches an in-app auth event so CartContext can react.
   */
  const login = (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const found = users.find(
        (u) =>
          (u.email || "").toLowerCase() === (email || "").toLowerCase() &&
          (u.password || "") === password
      );
      if (!found) {
        alert("Invalid email or password.");
        return false;
      }

      // --- migrate guest cart if present and user's cart is empty ---
      try {
        const guestRaw = localStorage.getItem("muhi_cart_v1");
        const userKey = `muhi_cart_${encodeURIComponent(found.email)}`;
        const userRaw = localStorage.getItem(userKey);
        if (guestRaw && (!userRaw || userRaw === "[]")) {
          localStorage.setItem(userKey, guestRaw);
          localStorage.removeItem("muhi_cart_v1");
        }
      } catch (e) {
        // ignore migration errors
      }

      const publicUser = {
        id: found.id,
        firstName: found.firstName,
        lastName: found.lastName,
        email: found.email,
        role: found.role || "user",
        phone: found.phone || "",
      };

      setUser(publicUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));

      // Dispatch an in-app auth event so CartContext updates immediately
      try {
        window.dispatchEvent(
          new CustomEvent("muhi:auth-change", { detail: { user: publicUser } })
        );
      } catch (e) {}

      return true;
    } catch (e) {
      alert("Login failed (localStorage error).");
      return false;
    }
  };

  /**
   * register(payload) -> creates user (does NOT auto-login).
   * Also ensures new user has an empty per-user cart key.
   */
  const register = (payload) => {
    try {
      const email = (payload.email || "").toLowerCase();
      if (!email) {
        alert("Please provide an email.");
        return;
      }
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      if (users.some((u) => (u.email || "").toLowerCase() === email)) {
        alert("An account with this email already exists.");
        return;
      }
      const newUser = {
        id: `u_${Date.now()}`,
        firstName: payload.firstName || "",
        lastName: payload.lastName || "",
        email,
        password: payload.password || "",
        phone: payload.phone || "",
        role: "user",
      };
      users.unshift(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      // create empty cart for new user
      try {
        const userCartKey = `muhi_cart_${encodeURIComponent(email)}`;
        localStorage.setItem(userCartKey, JSON.stringify([]));
      } catch (e) {
        // ignore
      }

      alert("Account created. You can now login.");
    } catch (e) {
      alert("Registration failed (localStorage error).");
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch {}

    // notify CartContext (and others) that user is now null
    try {
      window.dispatchEvent(
        new CustomEvent("muhi:auth-change", { detail: { user: null } })
      );
    } catch (e) {}
  };

  const getAllUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    } catch {
      return [];
    }
  };

  const updateUserRole = (id, role) => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const idx = users.findIndex((u) => u.id === id);
      if (idx === -1) return false;
      users[idx].role = role;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, getAllUsers, updateUserRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}
