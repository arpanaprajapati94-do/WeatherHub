import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiCloud, FiSun } from 'react-icons/fi';

/**
 * Dynamic weather background — changes based on current conditions.
 * - Clear day   → animated sun with soft rotating rays + drifting clouds
 * - Night       → moon + twinkling stars
 * - Rain/Storm  → falling rain + lightning bolt flashes
 * - Snow        → falling snow particles
 * - Clouds/Mist → drifting clouds + fog/mist particles
 * - Wind        → wind streaks
 *
 * Performance: all particle animations are GPU-accelerated (transform + opacity
 * only) and respect `prefers-reduced-motion`. Particle counts scale down on
 * small screens and low-performance devices.
 */

const STAR_COUNT = 30;
const RAIN_COUNT = 28;
const SNOW_COUNT = 26;
const FOG_COUNT = 12;
const WIND_COUNT = 10;

const useReduceMotion = () =>
  useMemo(
    () =>
      typeof window !== 'undefined' &&
      (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ||
        window.matchMedia?.('(pointer: coarse)')?.matches ||
        (navigator.hardwareConcurrency || 8) <= 4),
    []
  );

const AnimatedBackground = ({ condition = 'Clear', isDay = true }) => {
  const main = String(condition || '').toLowerCase();
  const reduceMotion = useReduceMotion();

  const isSunny = main === 'clear' && isDay;
  const isNight = !isDay;
  const isRain = ['rain', 'drizzle', 'thunderstorm'].includes(main);
  const isThunder = main === 'thunderstorm';
  const isSnow = main === 'snow';
  const isMist = ['mist', 'fog', 'haze'].includes(main);
  const isCloudy = main === 'clouds' || isMist;
  const isWindy = ['wind', 'squall', 'tornado'].includes(main);
  const showClouds = isSunny || isCloudy || isRain || isThunder;

  const showGradient = isNight || isRain || isSnow || isCloudy || isThunder;
  const gradientClass = isNight
    ? 'weather-gradient-night'
    : isThunder
    ? 'weather-gradient-rainy'
    : isRain
    ? 'weather-gradient-rainy'
    : isSnow
    ? 'weather-gradient-snowy'
    : isCloudy
    ? 'weather-gradient-cloudy'
    : isSunny
    ? 'weather-gradient-sunny'
    : '';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Gradient blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-blob2" />
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-float" />

      {/* Smooth weather gradient crossfade */}
      {showGradient && gradientClass && (
        <div
          className="absolute inset-0 opacity-25 transition-opacity duration-1000"
          style={{ background: gradientClass }}
        />
      )}

      {/* Night: moon + twinkling stars */}
      {isNight && (
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-14 right-[14%]"
            animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Moon */}
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 65% 35%, #fef9c3 0%, #fde68a 45%, #fcd34d 70%, transparent 72%)',
                  boxShadow: '0 0 40px rgba(253, 230, 138, 0.5), 0 0 80px rgba(253, 230, 138, 0.2)',
                }}
              />
              <div
                className="absolute top-3 right-3 w-6 h-6 rounded-full"
                style={{ background: 'rgba(251,191,36,0.35)' }}
              />
              <div
                className="absolute bottom-4 left-5 w-4 h-4 rounded-full"
                style={{ background: 'rgba(251,191,36,0.25)' }}
              />
            </div>
          </motion.div>

          {/* Twinkling stars */}
          {!reduceMotion &&
            [...Array(STAR_COUNT)].map((_, i) => (
              <div
                key={i}
                className="star"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 23) % 55}%`,
                  animationDelay: `${(i % 6) * 0.4}s`,
                  width: `${2 + (i % 3)}px`,
                  height: `${2 + (i % 3)}px`,
                }}
              />
            ))}
          {reduceMotion && (
            <div className="absolute inset-0">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="star"
                  style={{
                    left: `${(i * 37) % 100}%`,
                    top: `${(i * 23) % 55}%`,
                    opacity: 0.8,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Animated sun (clear day) */}
      {isSunny && (
        <motion.div
          className="absolute top-16 right-[16%]"
          animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="sun">
            <div className="sun-rays" />
            <FiSun className="w-20 h-20 text-yellow-400/70" />
          </div>
        </motion.div>
      )}

      {/* Drifting clouds */}
      {showClouds && !reduceMotion && (
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
      {showClouds && reduceMotion && (
        <>
          <div className="absolute top-24 left-6 text-white/5">
            <FiCloud className="w-40 h-40" />
          </div>
          <div className="absolute top-64 right-8 text-white/5">
            <FiCloud className="w-24 h-24" />
          </div>
        </>
      )}

      {/* Rain drops */}
      {isRain && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(reduceMotion ? 12 : RAIN_COUNT)].map((_, i) => (
            <div
              key={i}
              className="rain-drop"
              style={{
                left: `${(i * 41) % 100}%`,
                animationDelay: `${(i % 10) * 0.4}s`,
                animationDuration: `${reduceMotion ? 1.4 : 0.8 + (i % 5) * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Snow flakes */}
      {isSnow && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(reduceMotion ? 12 : SNOW_COUNT)].map((_, i) => (
            <div
              key={i}
              className="snow-flake"
              style={{
                left: `${(i * 53) % 100}%`,
                animationDelay: `${(i % 12) * 0.6}s`,
                animationDuration: `${reduceMotion ? 10 : 6 + (i % 6)}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Fog / mist particles */}
      {isMist && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(reduceMotion ? 6 : FOG_COUNT)].map((_, i) => (
            <div
              key={i}
              className="fog-particle"
              style={{
                top: `${20 + (i * 7) % 60}%`,
                width: `${120 + (i % 4) * 60}px`,
                animationDelay: `${(i % 5) * 2}s`,
                animationDuration: `${20 + (i % 4) * 6}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Wind streaks */}
      {isWindy && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(reduceMotion ? 5 : WIND_COUNT)].map((_, i) => (
            <div
              key={i}
              className="wind-streak"
              style={{
                top: `${15 + (i * 9) % 70}%`,
                animationDelay: `${(i % 6) * 1.2}s`,
                animationDuration: `${3 + (i % 4)}s`,
                opacity: 0.4 + (i % 3) * 0.15,
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

