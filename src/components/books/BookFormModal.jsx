import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { bookSchema } from '../../utils/validationSchemas';
import { BOOK_GENRES } from '../../constants/genres';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { GoogleBooksModal } from './GoogleBooksModal';
import { FiSearch, FiSave, FiPlus } from 'react-icons/fi';

export const BookFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false
}) => {
  const isEdit = !!initialData;
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(bookSchema),
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      genre: '',
      totalCopies: 5,
      availableCopies: 5,
      coverImage: '',
      description: ''
    }
  });

  const coverImageUrl = watch('coverImage');

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        author: initialData.author || '',
        isbn: initialData.isbn || '',
        genre: initialData.genre || '',
        totalCopies: initialData.totalCopies || 1,
        availableCopies: initialData.availableCopies || 1,
        coverImage: initialData.coverImage || '',
        description: initialData.description || ''
      });
    } else {
      reset({
        title: '',
        author: '',
        isbn: '',
        genre: '',
        totalCopies: 5,
        availableCopies: 5,
        coverImage: '',
        description: ''
      });
    }
  }, [initialData, reset, isOpen]);

  const handleGoogleBookSelect = (googleBook) => {
    setValue('title', googleBook.title, { shouldValidate: true });
    setValue('author', googleBook.author, { shouldValidate: true });
    setValue('isbn', googleBook.isbn !== 'N/A' ? googleBook.isbn : '9780000000000', { shouldValidate: true });
    
    // Map genre if matches list or pick closest/custom
    const matchedGenre = BOOK_GENRES.find(
      (g) => g.toLowerCase().includes(googleBook.genre.toLowerCase()) ||
             googleBook.genre.toLowerCase().includes(g.toLowerCase())
    );
    setValue('genre', matchedGenre || 'Fiction', { shouldValidate: true });
    setValue('coverImage', googleBook.coverImage, { shouldValidate: true });
    setValue('description', googleBook.description, { shouldValidate: true });
  };

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEdit ? 'Edit Book Details' : 'Add New Book to Library'}
        subtitle={
          isEdit
            ? 'Update the catalog metadata and stock inventory'
            : 'Fill in the information below or auto-fill with Google Books API'
        }
        size="lg"
      >
        {!isEdit && (
          <div className="mb-5 p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-indigo-900">
                Want to save time?
              </p>
              <p className="text-xs text-indigo-700">
                Search Google Books to automatically import book title, cover, ISBN & synopsis.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={FiSearch}
              onClick={() => setGoogleModalOpen(true)}
              className="bg-white hover:bg-indigo-50 border-indigo-300 text-indigo-700 text-xs shrink-0"
            >
              Auto-fill from Google Books
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Book Title"
              placeholder="e.g. Clean Code"
              {...register('title')}
              error={errors.title?.message}
              required
            />

            <Input
              label="Author(s)"
              placeholder="e.g. Robert C. Martin"
              {...register('author')}
              error={errors.author?.message}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="ISBN (10 or 13 digits)"
              placeholder="e.g. 9780132350884"
              {...register('isbn')}
              error={errors.isbn?.message}
              required
            />

            <Select
              label="Genre / Category"
              placeholder="Select a Genre"
              options={BOOK_GENRES}
              {...register('genre')}
              error={errors.genre?.message}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Total Copies in Library"
              placeholder="e.g. 10"
              {...register('totalCopies')}
              error={errors.totalCopies?.message}
              required
            />

            <Input
              type="number"
              label="Available Copies"
              placeholder="e.g. 8"
              {...register('availableCopies')}
              error={errors.availableCopies?.message}
              helperText="Cannot exceed total copies"
              required
            />
          </div>

          <Input
            label="Cover Image URL"
            placeholder="https://example.com/cover.jpg"
            {...register('coverImage')}
            error={errors.coverImage?.message}
            helperText="Provide a public image link (or use default placeholder)"
          />

          {coverImageUrl && (
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
              <img
                src={coverImageUrl}
                alt="Cover Preview"
                className="w-10 h-14 object-cover rounded shadow-xs"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="text-xs text-slate-500">Image preview loaded</span>
            </div>
          )}

          <Textarea
            label="Description / Synopsis"
            placeholder="Enter book description, plot summary, or highlights..."
            rows={4}
            {...register('description')}
            error={errors.description?.message}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={isEdit ? FiSave : FiPlus}
            >
              {isEdit ? 'Save Changes' : 'Add Book to Catalog'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Google Books Search Sub-modal */}
      <GoogleBooksModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSelectBook={handleGoogleBookSelect}
      />
    </>
  );
};
