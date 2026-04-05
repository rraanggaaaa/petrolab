/**
 * Helper Utilities
 * Fungsi helper umum yang sering digunakan
 */

/**
 * Debounce function untuk membatasi frekuensi eksekusi
 * @param {Function} func - Fungsi yang akan di-debounce
 * @param {number} delay - Delay dalam milidetik
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay = 500) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function untuk membatasi eksekusi
 * @param {Function} func - Fungsi yang akan di-throttle
 * @param {number} limit - Limit dalam milidetik
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit = 500) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Copy text to clipboard
 * @param {string} text - Teks yang akan disalin
 * @returns {Promise} - Promise yang resolve ketika berhasil
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
};

/**
 * Download file from URL
 * @param {string} url - URL file
 * @param {string} filename - Nama file
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate random ID
 * @param {number} length - Panjang ID (default: 8)
 * @returns {string} - Random ID
 */
export const generateId = (length = 8) => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
};

/**
 * Truncate text
 * @param {string} text - Teks yang akan dipotong
 * @param {number} maxLength - Panjang maksimal
 * @returns {string} - Teks yang sudah dipotong
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Capitalize first letter of each word
 * @param {string} text - Teks yang akan di-capitalize
 * @returns {string} - Teks dengan huruf pertama kapital
 */
export const capitalizeWords = (text) => {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Slugify string (for URLs)
 * @param {string} text - Teks yang akan di-slugify
 * @returns {string} - Slug
 */
export const slugify = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");
};

/**
 * Get initial from name
 * @param {string} name - Nama
 * @returns {string} - Initial (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Scroll to top of page
 */
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/**
 * Parse error message from API response
 * @param {Error} error - Error object
 * @returns {string} - Error message
 */
export const parseErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

/**
 * Class name merger (alternative to clsx)
 * @param {...any} classes - Class names
 * @returns {string} - Merged class names
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
