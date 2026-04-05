/**
 * Validation Utilities
 * Fungsi untuk validasi form dan input
 */

/**
 * Validasi email
 * @param {string} email - Email yang akan divalidasi
 * @returns {boolean} - True jika email valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validasi password strength
 * @param {string} password - Password yang akan divalidasi
 * @returns {Object} - { score, message, isValid }
 */
export const validatePassword = (password) => {
  let score = 0;
  let message = "";

  if (!password) {
    return { score: 0, message: "Password is required", isValid: false };
  }

  if (password.length >= 8) score++;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++;
  if (password.match(/[0-9]/)) score++;
  if (password.match(/[^a-zA-Z0-9]/)) score++;

  if (score === 0) message = "Very Weak";
  else if (score === 1) message = "Weak";
  else if (score === 2) message = "Fair";
  else if (score === 3) message = "Good";
  else if (score === 4) message = "Strong";

  return {
    score,
    message,
    isValid: score >= 3,
  };
};

/**
 * Validasi username
 * @param {string} username - Username yang akan divalidasi
 * @returns {Object} - { isValid, message }
 */
export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, message: "Username is required" };
  }
  if (username.length < 3) {
    return {
      isValid: false,
      message: "Username must be at least 3 characters",
    };
  }
  if (username.length > 50) {
    return {
      isValid: false,
      message: "Username must be less than 50 characters",
    };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      isValid: false,
      message: "Username can only contain letters, numbers, and underscores",
    };
  }
  return { isValid: true, message: "" };
};

/**
 * Validasi phone number
 * @param {string} phone - Nomor telepon yang akan divalidasi
 * @returns {boolean} - True jika nomor telepon valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9+\-\s()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
};

/**
 * Validasi URL
 * @param {string} url - URL yang akan divalidasi
 * @returns {boolean} - True jika URL valid
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validasi required field
 * @param {any} value - Nilai yang akan divalidasi
 * @returns {boolean} - True jika tidak kosong
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return true;
  if (Array.isArray(value)) return value.length > 0;
  return !!value;
};

/**
 * Validasi min length
 * @param {string} value - String yang akan divalidasi
 * @param {number} min - Panjang minimal
 * @returns {boolean} - True jika memenuhi
 */
export const minLength = (value, min) => {
  return value && value.length >= min;
};

/**
 * Validasi max length
 * @param {string} value - String yang akan divalidasi
 * @param {number} max - Panjang maksimal
 * @returns {boolean} - True jika memenuhi
 */
export const maxLength = (value, max) => {
  return !value || value.length <= max;
};

/**
 * Validasi range number
 * @param {number} value - Angka yang akan divalidasi
 * @param {number} min - Nilai minimal
 * @param {number} max - Nilai maksimal
 * @returns {boolean} - True jika dalam range
 */
export const isInRange = (value, min, max) => {
  return value >= min && value <= max;
};
