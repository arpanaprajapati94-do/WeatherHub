import { motion } from 'framer-motion';
import Logo from './Logo';

/**
 * SplashScreen — premium branded boot/loading screen with animated clouds.
 * Used as the app's initial loader and route fallback.
 */
const SplashScreen = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B1026] overflow-hidden">
      {/* Ambient gradient */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob2" />

      {/* Drifting clouds */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          className="text-white/5"
          animate={{ x: ['-10vw', '110vw'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="220" height="80" viewBox="0 0 220 80" fill="currentColor">
            <path d="M40 70a30 30 0 1 1 5-59.6A38 38 0 0 1 115 0a40 40 0 0 1 40 38 28 28 0 0 1 8 55H40Z" />
          </svg>
        </motion.div>
        <motion.div
          className="text-white/5"
          animate={{ x: ['-30vw', '90vw'] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear', delay: 3 }}
        >
          <svg width="160" height="60" viewBox="0 0 220 80" fill="currentColor">
            <path d="M40 70a30 30 0 1 1 5-59.6A38 38 0 0 1 115 0a40 40 0 0 1 40 38 28 28 0 0 1 8 55H40Z" />
          </svg>
        </motion.div>
      </div>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative"
      >
        <Logo size={72} showText={false} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-2xl font-bold gradient-text"
      >
        WeatherHub
      </motion.h1>

      {/* Loading bar */}
      <div className="mt-8 w-48 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <p className="mt-4 text-xs text-gray-400">{text}</p>
    </div>
  );
};

export default SplashScreen;

