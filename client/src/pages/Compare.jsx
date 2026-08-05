import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiX, FiDroplet, FiWind, FiActivity, FiPlus, FiThermometer } from 'react-icons/fi';
import CitySearch from '../components/CitySearch';
import { weatherAPI } from '../services/api';
import { useTemperature, convertTemp } from '../context/TemperatureContext';
import { useToast } from '../context/ToastContext';

const MAX_CITIES = 4;

/**
 * Multi-city weather comparison page.
 * Add up to 4 cities and compare temperature, humidity, wind, pressure & conditions side-by-side.
 */
const Compare = () => {
  const { unit } = useTemperature();
  const { error: toastError } = useToast();
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState([]);
  const [errorCities, setErrorCities] = useState({});

  const unitSymbol = unit === 'f' ? '°F' : '°C';

  const addCity = useCallback(async (cityName) => {
    if (cities.length >= MAX_CITIES) {
      toastError?.(`You can compare up to ${MAX_CITIES} cities at once.`);
      return;
    }
    if (cities.some((c) => c.city.toLowerCase() === cityName.toLowerCase())) {
      toastError?.(`${cityName} is already in the comparison.`);
      return;
    }

    setLoadingCities((prev) => [...prev, cityName.toLowerCase()]);
    setErrorCities((prev) => ({ ...prev, [cityName.toLowerCase()]: null }));

    try {
      const res = await weatherAPI.getWeather(cityName);
      const data = res.data.data;
      setCities((prev) => [
        ...prev,
        { city: data.city, country: data.country, ...data },
      ]);
    } catch (err) {
      const msg = err.displayMessage || 'Failed to fetch city weather.';
      setErrorCities((prev) => ({ ...prev, [cityName.toLowerCase()]: msg }));
    } finally {
      setLoadingCities((prev) => prev.filter((c) => c !== cityName.toLowerCase()));
    }
  }, [cities, toastError]);

  const removeCity = useCallback((index) => {
    setCities((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const loadDefault = useCallback(() => {
    if (cities.length === 0) {
      addCity('Ahmedabad');
      addCity('Mumbai');
      addCity('London');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadDefault();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tempCompare = (city) => {
    const t = convertTemp(city.temperature, unit);
    const temps = cities.map((c) => convertTemp(c.temperature, unit));
    if (temps.length < 2) return null;
    const max = Math.max(...temps);
    const min = Math.min(...temps);
    if (t === max) return { label: 'Hottest', cls: 'text-red-500' };
    if (t === min) return { label: 'Coolest', cls: 'text-blue-500' };
    return null;
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-blob2" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4"
          >
            <FiThermometer className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Compare <span className="gradient-text">Cities</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Add up to {MAX_CITIES} cities and compare live weather side-by-side.
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-10">
          <CitySearch onSearch={addCity} loading={loadingCities.length > 0} />
        </div>

        {/* Error messages */}
        {Object.keys(errorCities).filter((k) => errorCities[k]).length > 0 && (
          <div className="mb-6 space-y-2">
            {Object.entries(errorCities).map(([key, msg]) => (
              msg && (
                <div key={key} className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center gap-3">
                  <FiX className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300 flex-1 capitalize">{key}: {msg}</p>
                  <button onClick={() => setErrorCities((prev) => ({ ...prev, [key]: null }))} className="text-red-500 hover:text-red-700">
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )
            ))}
          </div>
        )}

        {/* Comparison table */}
        {cities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-strong p-4 md:p-6 overflow-x-auto"
          >
            <div className="grid gap-3" style={{ gridTemplateColumns: `160px repeat(${cities.length}, minmax(150px, 1fr))` }}>
              {/* Header row */}
              <div className="flex items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-2">
                Metric
              </div>
              {cities.map((city, i) => (
                <motion.div
                  key={`${city.city}-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative text-center glass-card p-4"
                >
                  <button
                    onClick={() => removeCity(i)}
                    className="absolute top-2 right-2 btn-icon text-gray-400 hover:text-red-500 w-6 h-6"
                    aria-label={`Remove ${city.city}`}
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <FiMapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{city.city}</span>
                  </div>
                  {city.country && (
                    <span className="badge-blue text-[10px]">{city.country}</span>
                  )}
                  {tempCompare(city) && (
                    <span className={`block text-[10px] font-bold mt-1 ${tempCompare(city).cls}`}>
                      {tempCompare(city).label}
                    </span>
                  )}
                </motion.div>
              ))}

              {/* Temperature */}
              <CompareRow label="Temperature">
                {cities.map((city, i) => (
                  <CompareCell key={i}>
                    <span className="text-2xl font-extrabold gradient-text">
                      {convertTemp(city.temperature, unit)}°{unit === 'f' ? 'F' : 'C'}
                    </span>
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Feels like */}
              <CompareRow label="Feels Like">
                {cities.map((city, i) => (
                  <CompareCell key={i}>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {convertTemp(city.feelsLike, unit)}°{unit === 'f' ? 'F' : 'C'}
                    </span>
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Condition */}
              <CompareRow label="Condition">
                {cities.map((city, i) => (
                  <CompareCell key={i}>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">
                      {city.description}
                    </span>
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Min/Max */}
              <CompareRow label="Min / Max">
                {cities.map((city, i) => (
                  <CompareCell key={i}>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {convertTemp(city.tempMin, unit)}° / {convertTemp(city.tempMax, unit)}°
                    </span>
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Humidity */}
              <CompareRow label="Humidity">
                {cities.map((city, i) => (
                  <CompareCell key={i}>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                      <FiDroplet className="w-4 h-4 text-blue-500" /> {city.humidity}%
                    </span>
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Wind */}
              <CompareRow label="Wind">
                {cities.map((city, i) => (
                  <CompareCell key={i}>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                      <FiWind className="w-4 h-4 text-teal-500" /> {city.windSpeed} m/s
                    </span>
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Pressure */}
              <CompareRow label="Pressure">
                {cities.map((city, i) => (
                  <CompareCell key={i}>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {city.pressure} hPa
                    </span>
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Visibility */}
              <CompareRow label="Visibility">
                {cities.map((city, i) => (
                  <CompareCell key={i}>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                      <FiActivity className="w-4 h-4 text-purple-500" />
                      {(city.visibility / 1000).toFixed(1)} km
                    </span>
                  </CompareCell>
                ))}
              </CompareRow>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {cities.length === 0 && loadingCities.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <FiPlus className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Add Cities to Compare
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Search for cities above to see their weather side-by-side.
            </p>
          </div>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-6 text-center">
          Data from OpenWeatherMap • Temperatures in {unitSymbol} • Auto-loads 3 sample cities on first visit
        </p>
      </div>
    </div>
  );
};

const CompareRow = ({ label, children }) => (
  <>
    <div className="flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
      {label}
    </div>
    {children}
  </>
);

const CompareCell = ({ children }) => (
  <div className="glass-card p-3 flex items-center justify-center">
    {children}
  </div>
);

export default Compare;

