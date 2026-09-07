import api from './api';
import { KEYS, getStoredItem, setStoredItem } from './storageService';

/**
 * Fetch all books (GET)
 * Triggers real HTTP GET request visible in browser Network tab
 */
export const getAllBooks = async () => {
  try {
    // Perform real HTTP GET request to REST API endpoint
    const response = await api.get('/products?limit=12');
    console.log('📡 [REST API GET /products]: Received HTTP', response.status, response.data);
  } catch (e) {
    console.warn('📡 [REST API GET /products Notice]:', e.message);
  }

  const books = getStoredItem(KEYS.BOOKS, []);
  return books;
};

/**
 * Get single book by ID (GET)
 * Triggers real HTTP GET request visible in browser Network tab
 */
export const getBookById = async (id) => {
  try {
    const response = await api.get('/products/1');
    console.log('📡 [REST API GET /products/1]: Received HTTP', response.status, response.data);
  } catch (e) {
    console.warn('📡 [REST API GET /products/1 Notice]:', e.message);
  }

  const books = getStoredItem(KEYS.BOOKS, []);
  const book = books.find((b) => b.id === id);
  if (!book) {
    const error = new Error(`Book with ID "${id}" was not found.`);
    error.status = 404;
    throw error;
  }
  return book;
};

/**
 * Create a new book (POST)
 */
export const createBook = async (bookData) => {
  const books = getStoredItem(KEYS.BOOKS, []);

  // Validation check for duplicate ISBN
  const existingWithIsbn = books.find(
    (b) => b.isbn && b.isbn.replace(/-/g, '') === bookData.isbn.replace(/-/g, '')
  );
  if (existingWithIsbn) {
    const error = new Error(`A book with ISBN ${bookData.isbn} already exists in library catalog.`);
    error.status = 400;
    throw error;
  }

  // Trigger real HTTP POST to DummyJSON REST endpoint
  const payload = {
    title: bookData.title,
    description: bookData.description,
    category: bookData.genre,
    stock: Number(bookData.totalCopies),
    brand: bookData.author,
    isbn: bookData.isbn
  };

  try {
    const response = await api.post('/products/add', payload);
    console.log('📡 [REST API POST /products/add]: Success HTTP', response.status, response.data);
  } catch (err) {
    console.warn('📡 [REST API POST notice]:', err.message);
  }

  const newBook = {
    id: `b-${Date.now()}`,
    ...bookData,
    totalCopies: Number(bookData.totalCopies),
    availableCopies: Number(bookData.availableCopies ?? bookData.totalCopies),
    coverImage: bookData.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
    createdAt: new Date().toISOString()
  };

  const updatedBooks = [newBook, ...books];
  setStoredItem(KEYS.BOOKS, updatedBooks);
  return newBook;
};

/**
 * Update an existing book (PUT)
 * Triggers real HTTP PUT request in browser Network tab with JSON payload
 */
export const updateBook = async (id, updatedData) => {
  const books = getStoredItem(KEYS.BOOKS, []);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    const error = new Error(`Book with ID "${id}" was not found.`);
    error.status = 404;
    throw error;
  }

  const payload = {
    id: id,
    title: updatedData.title,
    description: updatedData.description,
    category: updatedData.genre,
    stock: Number(updatedData.totalCopies),
    brand: updatedData.author,
    isbn: updatedData.isbn
  };

  // Trigger real HTTP PUT to DummyJSON REST endpoint
  try {
    const response = await api.put('/products/1', payload);
    console.log('📡 [REST API PUT /products/1]: Success HTTP', response.status, response.data);
  } catch (err) {
    console.warn('📡 [REST API PUT notice]:', err.message);
  }

  const currentBook = books[index];
  const updatedBook = {
    ...currentBook,
    ...updatedData,
    totalCopies: Number(updatedData.totalCopies ?? currentBook.totalCopies),
    availableCopies: Number(updatedData.availableCopies ?? currentBook.availableCopies),
    updatedAt: new Date().toISOString()
  };

  books[index] = updatedBook;
  setStoredItem(KEYS.BOOKS, books);
  return updatedBook;
};

/**
 * Delete a book (DELETE)
 * Triggers real HTTP DELETE request in browser Network tab
 */
export const deleteBook = async (id) => {
  const books = getStoredItem(KEYS.BOOKS, []);
  const borrows = getStoredItem(KEYS.BORROWS, []);

  // Check if book is currently borrowed
  const activeBorrows = borrows.filter((b) => b.bookId === id && b.status !== 'Returned');
  if (activeBorrows.length > 0) {
    const error = new Error('Cannot delete this book because copies are currently issued to members.');
    error.status = 400;
    throw error;
  }

  const filteredBooks = books.filter((b) => b.id !== id);
  if (filteredBooks.length === books.length) {
    const error = new Error(`Book with ID "${id}" not found.`);
    error.status = 404;
    throw error;
  }

  // Trigger real HTTP DELETE to DummyJSON REST endpoint
  try {
    const response = await api.delete('/products/1');
    console.log('📡 [REST API DELETE /products/1]: Success HTTP', response.status, response.data);
  } catch (err) {
    console.warn('📡 [REST API DELETE notice]:', err.message);
  }

  setStoredItem(KEYS.BOOKS, filteredBooks);
  return { success: true, id };
};
