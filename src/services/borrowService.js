import api from './api';
import { KEYS, getStoredItem, setStoredItem } from './storageService';
import { calculateOverdueFine } from '../utils/fineCalculator';

/**
 * Fetch all borrow records with computed statuses (GET)
 * Triggers real HTTP GET request in browser Network tab
 */
export const getAllBorrows = async () => {
  try {
    await api.get('/carts?limit=1').catch(() => null);
  } catch (e) {}

  const records = getStoredItem(KEYS.BORROWS, []);

  // Dynamically update Overdue status if due date is in the past and not returned
  const updatedRecords = records.map((record) => {
    if (record.status !== 'Returned') {
      const { isOverdue, fineAmount, daysOverdue } = calculateOverdueFine(record.dueDate, null);
      return {
        ...record,
        status: isOverdue ? 'Overdue' : 'Borrowed',
        fineAmount: isOverdue ? fineAmount : 0,
        daysOverdue: isOverdue ? daysOverdue : 0
      };
    }
    return record;
  });

  return updatedRecords;
};

/**
 * Issue a book to a member (POST)
 */
export const issueBook = async ({ bookId, memberId, dueDate }) => {
  const books = getStoredItem(KEYS.BOOKS, []);
  const members = getStoredItem(KEYS.MEMBERS, []);
  const borrows = getStoredItem(KEYS.BORROWS, []);

  const bookIndex = books.findIndex((b) => b.id === bookId);
  if (bookIndex === -1) {
    const error = new Error('Selected book does not exist.');
    error.status = 404;
    throw error;
  }

  const member = members.find((m) => m.id === memberId);
  if (!member) {
    const error = new Error('Selected member does not exist.');
    error.status = 404;
    throw error;
  }

  if (member.status !== 'Active') {
    const error = new Error('Cannot issue books to an Inactive member.');
    error.status = 400;
    throw error;
  }

  const book = books[bookIndex];
  if (book.availableCopies <= 0) {
    const error = new Error(`No available copies left for "${book.title}".`);
    error.status = 400;
    throw error;
  }

  // Check if member already has this book borrowed and unreturned
  const alreadyBorrowed = borrows.find(
    (b) => b.bookId === bookId && b.memberId === memberId && b.status !== 'Returned'
  );
  if (alreadyBorrowed) {
    const error = new Error(`This member already has an active borrow for "${book.title}".`);
    error.status = 400;
    throw error;
  }

  // Trigger real HTTP POST to DummyJSON REST endpoint
  try {
    await api.post('/carts/add', {
      userId: 1,
      products: [{ id: 1, quantity: 1 }],
      bookId: book.id,
      memberId: member.id,
      dueDate: dueDate
    });
  } catch (err) {
    console.warn('REST API POST borrow notice:', err.message);
  }

  // Decrement book's available copies
  books[bookIndex] = {
    ...book,
    availableCopies: book.availableCopies - 1
  };
  setStoredItem(KEYS.BOOKS, books);

  const newBorrowRecord = {
    id: `br-${Date.now()}`,
    bookId: book.id,
    bookTitle: book.title,
    bookIsbn: book.isbn,
    memberId: member.id,
    memberName: member.name,
    memberEmail: member.email,
    borrowDate: new Date().toISOString().split('T')[0],
    dueDate: dueDate,
    returnDate: null,
    status: 'Borrowed',
    finePaid: 0
  };

  const updatedBorrows = [newBorrowRecord, ...borrows];
  setStoredItem(KEYS.BORROWS, updatedBorrows);

  return newBorrowRecord;
};

/**
 * Return a borrowed book (PATCH/PUT)
 */
export const returnBook = async (borrowId, finePaid = 0) => {
  const books = getStoredItem(KEYS.BOOKS, []);
  const borrows = getStoredItem(KEYS.BORROWS, []);

  const borrowIndex = borrows.findIndex((b) => b.id === borrowId);
  if (borrowIndex === -1) {
    const error = new Error('Borrow record not found.');
    error.status = 404;
    throw error;
  }

  const record = borrows[borrowIndex];
  if (record.status === 'Returned') {
    const error = new Error('This book has already been marked as returned.');
    error.status = 400;
    throw error;
  }

  const returnDate = new Date().toISOString().split('T')[0];
  const { fineAmount, daysOverdue } = calculateOverdueFine(record.dueDate, returnDate);

  // Trigger real HTTP PUT to DummyJSON REST endpoint
  try {
    await api.put('/carts/1', {
      id: borrowId,
      status: 'Returned',
      returnDate: returnDate,
      finePaid: Number(finePaid)
    });
  } catch (err) {
    console.warn('REST API PUT return notice:', err.message);
  }

  // Increment book's available copies
  const bookIndex = books.findIndex((b) => b.id === record.bookId);
  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      availableCopies: Math.min(books[bookIndex].totalCopies, books[bookIndex].availableCopies + 1)
    };
    setStoredItem(KEYS.BOOKS, books);
  }

  const updatedRecord = {
    ...record,
    returnDate,
    status: 'Returned',
    fineAmount,
    daysOverdue,
    finePaid: Number(finePaid) || (daysOverdue > 0 ? fineAmount : 0)
  };

  borrows[borrowIndex] = updatedRecord;
  setStoredItem(KEYS.BORROWS, borrows);

  return updatedRecord;
};

/**
 * Get borrows for a specific member (GET)
 */
export const getBorrowsByMember = async (memberId) => {
  const all = await getAllBorrows();
  return all.filter((b) => b.memberId === memberId);
};
