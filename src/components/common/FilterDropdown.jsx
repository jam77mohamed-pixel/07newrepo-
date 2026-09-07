import React from 'react';
import { FiFilter } from 'react-icons/fi';

export const FilterDropdown = ({
  label,
  value,
  onChange,
  options = [],
  allLabel = 'All Categories',
  className = ''
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <FiFilter className="text-sm" />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label || 'Filter options'}
        className="pl-8.5 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-xs appearance-none cursor-pointer"
      >
        <option value="">{allLabel}</option>
        {options.map((opt) => {
          const isObj = typeof opt === 'object' && opt !== null;
          const val = isObj ? opt.value : opt;
          const lbl = isObj ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
        ▼
      </div>
    </div>
  );
};
