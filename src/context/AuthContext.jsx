// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const USERS_KEY = "muhi_users_v1";
const CURRENT_USER_KEY = "muhi_user";

/**
 * Simple client-side auth for demo/admin flow.
 * - Creates a default admin (admin@jewel.com / admin123) if none exists.
 * - Stores users in localStorage (muhi_users_v1).
 * - Stores current logged-in user in localStorage (muhi_user) (public-safe info only).
 *
 * NOTE: This is frontend-only, demo auth. For production, use backend auth + hashed passwords.
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
   * login(email, password) -> returns true on success, false on failure (alerts user)
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
        // friendly alert — Login page does immediate navigate so this helps user
        alert("Invalid email or password.");
        return false;
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
      return true;
    } catch (e) {
      alert("Login failed (localStorage error).");
      return false;
    }
  };

  /**
   * register(payload) -> payload should include firstName, lastName, email, password, phone (optional)
   * Registers as a normal "user" role. Does not auto-login.
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
      // small success hint
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
