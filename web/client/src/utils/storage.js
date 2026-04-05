/**
 * Local Storage Utilities
 * Fungsi untuk menyimpan, mengambil, dan menghapus data dari localStorage
 */

// Keys untuk localStorage
const KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
};

// Token management
export const setToken = (token) => {
  localStorage.setItem(KEYS.TOKEN, token);
};

export const getToken = () => {
  return localStorage.getItem(KEYS.TOKEN);
};

export const removeToken = () => {
  localStorage.removeItem(KEYS.TOKEN);
};

// User management
export const setUser = (user) => {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem(KEYS.USER);
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem(KEYS.USER);
};

// Theme management
export const setTheme = (theme) => {
  localStorage.setItem(KEYS.THEME, theme);
  document.documentElement.setAttribute("data-theme", theme);
};

export const getTheme = () => {
  return localStorage.getItem(KEYS.THEME) || "light";
};

// Language management
export const setLanguage = (lang) => {
  localStorage.setItem(KEYS.LANGUAGE, lang);
};

export const getLanguage = () => {
  return localStorage.getItem(KEYS.LANGUAGE) || "id";
};

// Clear all auth data
export const clearAuth = () => {
  removeToken();
  removeUser();
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Clear all storage
export const clearAll = () => {
  localStorage.clear();
  sessionStorage.clear();
};
