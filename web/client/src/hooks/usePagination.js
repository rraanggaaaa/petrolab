import { useState, useCallback } from "react";

/**
 * Custom hook for pagination management
 * Mengelola state pagination dengan mudah
 *
 * @param {Object} options - Konfigurasi pagination
 * @param {number} options.initialPage - Halaman awal (default: 1)
 * @param {number} options.initialLimit - Jumlah item per halaman (default: 10)
 * @param {number} options.totalItems - Total item (default: 0)
 * @returns {Object} - Pagination state and functions
 *
 * @example
 * const { page, limit, pagination, setPage, setLimit } = usePagination();
 *
 * useEffect(() => {
 *   fetchItems({ page, limit });
 * }, [page, limit]);
 */
export const usePagination = (options = {}) => {
  const { initialPage = 1, initialLimit = 10, totalItems = 0 } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const totalPages = Math.ceil(totalItems / limit);

  const goToNextPage = useCallback(() => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  }, [page, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [page]);

  const goToPage = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    },
    [totalPages],
  );

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  const resetPagination = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    totalPages,
    totalItems,
    setPage: goToPage,
    setLimit: changeLimit,
    nextPage: goToNextPage,
    prevPage: goToPrevPage,
    resetPagination,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export default usePagination;
