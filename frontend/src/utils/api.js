// Axios'u en üste import et
import axios from "axios";

// API base URL'ini belirleyen fonksiyon
const getApiBaseUrl = () => {
  // Environment variable varsa onu kullan
  if (process.env.REACT_APP_API_BASE_URL) {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    console.log("🌐 Using REACT_APP_API_BASE_URL:", baseUrl);

    // HTTPS garanti et (production domain'ler için)
    if (baseUrl.includes("arna.one")) {
      return baseUrl.replace(/^http:/, "https:");
    }
    return baseUrl;
  }

  // Development: package.json'da proxy kullanılıyor
  if (process.env.NODE_ENV === "development") {
    console.log("🌐 Development mode: using proxy /api");
    return "/api";
  }

  // Production fallback - arna.one domain'i için
  const baseUrl = "https://api.arna.one";
  console.log("🌐 Production fallback:", baseUrl);
  return baseUrl;
};

// Export edilen API base URL
export const API_BASE_URL = getApiBaseUrl();

// Backend base URL (API olmadan)
export const BACKEND_BASE_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL.replace("/api", "")
  : API_BASE_URL;

// Resim URL'lerini normalize eden yardımcı fonksiyon
export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  // Cloudinary için HTTPS garanti et
  if (imageUrl.includes("cloudinary.com")) {
    return imageUrl.replace(/^http:/, "https:");
  }

  // Zaten HTTPS ise olduğu gibi döndür
  if (imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // Zaten HTTP ise HTTPS'e çevir (production için)
  if (imageUrl.startsWith("http://")) {
    return imageUrl.replace(/^http:/, "https:");
  }

  // Local uploads URL'leri için backend base URL ekle
  if (imageUrl.startsWith("/uploads/")) {
    const fullUrl = `${BACKEND_BASE_URL}${imageUrl}`;
    return fullUrl;
  }

  // Relative URL'ler için backend base URL ekle
  if (imageUrl.startsWith("uploads/")) {
    const fullUrl = `${BACKEND_BASE_URL}/${imageUrl}`;
    return fullUrl;
  }

  // Eski img- formatındaki URL'leri filtrele (Cloudinary'ye geçiş için)
  if (
    imageUrl.includes("img-") &&
    (imageUrl.match(/img-\d+-\d+\.(jpg|jpeg|png|webp|gif)/i) ||
      imageUrl.match(/img-\d+\.(jpg|jpeg|png|webp|gif)/i))
  ) {
    return null;
  }

  // Diğer durumlar için olduğu gibi döndür
  return imageUrl;
};

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // CORS credentials için
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API request helper function
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await api({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error) {
    return { error: error.message || "API request failed" };
  }
};

// GET request helper
export const apiGet = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: "GET" });
};

// POST request helper
export const apiPost = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, { ...options, method: "POST", data });
};

// PUT request helper
export const apiPut = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, { ...options, method: "PUT", data });
};

// DELETE request helper
export const apiDelete = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: "DELETE" });
};

// Authenticated request helper
export const apiRequestAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return { error: "No authentication token found" };
  }

  return apiRequest(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

// Authenticated GET request
export const apiGetAuth = (endpoint, options = {}) => {
  return apiRequestAuth(endpoint, { ...options, method: "GET" });
};

// Authenticated POST request
export const apiPostAuth = (endpoint, data, options = {}) => {
  return apiRequestAuth(endpoint, { ...options, method: "POST", data });
};

// Authenticated PUT request
export const apiPutAuth = (endpoint, data, options = {}) => {
  return apiRequestAuth(endpoint, { ...options, method: "PUT", data });
};

// Authenticated DELETE request
export const apiDeleteAuth = (endpoint, options = {}) => {
  return apiRequestAuth(endpoint, { ...options, method: "DELETE" });
};

// FormData upload functions for image uploads
export const apiUploadAuth = async (endpoint, formData) => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return { error: "No authentication token found" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message || "Upload failed" };
  }
};

export const apiUpdateUploadAuth = async (endpoint, formData) => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return { error: "No authentication token found" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message || "Update failed" };
  }
};

export default api;
