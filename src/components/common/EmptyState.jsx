import React from 'react';
import { FiInbox } from 'react-icons/fi';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = FiInbox,
  title = 'No items found',
  message = 'Try changing your search terms or clearing applied filters.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-4 shadow-xs">
        <Icon className="text-2xl" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
