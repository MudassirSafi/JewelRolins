// src/pages/About.jsx
import React from "react";
import { motion } from "framer-motion";
import JeweRolin from "../assets/JeweRolin.png"; // ✅ adjust extension if it's .png/.jpeg

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-3 py-12 grid md:grid-cols-2 gap-10 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={JeweRolin}
          alt="Our Craft"
          className="rounded-lg shadow-lg"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
          About Us
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We are dedicated to creating timeless jewelry pieces that blend
          artistry and authenticity. Our designs are inspired by cultural
          heritage yet adapted for the modern lifestyle.
        </p>
        <p className="text-gray-700 leading-relaxed">
          From sourcing premium materials to hand-finishing details, every step
          is performed with love and care. Join us in celebrating beauty,
          confidence, and individuality.
        </p>
      </motion.div>
    </div>
  );
}
