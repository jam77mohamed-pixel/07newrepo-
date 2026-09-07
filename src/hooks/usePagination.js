import { useState, useMemo } from 'react';

/**
 * Custom hook to handle pagination logic
 */
export const usePagination = (items = [], initialPageSize = 8) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Ensure current page doesn't exceed total pages if items shrink
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, validCurrentPage, pageSize]);

  const goToPage = (page) => {
    const pageNum = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNum);
  };

  const nextPage = () => {
    if (validCurrentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (validCurrentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage: validCurrentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    resetPage
  };
};
