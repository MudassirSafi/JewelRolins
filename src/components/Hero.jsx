// src/components/Hero.jsx
import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  // Smooth scroll handler for "New Collection"
  const handleScroll = (e) => {
    e.preventDefault();
    const target = document.querySelector("#our-products");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="grid md:grid-cols-2 items-center gap-6 sm:gap-10 pt-6 sm:pt-8 mb-8 sm:mb-12">
      {/* left text with animation */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-snug flex items-center gap-2">
          <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
            Luxury Jewelry
          </span>
          {/* Animated heart */}
          <motion.span
            role="img"
            aria-label="heart"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-pink-500"
          >
            ❤️
          </motion.span>
        </h1>

        <h2 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2 bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] bg-clip-text text-transparent">
          Crafted with Love
        </h2>

        <p className="mt-3 text-gray-600 max-w-md text-base sm:text-lg">
          Discover timeless elegance with our handcrafted rings, necklaces,
          earrings, and watches. Each piece is designed with passion and
          crafted to perfection.
        </p>

        <a
          href="#our-products"
          onClick={handleScroll}
          className="inline-block mt-5 px-6 py-3 rounded-lg shadow font-semibold text-white bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] hover:opacity-90 transition"
        >
          New Collection
        </a>
      </motion.div>

      {/* right image with animation + hover effect */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-center"
      >
        <div className="relative group rounded-lg overflow-hidden shadow-lg w-full max-w-md sm:max-w-lg h-[320px] sm:h-[400px]">
          <img
            src="https://images.unsplash.com/photo-1590370094718-6003d268a11d?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Luxury Jewelry"
            className="w-full h-full object-cover rounded-lg transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
          />
          {/* overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-500 rounded-lg"></div>
        </div>
      </motion.div>
    </section>
  );
}
