import { motion } from 'framer-motion';
import { FiThermometer, FiDroplet, FiWind, FiBarChart2 } from 'react-icons/fi';

const tempData = [22, 24, 27, 29, 32, 34, 33, 31, 28, 26, 24, 23];
const humidityData = [65, 60, 55, 50, 45, 40, 42, 48, 55, 62, 68, 70];
const windData = [3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2];

const chartLabels = ['12a', '2a', '4a', '6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p'];

const charts = [
  {
    icon: <FiThermometer className="w-4 h-4" />,
    title: 'Temperature (°C)',
    data: tempData,
    color: '#f97316',
    gradient: 'from-orange-500 to-yellow-400',
    unit: '°',
  },
  {
    icon: <FiDroplet className="w-4 h-4" />,
    title: 'Humidity (%)',
    data: humidityData,
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-400',
    unit: '%',
  },
  {
    icon: <FiWind className="w-4 h-4" />,
    title: 'Wind Speed (m/s)',
    data: windData,
    color: '#14b8a6',
    gradient: 'from-teal-500 to-emerald-400',
    unit: '',
  },
];

/**
 * Animated weather charts section with SVG line charts.
 */
const ChartsSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            Analytics
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Weather insights at a <span className="gradient-text">glance</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Track temperature, humidity, and wind trends with beautiful, animated charts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {charts.map((chart, ci) => {
            const max = Math.max(...chart.data);
            const points = chart.data
              .map((v, i) => `${(i / (chart.data.length - 1)) * 100},${60 - (v / max) * 48}`)
              .join(' ');
            const linePath = chart.data
              .map((v, i) => `${(i / (chart.data.length - 1)) * 100} ${60 - (v / max) * 48}`)
              .join(' ');

            return (
              <motion.div
                key={chart.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: ci * 0.15, duration: 0.7 }}
                whileHover={{ y: -6 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${chart.gradient} flex items-center justify-center text-white`}>
                    {chart.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{chart.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
                  </div>
                </div>

                {/* SVG line chart */}
                <div className="relative">
                  <svg viewBox="0 0 100 62" preserveAspectRatio="none" className="w-full h-28">
                    {/* Grid lines */}
                    {[15, 30, 45].map((y) => (
                      <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#94a3b8" strokeOpacity="0.15" strokeWidth="0.3" strokeDasharray="2 2" />
                    ))}
                    {/* Area fill */}
                    <polygon
                      points={`0,60 ${points} 100,60`}
                      fill={chart.color}
                      opacity="0.08"
                    />
                    {/* Line draw animation */}
                    <motion.polyline
                      points={linePath}
                      fill="none"
                      stroke={chart.color}
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: 0.3 + ci * 0.2 }}
                    />
                    {/* Data points */}
                    {chart.data.map((v, i) => (
                      <motion.circle
                        key={i}
                        cx={(i / (chart.data.length - 1)) * 100}
                        cy={60 - (v / max) * 48}
                        r="1.2"
                        fill={chart.color}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.15 + ci * 0.2 }}
                      />
                    ))}
                  </svg>
                  {/* Labels */}
                  <div className="flex justify-between mt-2">
                    {chartLabels.filter((_, i) => i % 3 === 0).map((l) => (
                      <span key={l} className="text-[10px] text-gray-500 dark:text-gray-400">{l}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {chart.data[chart.data.length - 1]}
                      <span className="text-sm text-gray-400">{chart.unit}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Current</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                    <FiBarChart2 className="w-3.5 h-3.5" />
                    Live
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ChartsSection;

