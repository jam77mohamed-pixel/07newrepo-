import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBorrow } from '../context/BorrowContext';
import { Table } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { formatDate, formatCurrency } from '../utils/formatters';
import {
  FiBookmark,
  FiBookOpen,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiArrowLeft,
  FiBook
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

export const MyBorrows = () => {
  const { user } = useAuth();
  const { borrowRecords } = useBorrow();
  const navigate = useNavigate();

  // Filter records belonging to the current user (by email or id or member name)
  const myRecords = useMemo(() => {
    if (!user) return [];
    return borrowRecords.filter(
      (r) =>
        r.memberEmail?.toLowerCase() === user.email?.toLowerCase() ||
        r.memberId === user.id ||
        r.memberName?.toLowerCase().includes('current user')
    );
  }, [borrowRecords, user]);

  const activeBorrows = myRecords.filter((r) => r.status === 'Borrowed');
  const overdueBorrows = myRecords.filter((r) => r.status === 'Overdue');
  const returnedBorrows = myRecords.filter((r) => r.status === 'Returned');
  const totalFines = myRecords.reduce((sum, r) => sum + (r.fineAmount || 0), 0);

  const columns = [
    {
      header: 'Book Title',
      key: 'bookTitle',
      render: (r) => (
        <div>
          <p className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-1">{r.bookTitle}</p>
          <p className="text-xs text-slate-400 font-mono">ISBN: {r.bookIsbn || 'N/A'}</p>
        </div>
      )
    },
    {
      header: 'Issued Date',
      key: 'borrowDate',
      render: (r) => <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{formatDate(r.borrowDate)}</span>
    },
    {
      header: 'Return Due Date',
      key: 'dueDate',
      render: (r) => (
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {formatDate(r.dueDate)}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (r) => <Badge status={r.status} size="sm" dot />
    },
    {
      header: 'Overdue Fines / Return Status',
      key: 'fine',
      render: (r) => {
        if (r.status === 'Overdue') {
          return (
            <span className="text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-lg border border-rose-200 dark:border-rose-900">
              {formatCurrency(r.fineAmount)} ({r.daysOverdue} days late)
            </span>
          );
        }
        if (r.status === 'Returned') {
          return (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              Returned on {formatDate(r.returnDate)}
            </span>
          );
        }
        return <span className="text-xs text-slate-400">Please return on or before due date</span>;
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Navigation & Back Button */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="secondary"
          size="sm"
          icon={FiArrowLeft}
          onClick={() => navigate('/books')}
          className="text-xs rounded-2xl"
        >
          Back to Books Catalog
        </Button>

        <Link to="/books">
          <Button variant="primary" size="sm" icon={FiBook} className="text-xs font-bold rounded-2xl">
            Browse Available Books
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white m-0">
          My Borrowed Books & History
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Keep track of your active borrowed books, return due dates, and past library readings
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Borrows"
          value={activeBorrows.length}
          subtitle="Currently reading"
          icon={FiBookOpen}
          color="indigo"
          sparklineData={[2, 3, 2, 4, 3, 5, 4]}
        />

        <StatCard
          title="Overdue Books"
          value={overdueBorrows.length}
          subtitle="Action required"
          icon={FiAlertTriangle}
          color="rose"
        />

        <StatCard
          title="Returned Books"
          value={returnedBorrows.length}
          subtitle="Completed readings"
          icon={FiCheckCircle}
          color="emerald"
          sparklineData={[3, 5, 8, 10, 12, 14, 18]}
        />

        <StatCard
          title="Outstanding Fines"
          value={formatCurrency(totalFines)}
          subtitle="$1.00 per day overdue"
          icon={FiClock}
          color="amber"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Your Reading History</h3>
          <Link
            to="/books"
            className="text-xs font-bold text-indigo-600 dark:text-emerald-400 hover:underline"
          >
            Explore More Books →
          </Link>
        </div>

        {myRecords.length === 0 ? (
          <EmptyState
            icon={FiBookmark}
            title="No borrowed books"
            message="You currently do not have any active or past borrowed books recorded in the library system."
            actionLabel="Browse Available Catalog"
            onAction={() => navigate('/books')}
          />
        ) : (
          <Table
            columns={columns}
            data={myRecords}
            keyExtractor={(r) => r.id}
          />
        )}
      </div>
    </div>
  );
};
