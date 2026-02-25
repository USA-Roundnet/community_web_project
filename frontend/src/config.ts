// In development, Vite proxy forwards /api/* to the backend target
// configured in `vite.config.js` (default: http://localhost:5000),
// so we use an empty base URL (same-origin requests).
export const API_BASE_URL = '';

export const GEOAPIFY_API_KEY =
  import.meta.env.VITE_GEOAPIFY_API_KEY?.trim() || "";
