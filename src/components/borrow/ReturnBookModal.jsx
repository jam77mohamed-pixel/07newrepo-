import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { calculateOverdueFine } from '../../utils/fineCalculator';
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

export const ReturnBookModal = ({
  isOpen,
  onClose,
  onConfirmReturn,
  borrowRecord,
  loading = false
}) => {
  if (!borrowRecord) return null;

  const today = new Date().toISOString().split('T')[0];
  const { isOverdue, daysOverdue, fineAmount } = calculateOverdueFine(borrowRecord.dueDate, today);
  const [finePaid, setFinePaid] = useState(fineAmount);

  const handleReturn = () => {
    onConfirmReturn(borrowRecord.id, finePaid);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Return Book & Process Loan"
      size="md"
    >
      <div className="space-y-4">
        {/* Book & Member Info Card */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm space-y-2.5">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-medium">Book Title</span>
              <p className="font-bold text-slate-900 line-clamp-1">{borrowRecord.bookTitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block">Member</span>
              <span className="font-semibold text-slate-800">{borrowRecord.memberName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Borrowed On</span>
              <span className="text-slate-700">{formatDate(borrowRecord.borrowDate)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Due Date</span>
              <span className="font-semibold text-slate-800">{formatDate(borrowRecord.dueDate)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Return Date</span>
              <span className="font-semibold text-indigo-600">{formatDate(today)} (Today)</span>
            </div>
          </div>
        </div>

        {/* Overdue & Fine Alert */}
        {isOverdue ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800">
            <FiAlertTriangle className="text-xl text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <p className="font-bold text-rose-900 text-sm">Overdue Return Warning</p>
              <p className="mt-0.5">
                This book is <strong className="font-bold">{daysOverdue} days overdue</strong>.
                Standard fine is $1.00/day.
              </p>
              <p className="mt-1 font-semibold text-rose-900">
                Calculated Fine: {formatCurrency(fineAmount)}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs">
            <FiCheckCircle className="text-lg text-emerald-600 shrink-0" />
            <p>
              Returned on time. No overdue penalties applied.
            </p>
          </div>
        )}

        {isOverdue && (
          <Input
            type="number"
            label="Fine Amount Collected ($)"
            value={finePaid}
            onChange={(e) => setFinePaid(e.target.value)}
            helperText="Staff can collect fine or adjust/waive if applicable"
          />
        )}

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
            type="button"
            variant="success"
            onClick={handleReturn}
            loading={loading}
            icon={FiCheckCircle}
          >
            Confirm Return
          </Button>
        </div>
      </div>
    </Modal>
  );
};
