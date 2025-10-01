// src/services/api.js
import axios from "axios";

const LOCAL_KEY = "muhi_local_products_v1";
const DRIVE_API_KEY = "AIzaSyBWN-Vidl_rWoWAg8gEErj49CANp6i6yH4";

/**
 * Convert a Google Drive fileId into a direct viewable URL using Drive API
 */
export async function getDriveImage(fileId) {
  try {
    // check metadata
    const metaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType&key=${DRIVE_API_KEY}`;
    const meta = await axios.get(metaUrl);

    if (meta.data.mimeType && meta.data.mimeType.startsWith("image/")) {
      // direct image URL
      return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${DRIVE_API_KEY}`;
    }
    console.warn("File is not an image:", meta.data);
    return null;
  } catch (err) {
    console.error("Drive API failed", err.response?.data || err);
    return null;
  }
}

/**
 * Get merged products: admin-local products (localStorage) first,
 * then the bundled public products.json.
 */
export async function getProducts() {
  try {
    const res = await axios.get("/products.json");
    const publicProducts = Array.isArray(res.data) ? res.data : [];
    const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    return [...local, ...publicProducts];
  } catch (err) {
    console.warn("Failed to load /products.json:", err?.message || err);
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  }
}

/** Get single product by id from merged list */
export async function getProduct(id) {
  const list = await getProducts();
  return list.find((p) => p.id === id) || null;
}

/**
 * Add product locally (no backend). Returns the saved product (with id).
 */
export function addProduct(product) {
  const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  const id = Date.now().toString();
  const newP = {
    id,
    title: product.title || "Untitled",
    price: Number(product.price || 0),
    image: product.image || "",
    description: product.description || "",
    images: product.images || [],
  };
  local.unshift(newP);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(local));
  return newP;
}

/** Clear local admin-added products (for testing) */
export function clearLocalProducts() {
  localStorage.removeItem(LOCAL_KEY);
}
