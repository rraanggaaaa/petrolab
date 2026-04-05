/**
 * Date Formatting Utilities
 * Fungsi untuk memformat tanggal dengan berbagai format
 */

/**
 * Format tanggal ke format Indonesia
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} - Tanggal dalam format "1 Januari 2024"
 */
export const formatDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format tanggal dan waktu ke format Indonesia
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} - Tanggal dalam format "1 Januari 2024, 14:30"
 */
export const formatDateTime = (date) => {
  if (!date) return "-";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format waktu saja
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} - Waktu dalam format "14:30"
 */
export const formatTime = (date) => {
  if (!date) return "-";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";

  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format relative time (e.g., "2 days ago")
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} - Waktu relatif
 */
export const formatRelativeTime = (date) => {
  if (!date) return "-";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";

  const now = new Date();
  const diff = now - d;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
};

/**
 * Format untuk input date (YYYY-MM-DD)
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} - Tanggal dalam format "2024-01-01"
 */
export const formatDateInput = (date) => {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  return d.toISOString().split("T")[0];
};
