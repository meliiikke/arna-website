// Axios'u en üste import et
import axios from "axios";

// API base URL'ini belirleyen fonksiyon
const getApiBaseUrl = () => {
  // Environment variable varsa onu kullan
  if (process.env.REACT_APP_API_BASE_URL) {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    // HTTPS garanti et (sadece production domain'ler için)
    if (baseUrl.includes("arna.one")) {
      return baseUrl.replace(/^http:/, "https:");
    }
    return baseUrl;
  }

  // Development: package.json'da proxy kullanılıyor
  if (process.env.NODE_ENV === "development") {
    return "/api";
  }

  // Production fallback
  return "https://api.arna.one";
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

// API helper functions
export const apiGet = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const apiPost = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const apiPut = async (endpoint, data) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const apiDelete = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
