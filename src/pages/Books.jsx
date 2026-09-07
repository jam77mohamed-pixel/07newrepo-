import React, { useState, useMemo } from 'react';
import { useBooks } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';
import { useBorrow } from '../context/BorrowContext';
import { useTheme } from '../context/ThemeContext';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';
import { BOOK_GENRES } from '../constants/genres';
import { SearchBar } from '../components/common/SearchBar';
import { FilterDropdown } from '../components/common/FilterDropdown';
import { Button } from '../components/common/Button';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { CardSkeleton, TableSkeleton } from '../components/common/Skeleton';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Table } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { BookCard } from '../components/books/BookCard';
import { BookFormModal } from '../components/books/BookFormModal';
import { BookDetailsModal } from '../components/books/BookDetailsModal';
import { IssueBookModal } from '../components/borrow/IssueBookModal';
import { GoogleBooksModal } from '../components/books/GoogleBooksModal';
import {
  FiPlus,
  FiGrid,
  FiList,
  FiSearch,
  FiBook,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiBookOpen,
  FiStar,
  FiFilter
} from 'react-icons/fi';

export const Books = () => {
  const { books, loading, addBook, updateBook, deleteBook } = useBooks();
  const { isAdmin } = useAuth();
  const { issueNewBook } = useBorrow();
  const { currentTheme } = useTheme();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState(''); // '', 'available', 'outOfStock'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Debounced search
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const [selectedBook, setSelectedBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Filter & Search Logic
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Search match (title, author, ISBN)
      const q = debouncedSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.isbn.toLowerCase().includes(q);

      // Genre match
      const matchesGenre = !selectedGenre || book.genre === selectedGenre;

      // Availability match
      const isAvail = Number(book.availableCopies) > 0;
      const matchesAvailability =
        !availabilityFilter ||
        (availabilityFilter === 'available' && isAvail) ||
        (availabilityFilter === 'outOfStock' && !isAvail);

      return matchesSearch && matchesGenre && matchesAvailability;
    });
  }, [books, debouncedSearch, selectedGenre, availabilityFilter]);

  // Live Auto-Suggestions for SearchBar
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.trim().length < 1) return [];
    const q = searchTerm.toLowerCase().trim();
    return books
      .filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.isbn && b.isbn.includes(q)))
      .slice(0, 5)
      .map((b) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        genre: b.genre,
        coverImage: b.coverImage,
        rawBook: b
      }));
  }, [books, searchTerm]);

  // Pagination hook
  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems,
    goToPage,
    setPageSize
  } = usePagination(filteredBooks, viewMode === 'grid' ? 8 : 10);

  // Handlers
  const handleOpenAdd = () => {
    setSelectedBook(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (book) => {
    setSelectedBook(book);
    setFormModalOpen(true);
  };

  const handleOpenDetails = (book) => {
    setSelectedBook(book);
    setDetailsModalOpen(true);
  };

  const handleOpenIssue = (book) => {
    setSelectedBook(book);
    setIssueModalOpen(true);
  };

  const handleOpenDelete = (book) => {
    setBookToDelete(book);
    setConfirmDeleteOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      setActionLoading(true);
      if (selectedBook) {
        await updateBook(selectedBook.id, data);
      } else {
        await addBook(data);
      }
      setFormModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    try {
      setActionLoading(true);
      await deleteBook(bookToDelete.id);
      setConfirmDeleteOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleIssueSubmit = async (data) => {
    try {
      setActionLoading(true);
      await issueNewBook(data);
      setIssueModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  // Popular Genres for Quick Filter Pills
  const topGenrePills = ['All', 'Fiction', 'Technology', 'Science', 'Self-Help', 'History', 'Biography'];

  // Table columns definition for list view
  const tableColumns = [
    {
      header: 'Book Details',
      key: 'title',
      render: (book) => (
        <div className="flex items-center gap-3">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-10 h-14 object-cover rounded-xl bg-slate-100 dark:bg-slate-800 shadow-xs shrink-0"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
            }}
          />
          <div className="min-w-0">
            <p
              onClick={() => handleOpenDetails(book)}
              className="font-bold text-slate-900 dark:text-white text-sm hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer truncate"
            >
              {book.title}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">by {book.author}</p>
          </div>
        </div>
      )
    },
    {
      header: 'ISBN',
      key: 'isbn',
      render: (book) => <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{book.isbn}</span>
    },
    {
      header: 'Genre',
      key: 'genre',
      render: (book) => (
        <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-full font-semibold">
          {book.genre}
        </span>
      )
    },
    {
      header: 'Stock Status',
      key: 'availableCopies',
      render: (book) => (
        <div className="flex flex-col gap-1">
          <Badge
            status={Number(book.availableCopies) > 0 ? 'available' : 'outOfStock'}
            size="sm"
            dot
          >
            {book.availableCopies} of {book.totalCopies} Available
          </Badge>
        </div>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (book) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleOpenDetails(book)}
            className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            title="View Details"
          >
            <FiEye className="text-base" />
          </button>
          {isAdmin && (
            <>
              {Number(book.availableCopies) > 0 && (
                <button
                  type="button"
                  onClick={() => handleOpenIssue(book)}
                  className="p-1.5 rounded-xl text-indigo-600 dark:text-emerald-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                  title="Issue Book"
                >
                  <FiBookOpen className="text-base" />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleOpenEdit(book)}
                className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                title="Edit Book"
              >
                <FiEdit2 className="text-base" />
              </button>
              <button
                type="button"
                onClick={() => handleOpenDelete(book)}
                className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                title="Delete Book (Admin Action)"
              >
                <FiTrash2 className="text-base" />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white m-0 flex items-center gap-2">
            Library Catalog
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse, search, and manage book holdings with real-time stock tracking
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              icon={FiSearch}
              onClick={() => setGoogleModalOpen(true)}
              className="text-xs font-bold rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs"
            >
              Google Books API
            </Button>
            <Button
              variant="primary"
              icon={FiPlus}
              onClick={handleOpenAdd}
              className="text-xs sm:text-sm font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-md shadow-indigo-500/20"
            >
              Add New Book
            </Button>
          </div>
        )}
      </div>

      {/* Quick Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {topGenrePills.map((g) => {
          const isAll = g === 'All';
          const active = isAll ? !selectedGenre : selectedGenre === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGenre(isAll ? '' : g)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by title, author, or ISBN..."
          className="flex-1"
          suggestions={searchSuggestions}
          onSelectSuggestion={(item) => {
            if (item.rawBook) {
              handleOpenDetails(item.rawBook);
            } else {
              setSearchTerm(item.title || '');
            }
          }}
        />

        <div className="flex flex-wrap items-center gap-2.5">
          <FilterDropdown
            label="Genre"
            value={selectedGenre}
            onChange={setSelectedGenre}
            options={BOOK_GENRES}
            allLabel="All Categories"
          />

          <FilterDropdown
            label="Availability"
            value={availabilityFilter}
            onChange={setAvailabilityFilter}
            options={[
              { label: 'Available (In Stock)', value: 'available' },
              { label: 'Out of Stock', value: 'outOfStock' }
            ]}
            allLabel="All Stock Status"
          />

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <FiGrid className="text-base" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Table View"
            >
              <FiList className="text-base" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <TableSkeleton rows={6} cols={5} />
        )
      ) : filteredBooks.length === 0 ? (
        <EmptyState
          icon={FiBook}
          title="No books match your criteria"
          message={
            searchTerm || selectedGenre || availabilityFilter
              ? 'Try adjusting your search query or filter options.'
              : 'The library catalog is currently empty. Add your first book to get started!'
          }
          actionLabel={
            searchTerm || selectedGenre || availabilityFilter
              ? 'Clear Filters'
              : isAdmin
              ? 'Add Book'
              : null
          }
          onAction={() => {
            if (searchTerm || selectedGenre || availabilityFilter) {
              setSearchTerm('');
              setSelectedGenre('');
              setAvailabilityFilter('');
            } else if (isAdmin) {
              handleOpenAdd();
            }
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {paginatedItems.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onViewDetails={handleOpenDetails}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onIssue={handleOpenIssue}
            />
          ))}
        </div>
      ) : (
        <Table
          columns={tableColumns}
          data={paginatedItems}
          keyExtractor={(book) => book.id}
        />
      )}

      {/* Pagination Footer */}
      {!loading && filteredBooks.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={goToPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={viewMode === 'grid' ? [8, 12, 24] : [10, 20, 50]}
        />
      )}

      {/* Modals */}
      <BookFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedBook}
        loading={actionLoading}
      />

      <BookDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        book={selectedBook}
        onIssue={handleOpenIssue}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <IssueBookModal
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        onSubmit={handleIssueSubmit}
        preselectedBook={selectedBook}
        loading={actionLoading}
      />

      <GoogleBooksModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSelectBook={(googleBook) => {
          setSelectedBook(googleBook);
          setFormModalOpen(true);
        }}
      />

      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete "${bookToDelete?.title || 'Book'}"?`}
        message="This book will be permanently removed from the catalog. This action cannot be reversed."
        loading={actionLoading}
      />
    </div>
  );
};
