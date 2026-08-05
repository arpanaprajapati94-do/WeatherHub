import { motion } from 'framer-motion';
import { useTemperature } from '../context/TemperatureContext';

/**
 * Temperature unit toggle — switches between °C and °F.
 * Preference is persisted via the TemperatureContext.
 */
const TemperatureToggle = ({ compact = false }) => {
  const { unit, toggleUnit } = useTemperature();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleUnit}
      title={`Switch to ${unit === 'c' ? 'Fahrenheit' : 'Celsius'}`}
      className={`flex items-center gap-0.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 transition-colors ${
        compact ? 'px-1.5' : 'px-2'
      }`}
      aria-label={`Temperature unit: ${unit === 'c' ? 'Celsius' : 'Fahrenheit'}. Click to toggle.`}
    >
      {['c', 'f'].map((u) => (
        <span
          key={u}
          className={`flex items-center justify-center font-bold rounded-lg transition-all ${
            unit === u
              ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow'
              : 'text-gray-400 dark:text-gray-500'
          } ${compact ? 'w-6 h-6 text-[11px]' : 'w-7 h-7 text-xs'}`}
        >
          °{u.toUpperCase()}
        </span>
      ))}
    </motion.button>
  );
};

export default TemperatureToggle;

