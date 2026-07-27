import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome } from 'react-icons/fi';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card max-w-lg w-full p-12 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-8xl mb-6"
      >
        🌤️
      </motion.div>
      <p className="text-sm uppercase tracking-[0.3em] text-blue-500 font-semibold mb-3">404 Error</p>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Page not found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary inline-flex items-center gap-2 px-8 py-3"
        >
          <FiHome className="w-4 h-4" />
          Back to Home
        </motion.div>
      </Link>
    </motion.div>
  </div>
);

export default NotFound;

