import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

/**
 * Custom hook for authentication
 * Menggunakan AuthContext untuk mengakses state dan fungsi autentikasi
 *
 * @returns {Object} - Auth context value
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

// Export juga sebagai default untuk fleksibilitas
export default useAuth;
