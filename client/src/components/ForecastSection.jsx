import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiCalendar, FiDroplet, FiWind } from 'react-icons/fi';
import { useTemperature, convertTemp } from '../context/TemperatureContext';

/**
 * Hourly + 7-day forecast section.
 * Shows a 24-hour temperature timeline and daily forecast cards.
 */
const ForecastSection = ({ data, loading = false, error = null }) => {
  const { unit } = useTemperature();
  const [activeTab, setActiveTab] = useState('hourly');
  const [imgError, setImgError] = useState({});

  const unitSymbol = unit === 'f' ? '°F' : '°C';

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Loading forecast
          </span>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg ${i === 0 ? 'h-24 w-full' : 'h-4 w-3/4'}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 text-center">
        <FiClock className="w-8 h-8 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600 dark:text-gray-300">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const hourly = data.hourly || [];
  const daily = data.daily || [];

  const iconUrl = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white">
            <FiClock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Forecast</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {data.city || ''} • 24-hour &amp; 7-day outlook
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
          <button
            onClick={() => setActiveTab('hourly')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'hourly'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <FiClock className="w-3.5 h-3.5" />
            Hourly
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'daily'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <FiCalendar className="w-3.5 h-3.5" />
            7-Day
          </button>
        </div>
      </div>

      {/* Hourly timeline */}
      {activeTab === 'hourly' && (
        <div>
          <div className="overflow-x-auto pb-2 -mx-2 px-2">
            <div className="flex gap-2 min-w-max">
              {hourly.slice(0, 24).map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="glass-card px-3 py-3 text-center min-w-[72px] flex flex-col items-center"
                >
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">{h.time}</p>
                  {!imgError[h.icon] ? (
                    <img
                      src={iconUrl(h.icon)}
                      alt=""
                      onError={() => setImgError((prev) => ({ ...prev, [h.icon]: true }))}
                      className="w-9 h-9 my-1"
                    />
                  ) : (
                    <span className="text-xl my-0.5">🌤️</span>
                  )}
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {convertTemp(h.temperature, unit)}°
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                    <span className="inline-flex items-center gap-0.5">
                      <FiDroplet className="w-2.5 h-2.5" /> {h.humidity}%
                    </span>
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Hourly summary */}
          {hourly.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <ForecastStat
                label="Max"
                value={`${convertTemp(Math.max(...hourly.slice(0, 24).map((h) => h.temperature)), unit)}°`}
              />
              <ForecastStat
                label="Min"
                value={`${convertTemp(Math.min(...hourly.slice(0, 24).map((h) => h.temperature)), unit)}°`}
              />
              <ForecastStat
                label="Avg Wind"
                value={`${Math.round(hourly.slice(0, 24).reduce((a, h) => a + h.windSpeed, 0) / Math.min(24, hourly.length))} m/s`}
              />
            </div>
          )}
        </div>
      )}

      {/* 7-day daily */}
      {activeTab === 'daily' && (
        <div className="space-y-2">
          {daily.slice(0, 7).map((d, i) => (
            <motion.div
              key={d.date || i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/40 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
            >
              <span className="w-12 text-xs font-bold text-gray-700 dark:text-gray-200">{d.weekday}</span>
              {!imgError[d.icon] ? (
                <img
                  src={iconUrl(d.icon)}
                  alt=""
                  onError={() => setImgError((prev) => ({ ...prev, [d.icon]: true }))}
                  className="w-8 h-8"
                />
              ) : (
                <span className="text-lg w-8 text-center">🌤️</span>
              )}
              <span className="flex-1 text-xs text-gray-500 dark:text-gray-400 capitalize truncate hidden sm:block">
                {d.description}
              </span>
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span className="text-gray-900 dark:text-gray-100">{convertTemp(d.tempMax, unit)}°</span>
                <span className="text-gray-400 dark:text-gray-500">{convertTemp(d.tempMin, unit)}°</span>
              </span>
              <span className="flex items-center gap-1 text-xs text-blue-500 w-10 justify-end">
                <FiDroplet className="w-3 h-3" />
                {d.humidity}%
              </span>
              <span className="flex items-center gap-1 text-xs text-teal-500 w-14 justify-end">
                <FiWind className="w-3 h-3" />
                {d.windSpeed}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
        Data from OpenWeatherMap • Temperatures in {unitSymbol}
      </p>
    </motion.div>
  );
};

const ForecastStat = ({ label, value }) => (
  <div className="glass-card p-3 text-center">
    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
    <p className="text-lg font-bold gradient-text">{value}</p>
  </div>
);

export default ForecastSection;

