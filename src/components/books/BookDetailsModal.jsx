import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { FiBookOpen, FiCalendar, FiHash, FiLayers, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';

export const BookDetailsModal = ({ isOpen, onClose, book, onIssue, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();

  if (!book) return null;

  const isAvailable = Number(book.availableCopies) > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Information & Catalog Details"
      size="lg"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Cover image */}
        <div className="w-full md:w-48 shrink-0 flex flex-col items-center">
          <div className="w-40 sm:w-48 aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-stone-100 border border-stone-200">
            <img
              src={book.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400'}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
              }}
            />
          </div>
          <div className="mt-3 text-center">
            <Badge status={isAvailable ? 'available' : 'outOfStock'} dot>
              {isAvailable ? `${book.availableCopies} Available` : 'Out of Stock'}
            </Badge>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200/60">
                {book.genre}
              </span>
            </div>
            <h3 className="text-xl font-black text-stone-900 leading-snug">{book.title}</h3>
            <p className="text-sm font-semibold text-stone-600 mt-1">by {book.author}</p>

            <div className="grid grid-cols-2 gap-3 my-4 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs">
              <div className="flex items-center gap-2">
                <FiHash className="text-stone-400 text-sm" />
                <div>
                  <span className="text-stone-400 block">ISBN</span>
                  <span className="font-bold text-stone-800 font-mono">{book.isbn}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiLayers className="text-stone-400 text-sm" />
                <div>
                  <span className="text-stone-400 block">Total Inventory</span>
                  <span className="font-bold text-stone-800">{book.totalCopies} Copies</span>
                </div>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <FiCalendar className="text-stone-400 text-sm" />
                <div>
                  <span className="text-stone-400 block">Cataloged Date</span>
                  <span className="font-bold text-stone-800">{formatDate(book.createdAt)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Synopsis & Description
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-h-40 overflow-y-auto pr-1">
                {book.description || 'No detailed synopsis provided.'}
              </p>
            </div>
          </div>

          {/* Action footer */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              {isAdmin && onDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  icon={FiTrash2}
                  onClick={() => {
                    onClose();
                    onDelete(book);
                  }}
                  className="text-xs rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Delete Book
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              {isAdmin && onEdit && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={FiEdit2}
                  onClick={() => {
                    onClose();
                    onEdit(book);
                  }}
                  className="text-xs rounded-xl font-bold"
                >
                  Edit
                </Button>
              )}

              {isAdmin && isAvailable && onIssue && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={FiBookOpen}
                  onClick={() => {
                    onClose();
                    onIssue(book);
                  }}
                  className="text-xs rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                >
                  Issue This Book
                </Button>
              )}

              <Button variant="secondary" size="sm" onClick={onClose} className="text-xs rounded-xl">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
