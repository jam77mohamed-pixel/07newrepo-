import React from 'react';

const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  Borrowed: 'bg-blue-50 text-blue-700 border-blue-200',
  Overdue: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse',
  Returned: 'bg-teal-50 text-teal-700 border-teal-200',
  Admin: 'bg-purple-50 text-purple-700 border-purple-200',
  Member: 'bg-sky-50 text-sky-700 border-sky-200',
  available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  outOfStock: 'bg-amber-50 text-amber-700 border-amber-200'
};

export const Badge = ({
  children,
  variant,
  status,
  size = 'md',
  className = '',
  dot = false
}) => {
  const badgeStyle = statusStyles[status || variant] || 'bg-slate-100 text-slate-700 border-slate-200';
  const sizeStyle = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${badgeStyle} ${sizeStyle} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            status === 'Active' || status === 'Returned' || status === 'available'
              ? 'bg-emerald-500'
              : status === 'Overdue'
              ? 'bg-rose-500'
              : status === 'Borrowed'
              ? 'bg-blue-500'
              : 'bg-slate-400'
          }`}
        />
      )}
      {children || status}
    </span>
  );
};
