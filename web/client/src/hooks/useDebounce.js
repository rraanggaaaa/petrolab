import { useState, useEffect } from "react";

/**
 * Custom hook for debouncing values
 * Menunda update value sampai setelah delay waktu tertentu
 * Berguna untuk search input, filter, dll
 *
 * @param {any} value - Nilai yang akan di-debounce
 * @param {number} delay - Delay dalam milidetik (default: 500ms)
 * @returns {any} - Debounced value
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   // Akan dipanggil 500ms setelah user berhenti mengetik
 *   fetchItems({ search: debouncedSearch });
 * }, [debouncedSearch]);
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
