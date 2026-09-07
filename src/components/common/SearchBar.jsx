import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiX, FiBook, FiLoader, FiArrowRight } from 'react-icons/fi';

export const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Search by title, author, or ISBN...',
  className = '',
  onClear,
  suggestions = [],
  onSelectSuggestion,
  loadingSuggestions = false,
  onSearchSubmit,
  autoFocus = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open dropdown when suggestions arrive and input has focus
  useEffect(() => {
    if (suggestions && suggestions.length > 0 && document.activeElement === inputRef.current) {
      setIsOpen(true);
    }
  }, [suggestions]);

  const handleKeyDown = (e) => {
    if (!isOpen || !suggestions.length) {
      if (e.key === 'Enter' && onSearchSubmit) {
        e.preventDefault();
        onSearchSubmit(value);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelect(suggestions[highlightedIndex]);
      } else if (onSearchSubmit) {
        setIsOpen(false);
        onSearchSubmit(value);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (item) => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (onSelectSuggestion) {
      onSelectSuggestion(item);
    } else if (onChange) {
      onChange(typeof item === 'string' ? item : item.title || '');
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
          {loadingSuggestions ? (
            <FiLoader className="text-base animate-spin text-amber-600" />
          ) : (
            <FiSearch className="text-base" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0 || (value && value.trim().length > 1)) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-stone-200/90 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-xs"
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              if (onClear) onClear();
              else onChange('');
              setIsOpen(false);
              setHighlightedIndex(-1);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <FiX className="text-base" />
          </button>
        )}
      </div>

      {/* Live Suggestions Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-stone-200/90 z-50 overflow-hidden divide-y divide-stone-100 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3.5 py-2 bg-stone-50 text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between">
            <span>Live Search Suggestions</span>
            {loadingSuggestions && <span className="text-amber-600 font-normal">Fetching...</span>}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {suggestions.map((item, idx) => {
              const isSelected = highlightedIndex === idx;
              const title = typeof item === 'string' ? item : item.title;
              const subtitle = typeof item === 'string' ? null : item.author || item.subtitle;
              const badge = typeof item === 'string' ? null : item.genre || item.badge;
              const image = typeof item === 'string' ? null : item.coverImage;

              return (
                <div
                  key={item.id || idx}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onClick={() => handleSelect(item)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-50/80 text-amber-950' : 'hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  {image ? (
                    <img
                      src={image}
                      alt={title}
                      className="w-8 h-11 object-cover rounded-md bg-stone-100 shrink-0 shadow-xs"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <FiBook className="text-sm" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate leading-snug">{title}</p>
                    {subtitle && (
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">by {subtitle}</p>
                    )}
                  </div>

                  {badge && (
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                      {badge}
                    </span>
                  )}

                  <FiArrowRight className="text-xs text-stone-400 shrink-0" />
                </div>
              );
            })}
          </div>

          {onSearchSubmit && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onSearchSubmit(value);
              }}
              className="w-full px-3.5 py-2 text-center text-xs font-bold text-amber-700 hover:bg-amber-50/60 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Search full catalog for "{value}"</span>
              <FiArrowRight className="text-xs" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
