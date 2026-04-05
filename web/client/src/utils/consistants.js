/**
 * Constants
 * Konstanta yang digunakan di seluruh aplikasi
 */

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  ITEMS: {
    BASE: "/items",
    CATEGORIES: "/items/categories",
    STATS: "/items/stats",
  },
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
  },
  ADMIN: {
    USERS: "/admin/users",
    STATS: "/admin/stats",
  },
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [5, 10, 25, 50, 100],
};

// Stock status
export const STOCK_STATUS = {
  IN_STOCK: "in_stock",
  LOW_STOCK: "low_stock",
  OUT_OF_STOCK: "out_of_stock",
};

export const getStockStatus = (quantity) => {
  if (quantity === 0) return STOCK_STATUS.OUT_OF_STOCK;
  if (quantity < 5) return STOCK_STATUS.LOW_STOCK;
  return STOCK_STATUS.IN_STOCK;
};

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

// Toast notification duration (ms)
export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
};

// Date formats
export const DATE_FORMATS = {
  DATE: "YYYY-MM-DD",
  DATETIME: "YYYY-MM-DD HH:mm:ss",
  DISPLAY_DATE: "DD MMMM YYYY",
  DISPLAY_DATETIME: "DD MMMM YYYY, HH:mm",
  API_DATE: "YYYY-MM-DD",
  API_DATETIME: "YYYY-MM-DD HH:mm:ss",
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
};

// Theme options
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

// Language options
export const LANGUAGES = {
  ID: "id",
  EN: "en",
};

export const LANGUAGE_LABELS = {
  [LANGUAGES.ID]: "Bahasa Indonesia",
  [LANGUAGES.EN]: "English",
};
