// In development, Vite proxy forwards /api/* to the backend target
// configured in `vite.config.js` (default: http://localhost:5000),
// so we use an empty base URL (same-origin requests).
export const API_BASE_URL = '';

// Existing project default key is kept for local developer convenience.
// Override with VITE_GEOAPIFY_API_KEY in .env for your own key.
export const GEOAPIFY_API_KEY =
  import.meta.env.VITE_GEOAPIFY_API_KEY?.trim() ||
  "3cfdf04a71db4f31a3bf17a9d206d45e";
