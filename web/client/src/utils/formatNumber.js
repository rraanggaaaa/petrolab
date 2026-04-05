/**
 * Number Formatting Utilities
 * Fungsi untuk memformat angka, harga, dan persentase
 */

/**
 * Format angka dengan separator ribuan
 * @param {number} number - Angka yang akan diformat
 * @returns {string} - Angka dalam format "1,000,000"
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return "0";
  return new Intl.NumberFormat("id-ID").format(number);
};

/**
 * Format harga ke Rupiah
 * @param {number} price - Harga yang akan diformat
 * @returns {string} - Harga dalam format "Rp 1.000.000"
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Format persentase
 * @param {number} value - Nilai persentase
 * @returns {string} - Persentase dalam format "75%"
 */
export const formatPercentage = (value) => {
  if (value === null || value === undefined) return "0%";
  return `${Math.round(value)}%`;
};

/**
 * Format angka dengan desimal
 * @param {number} number - Angka yang akan diformat
 * @param {number} decimals - Jumlah desimal (default: 2)
 * @returns {string} - Angka dalam format dengan desimal
 */
export const formatDecimal = (number, decimals = 2) => {
  if (number === null || number === undefined) return "0";
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

/**
 * Format ukuran file
 * @param {number} bytes - Ukuran dalam bytes
 * @returns {string} - Ukuran dalam format "1.5 MB"
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Format angka pendek (ribuan, jutaan, miliaran)
 * @param {number} number - Angka yang akan diformat
 * @returns {string} - Angka dalam format pendek "1.5M"
 */
export const formatShortNumber = (number) => {
  if (number === null || number === undefined) return "0";

  if (number >= 1e9) {
    return (number / 1e9).toFixed(1) + "B";
  }
  if (number >= 1e6) {
    return (number / 1e6).toFixed(1) + "M";
  }
  if (number >= 1e3) {
    return (number / 1e3).toFixed(1) + "K";
  }
  return number.toString();
};
