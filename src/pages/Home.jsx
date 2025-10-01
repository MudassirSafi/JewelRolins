// src/pages/Home.jsx
import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { getProducts } from "../services/api.js";
import Hero from "../components/Hero.jsx";
import { CartContext } from "../context/CartContext.jsx";

function ProductCard({ p }) {
  const { addToCart } = useContext(CartContext);

  return (
    <motion.div
      className="border rounded p-3 hover:shadow-xl transition bg-white flex flex-col group"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative overflow-hidden rounded">
        <motion.img
          src={p.image || (p.images?.[0] ?? "")}
          alt={p.title}
          className="w-full h-48 sm:h-56 md:h-60 object-cover rounded transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-500" />
      </div>

      <h3 className="mt-3 font-semibold text-base sm:text-lg">{p.title}</h3>

      {/* ✅ Price & discount display */}
      <div className="mb-3 text-sm sm:text-base">
        {p.discount > 0 ? (
          <>
            <span className="line-through text-gray-500 mr-2">PKR {p.price}</span>
            <span className="font-semibold text-[var(--brand)]">PKR {p.finalPrice}</span>
            <span className="ml-2 text-green-600 text-xs">{p.discount}% OFF</span>
          </>
        ) : (
          <span className="font-semibold">PKR {p.price}</span>
        )}
      </div>

      <button
        onClick={() =>
          addToCart({
            id: p.id,
            title: p.title,
            price: p.finalPrice ?? p.price,
            originalPrice: p.price,
            discount: p.discount || 0,
            image: p.image || (p.images?.[0] ?? ""),
          })
        }
        className="mt-auto px-4 py-2 rounded bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] text-white hover:opacity-90 transition text-sm sm:text-base"
      >
        Add to Cart
      </button>
    </motion.div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const loadProducts = async () => {
      try {
        const apiProducts = await getProducts();
        const stored = JSON.parse(localStorage.getItem("custom_products") || "[]");

        if (mounted) {
          const merged = [
            ...(Array.isArray(apiProducts) ? apiProducts : []),
            ...stored,
          ];

          // ✅ show discounted products first
          merged.sort((a, b) => (b.discount || 0) - (a.discount || 0));

          setProducts(merged);
        }
      } catch (err) {
        console.error("getProducts failed:", err);
        if (mounted) setProducts([]);
      } finally {
        mounted && setLoading(false);
      }
    };

    loadProducts();
    return () => (mounted = false);
  }, []);

  // ✅ normalize categories for partial & case-insensitive match
  const normalize = (str) => str?.toLowerCase() || "";

  let filtered =
    category === "All"
      ? products
      : products.filter((p) => {
          const c = normalize(p.category);
          const t = normalize(p.title);
          const combined = `${c} ${t}`;
          return combined.includes(category.toLowerCase().slice(0, -1));
        });

  if (sort === "low") {
    filtered = [...filtered].sort((a, b) => (a.finalPrice ?? a.price) - (b.finalPrice ?? b.price));
  } else if (sort === "high") {
    filtered = [...filtered].sort((a, b) => (b.finalPrice ?? b.price) - (a.finalPrice ?? a.price));
  }

  const categories = ["All", "Rings", "Watches", "Necklaces", "Earrings", "Bracelets"];

  return (
    <div className="max-w-8xl mx-auto px-3 py-8">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Hero />
      </motion.div>

      {/* OUR PRODUCTS */}
      <section id="our-products" className="mt-12">
        <motion.div
          className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
            Our Products
          </h2>

          <div className="flex flex-wrap gap-3 items-center">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full border transition text-sm sm:text-base ${
                  category === c
                    ? "bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] text-white"
                    : "text-gray-700 hover:text-[var(--brand)]"
                }`}
              >
                {c}
              </button>
            ))}

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="ml-2 px-3 py-2 border rounded-lg text-sm focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </motion.div>

        {loading ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Loading products…
          </motion.div>
        ) : filtered.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((p, i) => (
              <ProductCard key={p.id || i} p={p} />
            ))}
          </div>
        ) : (
          <motion.div
            className="col-span-full text-center text-gray-500 py-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            No products found
          </motion.div>
        )}
      </section>
    </div>
  );
}
