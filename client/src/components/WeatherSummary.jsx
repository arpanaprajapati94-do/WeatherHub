import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiCpu } from 'react-icons/fi';
import { useTemperature, convertTemp } from '../context/TemperatureContext';

/**
 * WeatherSummary — rule-based "AI-style" natural-language summary.
 * Generates a contextual sentence from live weather data without any API cost.
 * Great portfolio talking point: pure client-side intelligence.
 *
 * @param {object} weather - current weather object from the API
 */
const WeatherSummary = ({ weather }) => {
  const { unit } = useTemperature();
  const unitSymbol = unit === 'f' ? '°F' : '°C';

  const summary = useMemo(() => {
    if (!weather) return null;

    const tempC = weather.temperature;
    const temp = convertTemp(tempC, unit);
    const main = String(weather.main || '').toLowerCase();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const feels =
      tempC >= 33 ? 'quite hot' :
      tempC >= 27 ? 'warm' :
      tempC >= 20 ? 'pleasant' :
      tempC >= 12 ? 'mild' :
      tempC >= 5 ? 'cool' :
      tempC >= 0 ? 'cold' : 'freezing';

    let advice = '';
    if (['rain', 'drizzle', 'thunderstorm'].includes(main)) {
      advice = 'Carry an umbrella and drive carefully.';
    } else if (main === 'snow') {
      advice = 'Dress in layers and watch for slippery roads.';
    } else if (['mist', 'fog', 'haze'].includes(main)) {
      advice = 'Visibility is reduced — take it slow on the roads.';
    } else if (tempC >= 33) {
      advice = 'Stay hydrated and avoid the sun during peak hours.';
    } else if (tempC <= 10) {
      advice = 'Grab a jacket before you head out.';
    } else if (main === 'clouds') {
      advice = 'Light layers will keep you comfortable.';
    } else {
      advice = 'It is a great day to get outside!';
    }

    return `${greeting}! ${weather.city} is ${feels} at ${temp}${unitSymbol} with ${weather.description}. ${advice}`;
  }, [weather, unit, unitSymbol]);

  if (!summary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex items-start gap-3 p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-blue-200/40 dark:border-blue-500/20 backdrop-blur-sm"
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
        <FiCpu className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
          AI Weather Summary
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</p>
      </div>
    </motion.div>
  );
};

export default WeatherSummary;

