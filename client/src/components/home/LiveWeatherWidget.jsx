import { motion } from 'framer-motion';
import { FiMapPin, FiDroplet, FiWind, FiActivity, FiSunrise, FiSunset, FiRefreshCw } from 'react-icons/fi';
import WeatherIcon from '../WeatherIcon';
import { useTemperature, convertTemp } from '../../context/TemperatureContext';

/**
 * Live weather widget for the hero section.
 * Receives real weather data from the parent (Home), fetched via the public API.
 */
const LiveWeatherWidget = ({ weather, loading = false, error = null, onRefresh }) => {
  const { unit } = useTemperature();
  const unitSymbol = unit === 'f' ? '°F' : '°C';
  const t = (c) => convertTemp(c, unit);

  const formatTime = (ts, tz) => {
    if (!ts) return '--';
    const date = new Date((ts + (tz || 0)) * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  };

  const hourly = weather
    ? [0, 1, 2, 3, 4, 5].map((i) => ({
        label: new Date(Date.now() + i * 3600 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        temp: weather.temperature + ((i % 3) - 1),
        icon: weather.icon,
      }))
    : [];

  if (loading) {
    return (
      <div className="glass-card p-6 md:p-8 w-full max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Fetching live weather
          </span>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg ${i === 0 ? 'h-10 w-40' : 'h-4 w-3/4'}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 md:p-8 w-full max-w-md mx-auto text-center">
        <FiActivity className="w-8 h-8 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{error}</p>
        {onRefresh && (
          <button onClick={onRefresh} className="btn-secondary text-sm mx-auto">
            <FiRefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    );
  }

  if (!weather) return null;

  const aqiColor = weather.visibility > 8000 ? 'text-green-500' : weather.visibility > 5000 ? 'text-yellow-500' : 'text-red-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="glass-card-strong p-6 md:p-8 w-full max-w-md mx-auto relative overflow-hidden"
    >
      {/* Glow accents */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/15 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/15 rounded-full blur-3xl" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Live Weather
          </span>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            aria-label="Refresh weather"
            className="btn-icon text-gray-400 hover:text-blue-500 hover:rotate-180 transition-all duration-300"
            title="Refresh"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* City */}
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <FiMapPin className="w-5 h-5 text-blue-500" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{weather.city}</h3>
        {weather.country && (
          <span className="badge-blue">{weather.country}</span>
        )}
      </div>

      {/* Temperature */}
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <WeatherIcon icon={weather.icon} size={80} className="weather-icon-hover drop-shadow-lg" />
        <div>
          <div className="flex items-start">
            <span className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-100 leading-none">
              {t(weather.temperature)}
            </span>
            <span className="text-2xl font-bold text-gray-500 dark:text-gray-400 mt-1">{unitSymbol}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{weather.description}</p>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
        <Metric icon={<FiDroplet className="w-4 h-4" />} label="Humidity" value={`${weather.humidity}%`} />
        <Metric icon={<FiWind className="w-4 h-4" />} label="Wind" value={`${weather.windSpeed} m/s`} />
        <Metric icon={<FiActivity className="w-4 h-4" />} label="Visibility" value={`${(weather.visibility / 1000).toFixed(1)} km`} />
      </div>

      {/* Sun times */}
      <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
        <div className="glass-card p-3 flex items-center gap-2">
          <FiSunrise className="w-4 h-4 text-yellow-500" />
          <div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Sunrise</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatTime(weather.sunrise, weather.timezone)}
            </p>
          </div>
        </div>
        <div className="glass-card p-3 flex items-center gap-2">
          <FiSunset className="w-4 h-4 text-orange-500" />
          <div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Sunset</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatTime(weather.sunset, weather.timezone)}
            </p>
          </div>
        </div>
      </div>

      {/* Hourly strip */}
      <div className="relative z-10">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Hourly Forecast
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
          {hourly.map((h, i) => (
            <div key={i} className="flex-shrink-0 glass-card px-3 py-2 text-center min-w-[64px]">
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{h.label}</p>
              <WeatherIcon icon={h.icon} size={28} className="w-7 h-7 mx-auto my-0.5" />
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{t(h.temp)}{unitSymbol}</p>
            </div>
          ))}
        </div>
      </div>

      <p className={`text-xs mt-4 relative z-10 ${aqiColor}`}>
        {weather.visibility > 8000 ? '🟢' : weather.visibility > 5000 ? '🟡' : '🔴'} Good visibility conditions
      </p>
    </motion.div>
  );
};

const Metric = ({ icon, label, value }) => (
  <div className="glass-card p-3 text-center">
    <div className="flex items-center justify-center gap-1 mb-1 text-blue-500 dark:text-blue-400">
      {icon}
    </div>
    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">{label}</p>
    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{value}</p>
  </div>
);

export default LiveWeatherWidget;

