import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Table } from '../common/Table';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { useBorrow } from '../../context/BorrowContext';

export const MemberHistoryModal = ({ isOpen, onClose, member }) => {
  const { getMemberHistory } = useBorrow();

  if (!member) return null;

  const history = getMemberHistory(member.id);

  const columns = [
    {
      header: 'Book Title',
      key: 'bookTitle',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm line-clamp-1">{row.bookTitle}</p>
          <p className="text-[11px] text-slate-400 font-mono">ISBN: {row.bookIsbn}</p>
        </div>
      )
    },
    {
      header: 'Borrowed Date',
      key: 'borrowDate',
      render: (row) => <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{formatDate(row.borrowDate)}</span>
    },
    {
      header: 'Return Due Date',
      key: 'dueDate',
      render: (row) => <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatDate(row.dueDate)}</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <Badge status={row.status} size="sm" dot />
    },
    {
      header: 'Fine / Return Date',
      key: 'fine',
      render: (row) => {
        if (row.status === 'Returned') {
          return <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Returned on {formatDate(row.returnDate)}</span>;
        }
        if (row.status === 'Overdue') {
          return <span className="text-xs text-rose-600 dark:text-rose-400 font-bold">{formatCurrency(row.fineAmount)} Fine ({row.daysOverdue}d overdue)</span>;
        }
        return <span className="text-xs text-slate-400">-</span>;
      }
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Borrowing History: ${member.name}`}
      subtitle={`Membership ID: ${member.membershipId} • ${member.email}`}
      size="xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Total Borrowed</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{history.length}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Currently Held</span>
            <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {history.filter((h) => h.status !== 'Returned').length}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Overdue Items</span>
            <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400">
              {history.filter((h) => h.status === 'Overdue').length}
            </span>
          </div>
        </div>

        <Table
          columns={columns}
          data={history}
          emptyMessage="This member has not borrowed any books yet."
        />
      </div>
    </Modal>
  );
};
