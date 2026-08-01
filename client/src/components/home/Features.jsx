import { motion } from 'framer-motion';
import { FiSun, FiCalendar, FiActivity, FiMap, FiAlertTriangle, FiBarChart2 } from 'react-icons/fi';

const features = [
  {
    icon: <FiSun className="w-6 h-6" />,
    title: 'Live Weather',
    description: 'Real-time conditions with feels-like temperature, wind, humidity, and visibility for any city worldwide.',
    accent: 'from-yellow-400 to-orange-500',
  },
  {
    icon: <FiActivity className="w-6 h-6" />,
    title: 'Air Quality',
    description: 'Track AQI levels with clear health recommendations so you always know when it is safe to go outside.',
    accent: 'from-green-400 to-emerald-500',
  },
  {
    icon: <FiCalendar className="w-6 h-6" />,
    title: 'Smart Forecast',
    description: 'Hourly, daily, and 7-day forecasts powered by OpenWeather API to plan ahead with confidence.',
    accent: 'from-blue-400 to-indigo-500',
  },
  {
    icon: <FiMap className="w-6 h-6" />,
    title: 'Weather Map',
    description: 'Visualize rain, temperature, and wind patterns across the globe with interactive map overlays.',
    accent: 'from-purple-400 to-violet-500',
  },
  {
    icon: <FiAlertTriangle className="w-6 h-6" />,
    title: 'Smart Alerts',
    description: 'Stay ahead of heavy rain, thunderstorms, and heatwaves with proactive weather notifications.',
    accent: 'from-red-400 to-rose-500',
  },
  {
    icon: <FiBarChart2 className="w-6 h-6" />,
    title: 'Analytics',
    description: 'Detailed weather charts for temperature trends, humidity, and wind speed over time.',
    accent: 'from-cyan-400 to-sky-500',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

/**
 * Features section — 6 premium glassmorphism cards.
 */
const Features = () => (
  <section className="py-16 md:py-24 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
          Features
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Everything you need,{' '}
          <span className="gradient-text">beautifully presented</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          From live conditions to deep analytics, WeatherHub gives you a complete
          picture of the weather in a premium, modern dashboard.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-card p-8 group cursor-default relative overflow-hidden"
          >
            <div className={`absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br ${feature.accent} opacity-[0.07] rounded-full blur-2xl group-hover:opacity-[0.15] transition-opacity duration-500`} />
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className={`w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br ${feature.accent} flex items-center justify-center text-white shadow-lg`}
            >
              {feature.icon}
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Features;

