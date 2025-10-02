// ... keep imports
import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { motion } from "framer-motion";
import { getProduct } from "../services/api.js";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProduct(id)
      .then((p) => {
        if (!mounted) return;
        setProduct(p);
      })
      .catch(() => {
        if (mounted) setProduct(null);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [id]);

  const increment = () => setQty((s) => Math.min(99, s + 1));
  const decrement = () => setQty((s) => Math.max(1, s - 1));

  if (loading) return <div className="w-full px-4 py-10 text-center">Loading product…</div>;
  if (!product) return <div className="w-full px-4 py-10 text-center">Product not found</div>;

  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;
  const finalPrice =
    product.finalPrice || Math.round((price * (1 - discount / 100)) * 100) / 100;

  const handleAdd = () => {
    addToCart(
      {
        id: product.id,
        title: product.title,
        price: finalPrice,
        image: product.image,
      },
      qty
    );

    // ✅ feedback animation
    const btn = document.getElementById("add-btn");
    if (btn) {
      btn.classList.add("animate-bounce");
      setTimeout(() => btn.classList.remove("animate-bounce"), 700);
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.div
      className="w-full px-4 lg:px-8 py-10 grid md:grid-cols-2 gap-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* left: product images */}
      <div className="space-y-4">
        <div className="w-full rounded-lg overflow-hidden shadow relative">
          <img
            src={product.image || (product.images?.[0] ?? "")}
            alt={product.title}
            className="w-full h-[420px] object-cover"
          />
          {added && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute top-3 right-3 bg-[var(--brand)] text-white text-sm px-3 py-1 rounded shadow"
            >
              ✓ Added
            </motion.div>
          )}
        </div>
        {/* thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${product.title}-${i}`}
                className="w-full h-20 object-cover rounded cursor-pointer border hover:border-[var(--brand)] transition"
                onClick={() => setProduct((p) => ({ ...p, image: src }))}
              />
            ))}
          </div>
        )}
      </div>

      {/* right */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
          {product.title}
        </h1>
        <p className="text-gray-500 mb-4">{product.subtitle || product.category}</p>

        {discount > 0 ? (
          <div className="mb-4">
            <div className="text-lg text-gray-500 line-through">PKR {price}</div>
            <div className="text-2xl font-semibold text-[var(--brand)]">PKR {finalPrice}</div>
            <div className="text-sm text-green-600">{discount}% OFF</div>
          </div>
        ) : (
          <div className="text-2xl font-semibold text-[var(--brand)] mb-4">PKR {price}</div>
        )}

        <p className="text-gray-700 leading-relaxed mb-6">
          {product.description || "Handcrafted jewelry with premium materials."}
        </p>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border rounded overflow-hidden">
            <button onClick={decrement} className="px-3 py-2 text-lg hover:bg-gray-100">−</button>
            <div className="w-12 text-center py-2">{qty}</div>
            <button onClick={increment} className="px-3 py-2 text-lg hover:bg-gray-100">+</button>
          </div>

          <button
            onClick={handleAdd}
            id="add-btn"
            className="px-6 py-3 bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] hover:opacity-90 text-white font-semibold rounded-lg shadow transition"
          >
            {added ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
