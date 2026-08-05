import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { weatherAPI } from '../services/api';
import { useTemperature, convertTemp } from '../context/TemperatureContext';
import WeatherIcon from './WeatherIcon';

/**
 * PopularCitiesCarousel — horizontal scrollable strip of popular cities with
 * live weather fetched from the public API (no auth required). Clicking a city
 * triggers onSelect(city) so the parent can load full details.
 *
 * @param {function} onSelect - (cityName) => void
 * @param {number}    count   - number of cities to show (default 8)
 */
const DEFAULT_CITIES = [
  'Ahmedabad', 'Mumbai', 'Delhi', 'Bengaluru',
  'London', 'New York', 'Tokyo', 'Dubai',
  'Paris', 'Sydney',
];

const PopularCitiesCarousel = ({ onSelect, count = 8 }) => {
  const { unit } = useTemperature();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const citiesRef = useRef(DEFAULT_CITIES);

  const citiesList = citiesRef.current.slice(0, count);

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      setLoading(true);
      const results = await Promise.allSettled(
        citiesList.map((city) => weatherAPI.getWeather(city))
      );
      if (!mounted) return;
      const data = results.map((r, i) =>
        r.status === 'fulfilled'
          ? { name: citiesList[i], ...r.value.data.data }
          : { name: citiesList[i], temperature: null, main: 'Unknown', icon: '01d', description: 'Unavailable' }
      );
      setCities(data);
      setLoading(false);
    };
    fetchAll();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollBy = useCallback((dir) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="shimmer w-40 h-28 rounded-2xl bg-gray-200/50 dark:bg-gray-700/30 flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Scroll buttons */}
      <button
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
        className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full glass-card-strong flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-lg"
      >
        <FiChevronLeft className="w-4 h-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 -mx-2 px-2 scroll-smooth snap-x snap-mandatory"
      >
        {cities.map((city, i) => (
          <motion.button
            key={city.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect?.(city.name)}
            className="glass-card flex-shrink-0 w-40 p-4 text-left snap-start cursor-pointer"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <FiMapPin className="w-3.5 h-3.5 text-blue-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{city.name}</p>
            </div>
            <div className="flex items-center gap-2">
              {city.temperature != null ? (
                <>
                  <WeatherIcon icon={city.icon} size={36} />
                  <div>
                    <p className="text-xl font-extrabold text-gray-900 dark:text-gray-100 leading-none">
                      {convertTemp(city.temperature, unit)}°{unit === 'f' ? 'F' : 'C'}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 capitalize truncate">
                      {city.description}
                    </p>
                  </div>
                </>
              ) : (
                <span className="text-sm text-gray-400">Unavailable</span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <button
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full glass-card-strong flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-lg"
      >
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PopularCitiesCarousel;

