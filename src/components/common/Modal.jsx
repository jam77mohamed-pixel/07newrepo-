import React, { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl'
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  showClose = true,
  className = ''
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog container */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div
          className={`relative w-full ${sizeClasses[size] || sizeClasses.md} transform overflow-hidden rounded-3xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 ${className}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          {(title || showClose) && (
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-5 bg-slate-50/50 dark:bg-slate-800/40">
              <div>
                {title && (
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{subtitle}</p>
                )}
              </div>
              {showClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <IoClose className="text-xl" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};
