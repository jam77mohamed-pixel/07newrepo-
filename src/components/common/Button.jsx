import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow focus-visible:ring-indigo-500',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus-visible:ring-slate-400 border border-slate-200',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow focus-visible:ring-rose-500',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow focus-visible:ring-emerald-500',
  outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus-visible:ring-indigo-500',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400'
};

const sizes = {
  sm: 'px-2.5 py-1.5 text-xs font-medium rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm font-medium rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base font-semibold rounded-xl gap-2.5'
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <FaSpinner className="animate-spin text-current" />
      ) : Icon ? (
        <Icon className="text-base shrink-0" />
      ) : null}
      {children}
    </button>
  );
};
