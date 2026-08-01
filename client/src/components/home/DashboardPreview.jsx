import { motion } from 'framer-motion';
import { FiMapPin, FiDroplet, FiWind, FiActivity, FiStar, FiTrendingUp } from 'react-icons/fi';

/**
 * Browser-style dashboard preview mockup.
 */
const DashboardPreview = () => {
  const bars = [45, 60, 38, 72, 55, 85, 62, 90, 50, 68, 78, 58];
  const week = [
    { day: 'Mon', icon: '☀️', temp: 32 },
    { day: 'Tue', icon: '⛅', temp: 30 },
    { day: 'Wed', icon: '🌧', temp: 27 },
    { day: 'Thu', icon: '⛈', temp: 25 },
    { day: 'Fri', icon: '🌤', temp: 29 },
    { day: 'Sat', icon: '☀️', temp: 31 },
    { day: 'Sun', icon: '☀️', temp: 33 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      {/* Glow behind mockup */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 via-purple-500/10 to-blue-500/20 blur-3xl rounded-[40px]" />

      {/* Browser chrome */}
      <div className="glass-card-strong overflow-hidden rounded-2xl shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white/40 dark:bg-gray-900/40">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-4 px-4 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 text-center">
            weatherhub.app/dashboard
          </div>
        </div>

        {/* Dashboard body */}
        <div className="p-5 md:p-7 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Current weather card */}
          <div className="md:col-span-2 glass-card p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl" />
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <FiMapPin className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-gray-900 dark:text-gray-100">Ahmedabad</span>
                <span className="badge-blue">IN</span>
              </div>
              <button className="text-yellow-500">
                <FiStar className="w-5 h-5 fill-current" />
              </button>
            </div>
            <div className="flex items-center gap-5 mb-5 relative z-10">
              <span className="text-6xl font-extrabold text-gray-900 dark:text-gray-100">31°</span>
              <div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">☀️ Sunny</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Feels like 34°</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 relative z-10">
              <PreviewMetric icon={<FiDroplet className="w-4 h-4" />} label="Humidity" value="56%" />
              <PreviewMetric icon={<FiWind className="w-4 h-4" />} label="Wind" value="14 km/h" />
              <PreviewMetric icon={<FiActivity className="w-4 h-4" />} label="AQI" value="45 · Good" />
            </div>

            {/* Mini chart */}
            <div className="mt-5 relative z-10">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Hourly Temperature
              </p>
              <div className="flex items-end gap-1.5 h-24">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.6, ease: 'easeOut' }}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-purple-500 opacity-80 hover:opacity-100 transition-opacity"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Weekly forecast */}
          <div className="glass-card p-5">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              7-Day Forecast
            </p>
            <div className="space-y-2.5">
              {week.map((d, i) => (
                <motion.div
                  key={d.day}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                >
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-10">{d.day}</span>
                  <span className="text-base">{d.icon}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100 w-10 text-right">{d.temp}°</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom stats strip */}
        <div className="px-5 md:px-7 pb-5 md:pb-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Live Updates', value: 'Every 1 min', icon: <FiTrendingUp className="w-4 h-4" /> },
              { label: 'Cities', value: '700+', icon: <FiMapPin className="w-4 h-4" /> },
              { label: 'Uptime', value: '99.9%', icon: <FiActivity className="w-4 h-4" /> },
              { label: 'Rating', value: '4.9 ★', icon: <FiStar className="w-4 h-4" /> },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass-card p-3 flex items-center gap-3"
              >
                <span className="text-blue-500 dark:text-blue-400 flex-shrink-0">{s.icon}</span>
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">{s.label}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating decorative chips */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -top-5 -left-3 md:-left-6 glass-card px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-xl"
      >
        🌤️ Real-time Data
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute -bottom-4 -right-2 md:-right-5 glass-card px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-xl"
      >
        📈 Live Charts
      </motion.div>
    </motion.div>
  );
};

const PreviewMetric = ({ icon, label, value }) => (
  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
    <div className="flex items-center justify-center gap-1 mb-1 text-blue-500 dark:text-blue-400">{icon}</div>
    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">{label}</p>
    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{value}</p>
  </div>
);

export default DashboardPreview;

