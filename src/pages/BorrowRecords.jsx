import React, { useState, useMemo } from 'react';
import { useBorrow } from '../context/BorrowContext';
import { useDebounce } from '../hooks/useDebounce';
import { usePagination } from '../hooks/usePagination';
import { SearchBar } from '../components/common/SearchBar';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { TableSkeleton } from '../components/common/Skeleton';
import { IssueBookModal } from '../components/borrow/IssueBookModal';
import { ReturnBookModal } from '../components/borrow/ReturnBookModal';
import { formatDate, formatCurrency } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import {
  FiRepeat,
  FiBookOpen,
  FiCheckCircle,
  FiAlertTriangle,
  FiClock,
  FiLayers,
  FiArrowLeft
} from 'react-icons/fi';

export const BorrowRecords = () => {
  const navigate = useNavigate();
  const {
    borrowRecords,
    loading,
    issueNewBook,
    returnBorrowedBook,
    activeBorrows,
    overdueBorrows,
    returnedBorrows
  } = useBorrow();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'borrowed', 'overdue', 'returned'
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Modals
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filteredRecords = useMemo(() => {
    return borrowRecords.filter((record) => {
      // Tab filter
      if (activeTab === 'borrowed' && record.status !== 'Borrowed') return false;
      if (activeTab === 'overdue' && record.status !== 'Overdue') return false;
      if (activeTab === 'returned' && record.status !== 'Returned') return false;

      // Search match
      const q = debouncedSearch.toLowerCase().trim();
      if (!q) return true;

      return (
        record.bookTitle.toLowerCase().includes(q) ||
        record.memberName.toLowerCase().includes(q) ||
        record.memberEmail.toLowerCase().includes(q) ||
        (record.bookIsbn && record.bookIsbn.toLowerCase().includes(q))
      );
    });
  }, [borrowRecords, activeTab, debouncedSearch]);

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems,
    goToPage,
    setPageSize
  } = usePagination(filteredRecords, 10);

  const handleIssueSubmit = async (data) => {
    try {
      setActionLoading(true);
      await issueNewBook(data);
      setIssueModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenReturn = (record) => {
    setSelectedRecord(record);
    setReturnModalOpen(true);
  };

  const handleConfirmReturn = async (borrowId, finePaid) => {
    try {
      setActionLoading(true);
      await returnBorrowedBook(borrowId, finePaid);
      setReturnModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Book Details',
      key: 'bookTitle',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <FiBookOpen className="text-base" />
          </div>
          <div>
            <p className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-1">{r.bookTitle}</p>
            <p className="text-[11px] text-slate-400 font-mono">ISBN: {r.bookIsbn || 'N/A'}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Member Patron',
      key: 'memberName',
      render: (r) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">{r.memberName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{r.memberEmail}</p>
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
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatDate(r.dueDate)}</span>
          {r.status === 'Overdue' && (
            <span className="text-[11px] text-rose-600 dark:text-rose-400 font-extrabold">
              {r.daysOverdue} days overdue
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (r) => <Badge status={r.status} size="sm" dot />
    },
    {
      header: 'Fine Record',
      key: 'fineAmount',
      render: (r) => {
        if (r.fineAmount > 0) {
          return (
            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-lg border border-rose-200 dark:border-rose-900">
              {formatCurrency(r.fineAmount)}
            </span>
          );
        }
        return <span className="text-xs text-slate-400">No Fines</span>;
      }
    },
    {
      header: 'Action',
      key: 'action',
      render: (r) => (
        <div>
          {r.status !== 'Returned' ? (
            <Button
              variant={r.status === 'Overdue' ? 'danger' : 'primary'}
              size="sm"
              onClick={() => handleOpenReturn(r)}
              className="text-xs py-1.5 px-3.5 rounded-xl font-bold"
              icon={FiCheckCircle}
            >
              Return Book
            </Button>
          ) : (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <FiCheckCircle className="text-sm" /> Completed
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="secondary"
          size="sm"
          icon={FiArrowLeft}
          onClick={() => navigate('/dashboard')}
          className="text-xs rounded-2xl"
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white m-0">
            Borrow & Return Circulation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Issue books to members, monitor return dates, and manage overdue fine settlements
          </p>
        </div>

        <Button
          variant="primary"
          icon={FiBookOpen}
          onClick={() => setIssueModalOpen(true)}
          className="text-xs sm:text-sm font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-md shadow-indigo-500/20"
        >
          Issue New Book
        </Button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Records', count: borrowRecords.length, icon: FiLayers },
          { id: 'borrowed', label: 'Currently Borrowed', count: activeBorrows.length, icon: FiClock },
          { id: 'overdue', label: 'Overdue Books', count: overdueBorrows.length, icon: FiAlertTriangle, alert: overdueBorrows.length > 0 },
          { id: 'returned', label: 'Returned', count: returnedBorrows.length, icon: FiCheckCircle }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 dark:bg-emerald-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <Icon className={tab.alert && !isActive ? 'text-rose-500' : ''} />
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  isActive
                    ? 'bg-black/20 text-white'
                    : tab.alert
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by book title, member name, or email..."
          className="w-full"
        />
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : filteredRecords.length === 0 ? (
        <EmptyState
          icon={FiRepeat}
          title="No borrow records found"
          message={
            searchTerm
              ? 'No records match your search criteria.'
              : activeTab !== 'all'
              ? `No records found under the "${activeTab}" tab.`
              : 'No books have been issued yet. Click Issue New Book to create your first record.'
          }
          actionLabel={searchTerm ? 'Clear Search' : activeTab === 'all' ? 'Issue Book' : null}
          onAction={() => {
            if (searchTerm) {
              setSearchTerm('');
            } else {
              setIssueModalOpen(true);
            }
          }}
        />
      ) : (
        <Table
          columns={columns}
          data={paginatedItems}
          keyExtractor={(r) => r.id}
        />
      )}

      {/* Pagination */}
      {!loading && filteredRecords.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={goToPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 20, 50]}
        />
      )}

      {/* Modals */}
      <IssueBookModal
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        onSubmit={handleIssueSubmit}
        loading={actionLoading}
      />

      <ReturnBookModal
        isOpen={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        onConfirm={handleConfirmReturn}
        borrowRecord={selectedRecord}
        loading={actionLoading}
      />
    </div>
  );
};
