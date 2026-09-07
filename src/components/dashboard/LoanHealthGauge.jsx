import React from 'react';
import { FiCheckCircle, FiAlertTriangle, FiShield, FiDollarSign } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatters';

export const LoanHealthGauge = ({
  totalBorrowed = 0,
  overdueCount = 0,
  totalFines = 0
}) => {
  const activeBorrows = totalBorrowed + overdueCount;
  const onTimeCount = Math.max(0, totalBorrowed - overdueCount);
  const recoveryRate = activeBorrows > 0 ? Math.round((onTimeCount / activeBorrows) * 100) : 95;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-base">
          <FiShield />
        </span>
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white m-0">
            Borrowing Compliance & Health
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            On-time book return rate & overdue fine tracking
          </p>
        </div>
      </div>

      {/* Progress Ring / Gauge */}
      <div className="flex items-center gap-6 py-2">
        <div className="relative flex items-center justify-center shrink-0">
          <svg width="120" height="120" className="transform -rotate-90">
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="transparent"
              stroke="currentColor"
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="12"
            />
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="transparent"
              stroke={recoveryRate > 85 ? '#10b981' : recoveryRate > 70 ? '#f59e0b' : '#ef4444'}
              strokeWidth="12"
              strokeDasharray={`${(recoveryRate / 100) * 301.59} 301.59`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {recoveryRate}%
            </span>
            <span className="text-[9px] font-bold uppercase text-slate-400">On-Time</span>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="flex-1 space-y-2.5">
          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
              <FiCheckCircle className="text-emerald-500" /> On-Time Borrows
            </span>
            <span className="font-extrabold text-slate-900 dark:text-white">{onTimeCount}</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
              <FiAlertTriangle className="text-rose-500" /> Overdue Books
            </span>
            <span className="font-extrabold text-rose-600 dark:text-rose-400">{overdueCount}</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 text-xs text-amber-900 dark:text-amber-200">
            <span className="flex items-center gap-1 font-semibold">
              <FiDollarSign className="text-amber-600" /> Uncollected Fines
            </span>
            <span className="font-extrabold">{formatCurrency(totalFines)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
