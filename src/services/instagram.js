// src/services/instagram.js
import axios from "axios";

/**
 * Try to fetch Instagram oEmbed via your backend if you have one.
 * The backend should call the Instagram oEmbed or Graph API securely
 * (server must keep FB_APP_TOKEN secret).
 *
 * If the backend endpoint is not available, this function will throw and
 * the caller should fall back to manual image URL / manual upload.
 *
 * Usage:
 *   const data = await fetchInstagramViaBackend(postUrl)
 *   // data may contain thumbnail_url, media_url, author_name, caption, html, etc.
 
export async function fetchInstagramViaBackend(postUrl) {
  if (!postUrl) throw new Error("postUrl is required");
  try {
    // expects your server route: GET /api/instagram/fetch?postUrl=...
    const res = await axios.get("/api/instagram/fetch", { params: { postUrl } });
    // backend returns { success: true, data: { ...oembed fields... } }
    return res.data?.data ?? null;
  } catch (err) {
    // bubble up — caller will decide fallback
    throw err;
  }
}


 * NOTE: There is no reliable, supported client-only method to fetch Instagram oEmbed
 * or media_url without a server token. Instagram's oEmbed/Graph API requires an
 * access token and/or app verification, which must be kept secret on the server.
 *
 * For local-only / no-backend workflows, instruct the admin to:
 *  - paste the image URL from Instagram (right-click > Copy image address), or
 *  - download the image and upload it to your hosting / image CDN, or
 *  - paste the direct image link (if the post is public).
 *
 * Do NOT attempt to use scraping techniques or bypass access tokens — those are
 * fragile and may break or violate terms.
 

export function instagramNotAvailableMessage() {
  return {
    message:
      "No backend available to fetch Instagram data. Either (A) run the small server that calls Instagram oEmbed with a secret token, or (B) paste the image URL manually in the Add Product form.",
  };
}


**/