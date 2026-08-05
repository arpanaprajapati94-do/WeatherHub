import { motion } from 'framer-motion';
import { useTemperature, convertTemp } from '../context/TemperatureContext';
import WeatherIcon from './WeatherIcon';

const WeatherCard = ({ weather, isFavourite = false, onToggleFavourite, onRefresh }) => {
  const { unit } = useTemperature();
  const unitSymbol = unit === 'f' ? '°F' : '°C';
  const t = (c) => convertTemp(c, unit);

  if (!weather) return null;

  const {
    city, country, temperature, feelsLike, tempMin, tempMax,
    humidity, pressure, description, icon, main, windSpeed, windDeg,
    clouds, visibility, sunrise, sunset, coordinates,
  } = weather;

  const formatTime = (timestamp, timezoneOffset) => {
    const date = new Date((timestamp + (timezoneOffset || 0)) * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
    });
  };

  const getWindDirection = (deg) => {
    if (typeof deg !== 'number' || Number.isNaN(deg)) return '--';
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  const getWeatherGradient = () => {
    switch (main?.toLowerCase()) {
      case 'clear': return 'from-yellow-400/20 via-orange-400/10 to-blue-400/20';
      case 'clouds': return 'from-gray-400/20 via-blue-400/10 to-gray-500/20';
      case 'rain': case 'drizzle': return 'from-blue-600/20 via-gray-500/10 to-blue-700/20';
      case 'thunderstorm': return 'from-purple-600/20 via-gray-700/10 to-blue-800/20';
      case 'snow': return 'from-blue-100/20 via-white/10 to-gray-200/20';
      case 'mist': case 'fog': case 'haze': return 'from-gray-500/20 via-white/10 to-gray-400/20';
      default: return 'from-blue-500/20 via-purple-500/10 to-pink-500/20';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`glass-card p-6 md:p-8 overflow-hidden relative bg-gradient-to-br ${getWeatherGradient()}`}
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl animate-blob2" />

      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative z-10">
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{city}</h2>
            {country && <span className="badge-blue text-xs">{country}</span>}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">{description}</p>
        </motion.div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <motion.button
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              onClick={onRefresh}
              className="btn-icon text-gray-400 hover:text-blue-500"
              title="Refresh weather data"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </motion.button>
          )}
          {onToggleFavourite && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleFavourite}
              className={`btn-icon transition-all ${
                isFavourite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
              }`}
              title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
            >
              <svg className="w-5 h-5" fill={isFavourite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>

      {/* Main Weather Display */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center gap-6 mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <WeatherIcon icon={icon} size={96} className="weather-icon-hover drop-shadow-lg" />
          <div className="text-center md:text-left">
            <div className="flex items-start">
              <span className="text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-gray-100 leading-none">
                {t(temperature)}
              </span>
              <span className="text-3xl md:text-4xl font-bold text-gray-500 dark:text-gray-400 mt-2">{unitSymbol}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Feels like {t(feelsLike)}{unitSymbol}</p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-3 w-full">
          <motion.div variants={itemVariants} className="glass-card p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Min / Max</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t(tempMin)}° / {t(tempMax)}{unitSymbol}</p>
          </motion.div>
          <motion.div variants={itemVariants} className="glass-card p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Humidity</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{humidity}%</p>
          </motion.div>
          <motion.div variants={itemVariants} className="glass-card p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Wind</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{windSpeed} m/s {getWindDirection(windDeg)}</p>
          </motion.div>
          <motion.div variants={itemVariants} className="glass-card p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pressure</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{pressure} hPa</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Additional Details */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
        <DetailItem label="Feels Like" value={`${t(feelsLike)}${unitSymbol}`} icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        } />
        <DetailItem label="Visibility" value={`${(visibility / 1000).toFixed(1)} km`} icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        } />
        <DetailItem label="Cloudiness" value={`${clouds}%`} icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
        } />
        <DetailItem label="Coordinates" value={coordinates?.lat != null && coordinates?.lon != null
          ? `${coordinates.lat.toFixed(2)}, ${coordinates.lon.toFixed(2)}` : 'N/A'} icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        } />
        <DetailItem label="Sunrise" value={sunrise ? formatTime(sunrise, weather.timezone) : 'N/A'} icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" /></svg>
        } />
        <DetailItem label="Sunset" value={sunset ? formatTime(sunset, weather.timezone) : 'N/A'} icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        } />
        <DetailItem label="Wind Degree" value={`${windDeg}°`} icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        } />
        <DetailItem label="Condition" value={main || 'N/A'} icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        } />
      </motion.div>
    </motion.div>
  );
};

const DetailItem = ({ label, value, icon }) => (
  <motion.div
    whileHover={{ y: -2, scale: 1.02 }}
    className="glass-card p-3 flex items-center gap-3 cursor-default"
  >
    <div className="text-blue-500 dark:text-blue-400 flex-shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{value}</p>
    </div>
  </motion.div>
);

export default WeatherCard;

