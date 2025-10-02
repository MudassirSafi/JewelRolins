import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ normalize category input
function normalizeCategory(input) {
  if (!input) return "";
  const normalized = input.trim().toLowerCase();
  const categories = ["Rings", "Watches", "Necklaces", "Earrings", "Bracelets"];
  for (const c of categories) {
    if (c.toLowerCase().includes(normalized) || normalized.includes(c.toLowerCase())) {
      return c;
    }
  }
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

// ✅ Convert Google Drive share link → direct image link
const normalizeDriveLink = (url) => {
  const match = url.match(/[-\w]{25,}/);
  if (match) return `https://drive.google.com/uc?export=view&id=${match[0]}`;
  return url;
};

export default function AddProduct() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    discount: "",
    images: [],
  });
  const [imageInput, setImageInput] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  // ✅ Add image from URL/Google/Unsplash
  const addImageUrl = () => {
    if (!imageInput) return;
    const url = normalizeDriveLink(imageInput.trim());
    setForm((s) => ({ ...s, images: [...s.images, url] }));
    setImageInput("");
    setMessage("✅ Image added.");
  };

  // ✅ Upload from PC
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((s) => ({ ...s, images: [...s.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
    setMessage("✅ Local image(s) added.");
  };

  const handleRemoveImage = (i) => {
    const copy = [...form.images];
    copy.splice(i, 1);
    setForm((s) => ({ ...s, images: copy }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanCategory = normalizeCategory(form.category);
    const existing = JSON.parse(localStorage.getItem("custom_products") || "[]");
    const price = Number(form.price || 0);
    const discount = Number(form.discount || 0);
    const finalPrice = Math.round((price * (1 - discount / 100)) * 100) / 100;

    const newProduct = {
      id: `lp_${Date.now()}`,
      title: form.title || "Untitled",
      description: form.description || "",
      price,
      discount,
      finalPrice,
      category: cleanCategory || "Uncategorized",
      images: form.images || [],
      createdAt: new Date().toISOString(),
    };

    existing.unshift(newProduct);
    localStorage.setItem("custom_products", JSON.stringify(existing));

    // notify other tabs and same-tab listeners
    try {
      // native storage event will only fire in other windows/tabs, not this one,
      // so we do both: setItem (above) + dispatch a custom event for same-tab listeners.
      window.dispatchEvent(new Event("storage")); // helpful for some listeners expecting this
    } catch {}
    window.dispatchEvent(new Event("custom_products_changed"));

    alert("✅ Product added.");
    navigate("/admin/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] bg-clip-text text-transparent">
        Add New Product
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product Description"
          className="w-full border px-3 py-2 rounded"
        />

        {/* Category */}
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category (Rings, Watches...)"
          className="w-full border px-3 py-2 rounded"
        />

        {/* Price + Discount */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="number"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            placeholder="Discount (%)"
            className="border px-3 py-2 rounded"
            min="0"
            max="100"
          />
        </div>

        {/* One Image Section (3 ways) */}
        <div>
          <label className="block font-medium mb-2">Add Image</label>

          {/* URL / Google / Unsplash */}
          <div className="flex gap-2 mb-3">
            <input
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="Paste image URL (Google Drive, Unsplash, etc.)"
              className="flex-1 border px-3 py-2 rounded"
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="px-4 py-2 rounded-lg shadow text-white bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] hover:opacity-90 transition"
            >
              Add
            </button>
          </div>

          {/* Upload from PC */}
          <label className="px-4 py-2 border rounded cursor-pointer inline-block">
            Upload from PC
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Status */}
        {message && <p className="text-green-600 text-sm">{message}</p>}

        {/* Preview */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {form.images.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img}
                alt={`preview-${i}`}
                className="w-full h-24 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(i)}
                className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg shadow font-semibold text-white bg-gradient-to-r from-[var(--accent)] to-[var(--brand)] hover:opacity-90 transition"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}
