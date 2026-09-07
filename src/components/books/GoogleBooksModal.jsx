import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '../common/Modal';
import { SearchBar } from '../common/SearchBar';
import { Button } from '../common/Button';
import { Loader } from '../common/Loader';
import {
  searchGoogleBooks,
  fetchBookSuggestions,
  POPULAR_SEARCH_SUGGESTIONS
} from '../../services/googleBooksService';
import { FiSearch, FiCheck, FiBook, FiTrendingUp, FiHash, FiCalendar, FiLayers } from 'react-icons/fi';
import { toast } from 'react-toastify';

export const GoogleBooksModal = ({ isOpen, onClose, onSelectBook }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Reset on open/close
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSuggestions([]);
      setHasSearched(false);
    }
  }, [isOpen]);

  // Debounced Live Suggestions Fetcher
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoadingSuggestions(true);
        const liveSuggestions = await fetchBookSuggestions(query, 5);
        setSuggestions(liveSuggestions);
      } catch (err) {
        console.warn('Suggestion fetch error:', err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const executeSearch = useCallback(async (searchTerm) => {
    const term = (searchTerm || query).trim();
    if (!term) {
      toast.warning('Please enter a book title, author, or ISBN to search');
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      setSuggestions([]); // hide dropdown once searched
      const items = await searchGoogleBooks(term, 12);
      setResults(items);
      if (items.length === 0) {
        toast.info(`No results found on Google Books for "${term}".`);
      } else {
        toast.success(`Found ${items.length} books from Google Books!`);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to search Google Books API');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    executeSearch();
  };

  const handleSelectSuggestion = (item) => {
    const term = typeof item === 'string' ? item : item.title;
    setQuery(term);
    executeSearch(term);
  };

  const handleQuickTagClick = (tag) => {
    setQuery(tag);
    executeSearch(tag);
  };

  const handleSelectBook = (book) => {
    onSelectBook(book);
    onClose();
    toast.success(`Loaded catalog details for "${book.title}"!`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Search Google Books API"
      subtitle="Discover titles, authors, and auto-fill complete book metadata directly into your library catalog"
      size="xl"
    >
      <div className="space-y-4">
        {/* Search Input Bar with Live Suggestions */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search by title (e.g. Clean Code), author, or ISBN..."
            className="flex-1"
            suggestions={suggestions}
            loadingSuggestions={loadingSuggestions}
            onSelectSuggestion={handleSelectSuggestion}
            onSearchSubmit={executeSearch}
            autoFocus
          />
          <Button
            type="submit"
            variant="primary"
            icon={FiSearch}
            loading={loading}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 rounded-2xl shrink-0"
          >
            Search API
          </Button>
        </form>

        {/* Quick Suggestion Tags */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1 mr-1">
            <FiTrendingUp className="text-amber-600" /> Suggestions:
          </span>
          {POPULAR_SEARCH_SUGGESTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleQuickTagClick(tag)}
              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200/60 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Container */}
        {loading ? (
          <div className="py-16">
            <Loader message="Fetching real-time data from Google Books API..." />
          </div>
        ) : results.length > 0 ? (
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200 text-xs font-bold text-stone-600">
              <span>Results found: {results.length} books</span>
              <span className="text-stone-400 font-normal">Click "Use Details" to auto-fill</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[52vh] overflow-y-auto pr-1">
              {results.map((book) => (
                <div
                  key={book.id}
                  className="flex gap-3.5 p-3.5 rounded-2xl border border-stone-200/90 bg-white hover:border-amber-400 hover:shadow-md transition-all group"
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-16 h-24 object-cover rounded-xl bg-stone-100 shrink-0 shadow-xs border border-stone-200"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                  <div className="flex flex-1 flex-col justify-between overflow-hidden">
                    <div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 inline-block mb-1">
                        {book.genre}
                      </span>
                      <h4 className="text-sm font-extrabold text-stone-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-xs text-stone-500 line-clamp-1">
                        by {book.author}
                      </p>
                      
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-stone-400 font-mono">
                        <span className="flex items-center gap-0.5">
                          <FiHash className="text-[10px]" /> ISBN: {book.isbn}
                        </span>
                        {book.publishedDate && (
                          <span className="flex items-center gap-0.5">
                            <FiCalendar className="text-[10px]" /> {book.publishedDate}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2.5 flex justify-end">
                      <Button
                        size="sm"
                        variant="primary"
                        icon={FiCheck}
                        onClick={() => handleSelectBook(book)}
                        className="text-xs py-1 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs"
                      >
                        Use Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : hasSearched ? (
          <div className="py-12 text-center text-stone-500 bg-stone-50/50 rounded-2xl border border-stone-200">
            <FiBook className="mx-auto text-3xl text-stone-300 mb-2" />
            <p className="font-bold text-stone-700">No books found for "{query}"</p>
            <p className="text-xs text-stone-400 mt-1">Try another keyword, title name, or search by ISBN code.</p>
          </div>
        ) : (
          <div className="py-12 text-center text-stone-400 border border-dashed border-stone-200 rounded-2xl bg-stone-50/30">
            <FiSearch className="mx-auto text-3xl text-amber-500/60 mb-2" />
            <p className="text-sm font-bold text-stone-700">Type a keyword above or click a suggestion tag</p>
            <p className="text-xs text-stone-400 mt-1">Search millions of titles via Google Books API with live autocomplete</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
