import { motion } from 'framer-motion';
import { FiZap, FiGlobe, FiShield, FiSmartphone, FiDatabase } from 'react-icons/fi';

const badges = [
  { icon: <FiDatabase className="w-4 h-4" />, label: 'OpenWeather API Powered' },
  { icon: <FiZap className="w-4 h-4" />, label: 'Fast API Response' },
  { icon: <FiSmartphone className="w-4 h-4" />, label: 'Mobile Responsive' },
  { icon: <FiShield className="w-4 h-4" />, label: 'Secure Login' },
  { icon: <FiGlobe className="w-4 h-4" />, label: 'Global Weather Data' },
];

/**
 * Trusted-by strip with honest capability badges.
 */
const TrustedBy = () => (
  <section className="py-10 border-y border-gray-200/50 dark:border-gray-800/50 bg-white/30 dark:bg-gray-900/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
        Built with a modern tech stack
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {badges.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full glass-card text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            <span className="text-blue-500 dark:text-blue-400">{b.icon}</span>
            {b.label}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustedBy;

