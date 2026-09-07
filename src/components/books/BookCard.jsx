import React from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { FiBookOpen, FiEdit2, FiTrash2, FiEye, FiHash } from 'react-icons/fi';

export const BookCard = ({
  book,
  onViewDetails,
  onEdit,
  onDelete,
  onIssue
}) => {
  const { isAdmin } = useAuth();
  const isAvailable = Number(book.availableCopies) > 0;
  const percentage = Math.min(
    100,
    Math.round((Number(book.availableCopies) / Math.max(1, Number(book.totalCopies))) * 100)
  );

  return (
    <div className="group rounded-3xl bg-white p-4 border border-stone-200/90 shadow-xs hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 truncate">
          {book.genre || 'General'}
        </span>

        <Badge status={isAvailable ? 'available' : 'outOfStock'} size="sm" dot>
          {isAvailable ? `${book.availableCopies} Left` : 'Out of Stock'}
        </Badge>
      </div>

      {/* Book Cover Image */}
      <div
        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 mb-3.5 cursor-pointer"
        onClick={() => onViewDetails(book)}
      >
        <img
          src={book.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400'}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <span className="text-white text-xs font-bold flex items-center gap-1.5 drop-shadow-md">
            <FiEye className="text-sm" /> Click to View Details
          </span>
        </div>
      </div>

      {/* Book Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onViewDetails(book)}
            className="font-black text-stone-900 text-base leading-snug line-clamp-1 hover:text-amber-700 cursor-pointer transition-colors"
            title={book.title}
          >
            {book.title}
          </h3>
          <p className="text-xs font-medium text-stone-500 line-clamp-1 mt-0.5">
            by <span className="text-stone-700">{book.author}</span>
          </p>

          <div className="flex items-center gap-1 text-[11px] text-stone-400 font-mono mt-1">
            <FiHash className="text-[10px]" />
            <span>ISBN: {book.isbn || 'N/A'}</span>
          </div>

          {/* Stock Meter */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 mb-1">
              <span>Copies: {book.availableCopies} / {book.totalCopies}</span>
              <span className={percentage > 30 ? 'text-amber-700' : 'text-rose-600'}>{percentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentage > 50
                    ? 'bg-amber-600'
                    : percentage > 20
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-stone-100">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewDetails(book)}
            className="flex-1 text-xs rounded-xl"
            icon={FiEye}
          >
            Details
          </Button>

          {isAdmin && (
            <>
              {isAvailable && onIssue && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onIssue(book)}
                  className="flex-1 text-xs rounded-xl bg-amber-600 hover:bg-amber-700 text-white"
                  icon={FiBookOpen}
                >
                  Issue
                </Button>
              )}
              <button
                type="button"
                onClick={() => onEdit(book)}
                className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-amber-700 transition-colors cursor-pointer"
                title="Edit Book Details"
              >
                <FiEdit2 className="text-sm" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(book)}
                className="p-2 rounded-xl text-stone-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                title="Delete Book (Admin Action)"
              >
                <FiTrash2 className="text-sm" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
