import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';

const suggestedCities = ['London', 'New York', 'Tokyo', 'Paris', 'Dubai', 'Mumbai'];

const CitySearch = ({ onSearch, loading = false }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) onSearch(city.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <FiSearch className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search for a city (e.g., London, Tokyo, Paris)..."
          className="input pl-14 pr-36 py-4 text-base font-medium
            bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl
            border-2 border-transparent
            focus:border-blue-500 dark:focus:border-blue-400
            rounded-2xl shadow-lg shadow-blue-500/5
            transition-all duration-300"
          disabled={loading}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !city.trim()}
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
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {suggestedCities.map((suggestedCity) => (
          <motion.button
            key={suggestedCity}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => { setCity(suggestedCity); onSearch(suggestedCity); }}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium rounded-full
              bg-gray-100 dark:bg-gray-800
              text-gray-600 dark:text-gray-400
              hover:bg-blue-100 dark:hover:bg-blue-500/20
              hover:text-blue-600 dark:hover:text-blue-400
              transition-all duration-200 disabled:opacity-50"
          >
            {suggestedCity}
          </motion.button>
        ))}
      </div>
    </form>
  );
};

export default CitySearch;

