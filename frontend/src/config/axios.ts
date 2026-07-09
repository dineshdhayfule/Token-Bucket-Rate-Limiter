import axios from "axios";

// Determine the base URL:
// 1. If user set a custom URL in localStorage settings, use it.
// 2. Fallback to Vite env variable VITE_API_BASE_URL.
function getBaseUrl() {
  try {
    const raw = localStorage.getItem("app-settings");
    if (raw) {
      const settings = JSON.parse(raw);
      if (settings.backendUrl) {
        return settings.backendUrl;
      }
    }
  } catch {
    // Ignore parse errors
  }
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
}

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Dynamically update baseURL if settings change
api.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  return config;
});

// Response Interceptor: Basic error logging and preventing raw HTML
api.interceptors.response.use(
  (response) => {
    const contentType = response.headers["content-type"];
    if (
      typeof response.data === "string" &&
      typeof contentType === "string" &&
      contentType.includes("text/html")
    ) {
      return Promise.reject(new Error("UNEXPECTED_HTML_RESPONSE"));
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
