import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as bookService from '../services/bookService';
import { useNotifications } from './NotificationContext';
import { toast } from 'react-toastify';

const BookContext = createContext(null);

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addNotification } = useNotifications();

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (err) {
      console.error('Failed to load books:', err);
      setError(err.message || 'Failed to load books');
      toast.error(err.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const addBook = async (bookData) => {
    try {
      setLoading(true);
      const newBook = await bookService.createBook(bookData);
      setBooks((prev) => [newBook, ...prev]);
      toast.success(`Book "${newBook.title}" added successfully!`);
      
      // Send notification
      addNotification({
        title: 'New Book Added',
        message: `"${newBook.title}" by ${newBook.author} is now available in the library catalog.`,
        type: 'new_book',
        link: '/books'
      });

      return newBook;
    } catch (err) {
      toast.error(err.message || 'Failed to add book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id, updatedData) => {
    try {
      setLoading(true);
      const updated = await bookService.updateBook(id, updatedData);
      setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
      toast.success(`Book "${updated.title}" updated successfully!`);
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id) => {
    try {
      setLoading(true);
      const targetBook = books.find((b) => b.id === id);
      await bookService.deleteBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      toast.success(`Book "${targetBook?.title || 'Book'}" deleted successfully.`);
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to delete book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    books,
    loading,
    error,
    fetchBooks,
    addBook,
    updateBook,
    deleteBook,
    totalBooksCount: books.reduce((acc, b) => acc + (Number(b.totalCopies) || 1), 0),
    uniqueTitlesCount: books.length
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};
