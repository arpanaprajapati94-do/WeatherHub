import { motion } from 'framer-motion';
import { FiCloud, FiSun } from 'react-icons/fi';

/**
 * Dynamic weather background — changes based on current conditions.
 * - Clear day   → animated sun with rotating rays + drifting clouds
 * - Night       → twinkling stars
 * - Rain/Storm  → falling rain + lightning
 * - Snow        → falling snow particles
 * - Clouds/Mist → extra drifting clouds
 */
const AnimatedBackground = ({ condition = 'Clear', isDay = true }) => {
  const main = String(condition || '').toLowerCase();

  const isSunny = main === 'clear' && isDay;
  const isNight = !isDay;
  const isRain = ['rain', 'drizzle', 'thunderstorm'].includes(main);
  const isThunder = main === 'thunderstorm';
  const isSnow = main === 'snow';
  const isCloudy = ['clouds', 'mist', 'fog', 'haze'].includes(main);
  const showClouds = isSunny || isCloudy || isRain || isThunder;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Gradient blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-blob2" />
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-float" />

      {/* Night stars */}
      {isNight && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 23) % 55}%`,
                animationDelay: `${(i % 6) * 0.4}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Animated sun */}
      {isSunny && (
        <motion.div
          className="absolute top-16 right-[16%]"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="sun">
            <div className="sun-rays" />
            <FiSun className="w-20 h-20 text-yellow-400/70" />
          </div>
        </motion.div>
      )}

      {/* Drifting clouds */}
      {showClouds && (
        <>
          <div className="absolute top-24 left-0 text-white/5 animate-cloud-drift">
            <FiCloud className="w-40 h-40" />
          </div>
          <div className="absolute top-48 left-0 text-white/5 animate-cloud-drift-slow">
            <FiCloud className="w-28 h-28" />
          </div>
          <div className="absolute top-72 left-0 text-white/5 animate-cloud-drift">
            <FiCloud className="w-20 h-20" style={{ animationDelay: '-8s' }} />
          </div>
        </>
      )}

      {/* Rain drops */}
      {isRain && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="rain-drop"
              style={{
                left: `${(i * 41) % 100}%`,
                animationDelay: `${(i % 10) * 0.4}s`,
                animationDuration: `${0.8 + (i % 5) * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Snow flakes */}
      {isSnow && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="snow-flake"
              style={{
                left: `${(i * 53) % 100}%`,
                animationDelay: `${(i % 12) * 0.6}s`,
                animationDuration: `${6 + (i % 6)}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Lightning flash */}
      {isThunder && <div className="lightning-flash" />}
    </div>
  );
};

export default AnimatedBackground;

