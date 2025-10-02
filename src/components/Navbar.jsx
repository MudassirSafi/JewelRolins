import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext); // ✅ cart state
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const closeMenu = () => setOpen(false);

  const normalizeQuery = (q) => {
    let normalized = q.trim().toLowerCase();
    if (normalized.endsWith("s")) {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const normalized = normalizeQuery(query);
      navigate(`/search?q=${encodeURIComponent(normalized)}`);
      setQuery("");
      setOpen(false);
    }
  };

  const baseMenu = ["Home", "About", "Our Story"];

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-3">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-extrabold bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
              JewelRolins
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {baseMenu.map((item, i) => (
              <Link
                key={i}
                to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                className="relative px-1 text-gray-700 transition duration-300 hover:text-[var(--brand)] after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-[var(--brand)] after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
              >
                {item}
              </Link>
            ))}

            {/* ✅ Cart icon with badge */}
            <Link to="/cart" className="relative px-1 text-gray-700 hover:text-[var(--brand)]">
             Cart🛒
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--brand)] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="flex h-9 border rounded overflow-hidden"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="px-3 py-2 flex-1 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] text-white"
              >
                🔍
              </button>
            </form>

            {user ? (
              <button
                onClick={logout}
                className="px-4 py-2 border rounded text-sm transition duration-300 hover:text-white hover:bg-gradient-to-r from-[var(--accent)] to-[var(--brand)]"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 border rounded text-sm transition duration-300 hover:text-white hover:bg-gradient-to-r from-[var(--accent)] to-[var(--brand)]"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="p-2 rounded hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div className="md:hidden pb-4 space-y-2 animate-fadeIn">
            {baseMenu.map((item, i) => (
              <Link
                key={i}
                to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                onClick={closeMenu}
                className="block px-3 py-2 text-gray-700 transition duration-300 hover:text-[var(--brand)] border-b border-transparent hover:border-[var(--brand)]"
              >
                {item}
              </Link>
            ))}

            {/* ✅ Cart mobile */}
            <Link
              to="/cart"
              onClick={closeMenu}
              className="block px-3 py-2 text-gray-700 hover:text-[var(--brand)] border-b border-transparent hover:border-[var(--brand)] relative"
            >
            🛒 Cart
              {cart.length > 0 && (
                <span className="absolute top-1 left-16 bg-[var(--brand)] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Search mobile */}
            <form
              onSubmit={handleSearch}
              className="flex h-9 border rounded overflow-hidden mx-2"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="px-3 py-2 flex-1 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] text-white"
              >
                🔍
              </button>
            </form>

            {user ? (
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 transition duration-300 hover:text-[var(--brand)] border-b border-transparent hover:border-[var(--brand)]"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="block px-3 py-2 text-gray-700 transition duration-300 hover:text-[var(--brand)] border-b border-transparent hover:border-[var(--brand)]"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
