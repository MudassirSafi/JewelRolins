// src/pages/Admin/EditProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("custom_products") || "[]");
    const p = products.find((x) => String(x.id) === String(id));
    if (!p) {
      alert("Product not found.");
      navigate("/admin/dashboard");
      return;
    }
    setForm({
      title: p.title || "",
      description: p.description || "",
      price: p.price || 0,
      discount: p.discount || 0,
      category: p.category || "",
      images: p.images || [],
    });
  }, [id, navigate]);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  // ✅ Add image
  const handleImageAdd = () => {
    const url = prompt("Enter image URL:");
    if (!url) return;
    setForm((s) => ({ ...s, images: [...(s.images || []), url] }));
  };

  // ✅ Replace image
  const handleImageReplace = (idx) => {
    const url = prompt("Enter new image URL:");
    if (!url) return;
    setForm((s) => {
      const copy = [...s.images];
      copy[idx] = url;
      return { ...s, images: copy };
    });
  };

  // ✅ Remove image
  const handleImageRemove = (idx) => {
    setForm((s) => {
      const copy = [...s.images];
      copy.splice(idx, 1);
      return { ...s, images: copy };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const products = JSON.parse(localStorage.getItem("custom_products") || "[]");
    const idx = products.findIndex((x) => String(x.id) === String(id));
    if (idx === -1) {
      alert("Product not found.");
      navigate("/admin/dashboard");
      return;
    }
    const price = Number(form.price || 0);
    const discount = Number(form.discount || 0);
    const finalPrice =
      Math.round(price * (1 - discount / 100) * 100) / 100;
    products[idx] = {
      ...products[idx],
      title: form.title,
      description: form.description,
      price,
      discount,
      finalPrice,
      category: form.category,
      images: form.images || [],
    };
    localStorage.setItem("custom_products", JSON.stringify(products));
    alert("✅ Product updated.");
    navigate("/admin/dashboard");
  };

  if (!form) return <div className="text-center py-20">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg"
    >
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#AB80F4] to-purple-500 bg-clip-text text-transparent">
        ✨ Edit Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#AB80F4]"
          required
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#AB80F4]"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-[#AB80F4]"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-[#AB80F4]"
          />
          <input
            name="discount"
            type="number"
            value={form.discount}
            onChange={handleChange}
            placeholder="Discount %"
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-[#AB80F4]"
          />
        </div>

        {/* Images Section */}
        <div>
          <label className="block font-medium mb-2">Product Images</label>
          <button
            type="button"
            onClick={handleImageAdd}
            className="px-4 py-2 rounded-lg shadow text-white bg-gradient-to-r from-[#AB80F4] to-purple-500 hover:opacity-90 transition"
          >
            ➕ Add Image
          </button>

          <div className="grid grid-cols-3 gap-3 mt-3">
            {form.images?.map((u, i) => (
              <div
                key={i}
                className="relative border rounded overflow-hidden group"
              >
                <img
                  src={u}
                  alt=""
                  className="w-full h-28 object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
                  <button
                    type="button"
                    onClick={() => handleImageReplace(i)}
                    className="px-2 py-1 text-xs bg-yellow-500 text-white rounded"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => handleImageRemove(i)}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save / Cancel */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 py-3 rounded-lg shadow font-semibold text-white bg-gradient-to-r from-[#AB80F4] to-purple-500 hover:opacity-90 transition"
          >
            💾 Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="flex-1 py-3 rounded-lg shadow border hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}
