import { motion } from 'framer-motion';

/**
 * Premium WeatherHub Logo
 * Combines Sun + Cloud + Rain + Moon in a blue→purple gradient mark.
 * Pure SVG — lightweight, GPU-accelerated via CSS transforms.
 *
 * @param {number}  size    - Pixel size of the logo mark (default 32)
 * @param {boolean} showText- Whether to render the "WeatherHub" wordmark
 * @param {string}  className- Extra classes for the wrapper
 */
const Logo = ({ size = 32, showText = true, className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        whileHover={{ rotate: 8, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="drop-shadow-[0_4px_10px_rgba(37,99,235,0.35)]"
        aria-label="WeatherHub logo"
      >
        <defs>
          <linearGradient id="wh-sky" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563eb" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="wh-sun" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#fbbf24" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="wh-moon" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#c7d2fe" />
            <stop offset="1" stopColor="#818cf8" />
          </linearGradient>
        </defs>

        {/* Gradient backdrop */}
        <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#wh-sky)" opacity="0.12" />

        {/* Cloud body */}
        <path
          d="M32.5 27a7 7 0 0 0-13.2-3.6A6.5 6.5 0 0 0 20 36.5h12a5.5 5.5 0 0 0 .5-10.99Z"
          fill="#fff"
          fillOpacity="0.95"
        />
        {/* Cloud highlight */}
        <path
          d="M23 22.2a5.2 5.2 0 0 1 4.8 3.1 4.9 4.9 0 0 1 4.3-.3 4 4 0 0 1-.6 7.5H23a4.4 4.4 0 0 1 0-8.8v-1.5Z"
          fill="#bfdbfe"
          fillOpacity="0.9"
        />

        {/* Sun behind cloud (day) */}
        <circle cx="17" cy="19" r="7" fill="url(#wh-sun)" />
        {/* Sun rays */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI) / 4;
          const x1 = 17 + Math.cos(angle) * 10;
          const y1 = 19 + Math.sin(angle) * 10;
          const x2 = 17 + Math.cos(angle) * 12.5;
          const y2 = 19 + Math.sin(angle) * 12.5;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#wh-sun)" strokeWidth="2" strokeLinecap="round" />
          );
        })}

        {/* Moon crescent (night accent) */}
        <path
          d="M40 10a6.5 6.5 0 1 0 5 10.5A7.5 7.5 0 0 1 40 10Z"
          fill="url(#wh-moon)"
          opacity="0.95"
        />
        {/* Moon star */}
        <circle cx="36.5" cy="13.5" r="1.1" fill="#e0e7ff" />
        <circle cx="42" cy="17" r="0.8" fill="#e0e7ff" />

        {/* Rain drops under cloud */}
        <g stroke="#60a5fa" strokeWidth="2" strokeLinecap="round">
          <line x1="22" y1="37" x2="21" y2="41" />
          <line x1="28" y1="37" x2="27" y2="41" />
          <line x1="34" y1="37" x2="33" y2="41" />
        </g>
      </motion.svg>

      {showText && (
        <span className="text-xl font-bold gradient-text leading-none">WeatherHub</span>
      )}
    </span>
  );
};

export default Logo;

