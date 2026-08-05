import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiClock, FiMapPin, FiTrendingUp } from 'react-icons/fi';
import allCities from '../data/cities';

const RECENT_SEARCHES_KEY = 'weatherhub-recent-searches';
const MAX_RECENT = 5;

const popularCities = [
  'Ahmedabad', 'Gandhinagar', 'Surat', 'Vadodara', 'Rajkot',
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai',
];

/**
 * Highlight matching text in search results
 */
const HighlightMatch = ({ text, query }) => {
  if (!query || !query.trim()) return <span>{text}</span>;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        // split() with a capture group places matched segments at odd indices.
        // This avoids the stateful lastIndex bug of .test() on a /g regex.
        i % 2 === 1 ? (
          <span key={i} className="text-blue-600 dark:text-blue-400 font-bold">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

const CitySearch = ({ onSearch, loading = false, placeholder = 'Search for a city (e.g., Ahmedabad, London, Tokyo)...' }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const [suppressDropdown, setSuppressDropdown] = useState(false);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setRecentSearches(parsed.slice(0, MAX_RECENT));
      }
    } catch { /* ignore */ }
  }, []);

  // Save recent search
  const saveRecentSearch = useCallback((city) => {
    const cityTrimmed = city.trim();
    if (!cityTrimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== cityTrimmed.toLowerCase());
      const updated = [cityTrimmed, ...filtered].slice(0, MAX_RECENT);
      try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  }, []);

  // Filtered cities based on query
  const filteredCities = useMemo(() => {
    if (!query || query.trim().length === 0) return [];
    const q = query.trim().toLowerCase();
    return allCities
      .filter((city) => city.toLowerCase().includes(q))
      .slice(0, 50); // Limit results for performance
  }, [query]);

  const hasQuery = query.trim().length > 0;

  // Reset active index when filtered results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [filteredCities.length]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    const resultsLength = hasQuery ? filteredCities.length : (showRecent ? recentSearches.length : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < resultsLength - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : resultsLength - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < resultsLength) {
          const selectedCity = hasQuery
            ? filteredCities[activeIndex]
            : (showRecent ? recentSearches[activeIndex] : '');
          if (selectedCity) {
            selectCity(selectedCity);
          }
        } else if (query.trim()) {
          // If no item selected but user pressed Enter, search with typed text
          handleSearch(query.trim());
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setShowRecent(false);
        setSuppressDropdown(true);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  // Select a city from dropdown
  const selectCity = (city) => {
    setQuery(city);
    setIsOpen(false);
    setShowRecent(false);
    setSuppressDropdown(true);
    setActiveIndex(-1);
    saveRecentSearch(city);
    onSearch(city);
  };

  // Handle form submission (Enter or button click)
  const handleSearch = (city) => {
    const targetCity = city || query.trim();
    if (!targetCity) return;
    saveRecentSearch(targetCity);
    setQuery(targetCity);
    setIsOpen(false);
    setShowRecent(false);
    setSuppressDropdown(true);
    onSearch(targetCity);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) handleSearch(query.trim());
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setShowRecent(false);
        setSuppressDropdown(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show recent searches when input is focused and empty
  const handleFocus = () => {
    if (!query.trim() && recentSearches.length > 0) {
      setShowRecent(true);
      setIsOpen(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSuppressDropdown(false);
    if (value.trim()) {
      setIsOpen(true);
      setShowRecent(false);
    } else {
      setIsOpen(false);
      if (recentSearches.length > 0) setShowRecent(true);
    }
    setActiveIndex(-1);
  };

  // Determine what to show in the dropdown
  // suppressDropdown blocks reopening right after select/search/escape/outside-click.
  const showDropdown = !suppressDropdown && (isOpen || showRecent || (hasQuery && filteredCities.length > 0));
  const itemsToShow = hasQuery ? filteredCities : (showRecent ? recentSearches : []);
  const dropdownLabel = hasQuery
    ? `Cities (${filteredCities.length} found)`
    : (showRecent ? 'Recent Searches' : '');

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto relative">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <FiSearch className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input pl-14 pr-36 py-4 text-base font-medium
            bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl
            border-2 border-transparent
            focus:border-blue-500 dark:focus:border-blue-400
            rounded-2xl shadow-lg shadow-blue-500/5
            transition-all duration-300"
          disabled={loading}
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-primary px-6 py-2 text-sm flex items-center gap-2 rounded-xl"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Searching
              </>
            ) : (
              <>
                <FiSearch className="w-4 h-4" />
                Search
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 glass-card-strong p-2 shadow-2xl
              max-h-[380px] overflow-y-auto"
            role="listbox"
          >
            {/* Label */}
            {dropdownLabel && (
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                {hasQuery ? (
                  <FiMapPin className="w-3.5 h-3.5" />
                ) : (
                  <FiClock className="w-3.5 h-3.5" />
                )}
                {dropdownLabel}
              </div>
            )}

            {/* Items */}
            {itemsToShow.length > 0 ? (
              itemsToShow.map((city, index) => (
                <motion.button
                  key={`${city}-${index}`}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-150 ${
                    index === activeIndex
                      ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/50'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => selectCity(city)}
                  onMouseEnter={() => setActiveIndex(index)}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <FiMapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  {hasQuery ? (
                    <HighlightMatch text={city} query={query} />
                  ) : (
                    <span className="text-sm font-medium">{city}</span>
                  )}
                  {hasQuery && index === activeIndex && (
                    <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                      ↵ select
                    </span>
                  )}
                </motion.button>
              ))
            ) : (
              <div className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <FiSearch className="w-6 h-6" />
                </div>
                <p className="font-medium">No matching cities found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            )}

            {/* Hint text */}
            <div className="px-3 py-2 mt-1 border-t border-gray-100 dark:border-gray-700/50">
              <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                {allCities.length}+ cities worldwide • Use ↑↓ to navigate, ↵ to select, ⎋ to close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular Cities */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <div className="flex items-center gap-1.5 mr-1 text-xs font-medium text-gray-500 dark:text-gray-400">
          <FiTrendingUp className="w-3.5 h-3.5" />
          Popular:
        </div>
        {popularCities.map((city) => (
          <motion.button
            key={city}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => selectCity(city)}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium rounded-full
              bg-gray-100 dark:bg-gray-800
              text-gray-600 dark:text-gray-400
              hover:bg-blue-100 dark:hover:bg-blue-500/20
              hover:text-blue-600 dark:hover:text-blue-400
              transition-all duration-200 disabled:opacity-50"
          >
            {city}
          </motion.button>
        ))}
      </div>
    </form>
  );
};

export default CitySearch;

