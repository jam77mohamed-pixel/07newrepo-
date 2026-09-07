import React, { forwardRef } from 'react';

export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  rows = 3,
  className = '',
  id,
  ...props
}, ref) => {
  const textareaId = id || props.name;

  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700 mb-1">
          {label} {props.required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-800 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 disabled:text-slate-400 ${
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-slate-200 focus:border-indigo-500'
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';
