import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [8, 12, 24]
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage - delta > 2) {
      pages.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      pages.push('...');
    }

    pages.unshift(1);
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-sm text-slate-600">
      <div className="flex items-center gap-3">
        <span>
          Showing <strong className="text-slate-900 font-semibold">{startItem}</strong> to{' '}
          <strong className="text-slate-900 font-semibold">{endItem}</strong> of{' '}
          <strong className="text-slate-900 font-semibold">{totalItems}</strong> entries
        </span>
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-md border border-slate-200 bg-white py-1 px-2 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          aria-label="Previous Page"
        >
          <FiChevronLeft className="text-base" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`dots-${index}`} className="px-2 py-1 text-slate-400">
                  ...
                </span>
              );
            }
            const isActive = page === currentPage;
            return (
              <button
                key={`page-${page}`}
                type="button"
                onClick={() => onPageChange(page)}
                className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          aria-label="Next Page"
        >
          <FiChevronRight className="text-base" />
        </button>
      </div>
    </div>
  );
};
