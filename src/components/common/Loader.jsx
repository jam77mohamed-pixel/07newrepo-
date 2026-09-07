import React from 'react';
import { FaSpinner } from 'react-icons/fa';

export const Loader = ({ message = 'Loading...', fullScreen = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <FaSpinner className={`animate-spin text-indigo-600 ${sizeClasses[size] || sizeClasses.md}`} />
      {message && <p className="text-sm font-medium text-slate-500">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-xs">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
