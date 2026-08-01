import { motion } from 'framer-motion';
import { FiMapPin, FiLayers, FiThermometer, FiDroplet, FiWind } from 'react-icons/fi';

const overlayLayers = [
  { icon: <FiDroplet className="w-4 h-4" />, label: 'Rain', color: 'bg-blue-500' },
  { icon: <FiThermometer className="w-4 h-4" />, label: 'Temperature', color: 'bg-orange-500' },
  { icon: <FiWind className="w-4 h-4" />, label: 'Wind', color: 'bg-teal-500' },
];

const pinnedCities = [
  { name: 'Mumbai', temp: '29°', x: '18%', y: '68%' },
  { name: 'London', temp: '15°', x: '40%', y: '32%' },
  { name: 'New York', temp: '22°', x: '58%', y: '40%' },
  { name: 'Dubai', temp: '35°', x: '48%', y: '62%' },
  { name: 'Tokyo', temp: '28°', x: '80%', y: '48%' },
  { name: 'Sydney', temp: '21°', x: '78%', y: '78%' },
];

/**
 * Interactive-style weather map preview with layer toggles.
 */
const WeatherMapSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
            Weather Map
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            See weather patterns <span className="gradient-text">across the globe</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Explore rain, temperature, and wind overlays on an interactive world map.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="glass-card-strong p-4 md:p-6 relative overflow-hidden"
        >
          {/* Map grid backdrop */}
          <div className="map-grid absolute inset-0 opacity-40" />

          {/* World map SVG */}
          <div className="relative w-full rounded-2xl overflow-hidden">
            <svg viewBox="0 0 800 400" className="w-full h-auto" role="img" aria-label="Stylized weather world map">
              <defs>
                <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.25" />
                </linearGradient>
                <linearGradient id="ocean" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#312e81" stopOpacity="0.35" />
                </linearGradient>
              </defs>

              {/* Ocean */}
              <rect width="800" height="400" fill="url(#ocean)" rx="16" />

              {/* Simplified continent shapes */}
              <path fill="url(#land)" d="M60 70 Q140 40 230 75 Q210 130 150 145 Q90 135 60 70Z" />
              <path fill="url(#land)" d="M240 90 Q340 60 420 100 Q380 160 310 180 Q250 150 240 90Z" />
              <path fill="url(#land)" d="M180 160 Q300 140 380 175 Q350 220 260 230 Q200 215 180 160Z" />
              <path fill="url(#land)" d="M420 130 Q540 110 640 145 Q610 210 520 230 Q450 210 420 130Z" />
              <path fill="url(#land)" d="M560 240 Q660 230 740 260 Q720 320 640 340 Q580 310 560 240Z" />
              <path fill="url(#land)" d="M250 260 Q330 250 370 280 Q330 320 270 310 Q240 285 250 260Z" />
              <path fill="url(#land)" d="M80 280 Q150 265 190 295 Q150 330 100 315 Q75 300 80 280Z" />

              {/* Grid lines */}
              {[...Array(9)].map((_, i) => (
                <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="400" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
              ))}
              {[...Array(5)].map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 100} x2="800" y2={i * 100} stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
              ))}

              {/* Rain radar zone */}
              <ellipse cx="620" cy="170" rx="60" ry="35" fill="#3b82f6" opacity="0.25">
                <animate attributeName="opacity" values="0.15;0.35;0.15" dur="3s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="620" cy="170" rx="40" ry="22" fill="#60a5fa" opacity="0.35">
                <animate attributeName="opacity" values="0.25;0.5;0.25" dur="2s" repeatCount="indefinite" />
              </ellipse>

              {/* Heat zone */}
              <ellipse cx="300" cy="130" rx="55" ry="30" fill="#f97316" opacity="0.25">
                <animate attributeName="opacity" values="0.15;0.35;0.15" dur="3.5s" repeatCount="indefinite" />
              </ellipse>
            </svg>

            {/* Pinned cities */}
            {pinnedCities.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="absolute flex flex-col items-center"
                style={{ left: c.x, top: c.y }}
              >
                <div className="relative">
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                  <FiMapPin className="w-5 h-5 text-blue-500 drop-shadow" />
                </div>
                <div className="glass-card px-2 py-0.5 rounded-lg text-[10px] font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                  {c.name} {c.temp}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Layer controls */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <FiLayers className="w-4 h-4" />
              Layers:
            </span>
            {overlayLayers.map((layer) => (
              <motion.button
                key={layer.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${layer.color}`} />
                {layer.label}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-auto px-4 py-2 rounded-xl btn-primary text-sm"
            >
              Explore Map
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WeatherMapSection;

