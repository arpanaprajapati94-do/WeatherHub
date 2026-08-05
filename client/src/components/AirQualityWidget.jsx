import { motion } from 'framer-motion';
import { FiActivity, FiWind, FiCloud, FiSun, FiAlertTriangle } from 'react-icons/fi';

/**
 * Air Quality Index widget.
 * Shows AQI level, health recommendation, and pollutant breakdown.
 */
const AirQualityWidget = ({ data, loading = false, error = null }) => {
  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Loading air quality
          </span>
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg ${i === 0 ? 'h-12 w-32' : 'h-4 w-full'}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 text-center">
        <FiAlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
        <p className="text-sm text-gray-600 dark:text-gray-300">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const aqiColorMap = {
    green: {
      text: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-500',
      badge: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300',
    },
    yellow: {
      text: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-500',
      badge: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
    },
    orange: {
      text: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-500',
      badge: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300',
    },
    red: {
      text: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-500',
      badge: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
    },
    purple: {
      text: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500',
      badge: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300',
    },
  };

  const color = aqiColorMap[data.color] || aqiColorMap.green;

  const pollutants = [
    { label: 'PM2.5', value: data.components?.pm25, unit: 'µg/m³', icon: <FiCloud className="w-4 h-4" /> },
    { label: 'PM10', value: data.components?.pm10, unit: 'µg/m³', icon: <FiCloud className="w-4 h-4" /> },
    { label: 'O₃', value: data.components?.o3, unit: 'µg/m³', icon: <FiSun className="w-4 h-4" /> },
    { label: 'NO₂', value: data.components?.no2, unit: 'µg/m³', icon: <FiWind className="w-4 h-4" /> },
  ];

  const maxPollutant = pollutants.reduce((a, b) => (a.value > b.value ? a : b), pollutants[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white">
            <FiActivity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Air Quality</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Real-time AQI</p>
          </div>
        </div>
        {data.city && (
          <span className="badge-blue text-xs">{data.city}</span>
        )}
      </div>

      {/* AQI value + level */}
      <div className="flex items-center gap-4 mb-5">
        <div className={`w-16 h-16 rounded-2xl ${color.bg} flex items-center justify-center shadow-lg`}>
          <span className="text-2xl font-extrabold text-white">{data.aqi}</span>
        </div>
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${color.badge}`}>
            {data.level}
          </span>
          <p className={`text-xs mt-1.5 font-medium ${color.text}`}>
            {data.aqi <= 2 ? 'Safe for outdoor activities' : 'Take precautions outdoors'}
          </p>
        </div>
      </div>

      {/* Recommendation */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
        {data.recommendation}
      </p>

      {/* Pollutant breakdown */}
      <div className="grid grid-cols-2 gap-3">
        {pollutants.map((p) => (
          <div
            key={p.label}
            className={`glass-card p-3 flex items-center gap-2.5 ${p.label === maxPollutant.label ? 'ring-1 ring-blue-500/40' : ''}`}
          >
            <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
              {p.icon}
            </span>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{p.label}</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {p.value ?? '--'} <span className="text-[10px] text-gray-400 font-normal">{p.unit}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {maxPollutant.label && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Highest pollutant: <span className="font-semibold text-gray-700 dark:text-gray-200">{maxPollutant.label}</span>
        </p>
      )}
    </motion.div>
  );
};

export default AirQualityWidget;

