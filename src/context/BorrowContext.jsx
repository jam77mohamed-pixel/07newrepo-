import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as borrowService from '../services/borrowService';
import { useBooks } from './BookContext';
import { useNotifications } from './NotificationContext';
import { toast } from 'react-toastify';

const BorrowContext = createContext(null);

export const BorrowProvider = ({ children }) => {
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fetchBooks } = useBooks();
  const { addNotification } = useNotifications();

  const fetchBorrowRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await borrowService.getAllBorrows();
      setBorrowRecords(data);
    } catch (err) {
      console.error('Failed to load borrow records:', err);
      setError(err.message || 'Failed to load borrow records');
      toast.error(err.message || 'Failed to load borrow records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBorrowRecords();
  }, [fetchBorrowRecords]);

  const issueNewBook = async (issueData) => {
    try {
      setLoading(true);
      const record = await borrowService.issueBook(issueData);
      setBorrowRecords((prev) => [record, ...prev]);
      // Refresh books to update availableCopies
      await fetchBooks();
      toast.success(`Book "${record.bookTitle}" issued successfully to ${record.memberName}!`);
      return record;
    } catch (err) {
      toast.error(err.message || 'Failed to issue book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const returnBorrowedBook = async (borrowId, finePaid = 0) => {
    try {
      setLoading(true);
      const updated = await borrowService.returnBook(borrowId, finePaid);
      setBorrowRecords((prev) => prev.map((r) => (r.id === borrowId ? updated : r)));
      // Refresh books to reflect replenished stock
      await fetchBooks();
      
      const fineMsg = updated.finePaid > 0 ? ` (Overdue fine paid: $${updated.finePaid})` : '';
      toast.success(`Book "${updated.bookTitle}" returned successfully!${fineMsg}`);
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to process return');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMemberHistory = (memberId) => {
    return borrowRecords.filter((r) => r.memberId === memberId);
  };

  const activeBorrows = borrowRecords.filter((r) => r.status === 'Borrowed');
  const overdueBorrows = borrowRecords.filter((r) => r.status === 'Overdue');
  const returnedBorrows = borrowRecords.filter((r) => r.status === 'Returned');
  const totalFinesCalculated = borrowRecords.reduce((sum, r) => sum + (r.fineAmount || 0), 0);

  const value = {
    borrowRecords,
    loading,
    error,
    fetchBorrowRecords,
    issueNewBook,
    returnBorrowedBook,
    getMemberHistory,
    activeBorrows,
    overdueBorrows,
    returnedBorrows,
    totalBorrowedCount: activeBorrows.length + overdueBorrows.length,
    overdueCount: overdueBorrows.length,
    returnedCount: returnedBorrows.length,
    totalFinesCalculated
  };

  return <BorrowContext.Provider value={value}>{children}</BorrowContext.Provider>;
};

export const useBorrow = () => {
  const context = useContext(BorrowContext);
  if (!context) {
    throw new Error('useBorrow must be used within a BorrowProvider');
  }
  return context;
};
