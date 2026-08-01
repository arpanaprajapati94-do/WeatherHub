import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

/**
 * Final call-to-action banner.
 */
const CtaBanner = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card-strong p-10 md:p-16 text-center relative overflow-hidden"
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-blue-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/15 rounded-full blur-3xl" />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-8 left-8 text-5xl opacity-20 hidden md:block"
          >
            ☁️
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute bottom-8 right-8 text-5xl opacity-20 hidden md:block"
          >
            🌤️
          </motion.div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Ready to check the weather?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto text-lg">
              Join WeatherHub today and get real-time weather data, personalised
              favourites, and a premium dashboard — all free.
            </p>
            {isAuthenticated ? (
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary text-lg px-10 py-4 shadow-xl shadow-blue-500/25"
                >
                  Go to Dashboard
                </motion.button>
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary text-lg px-10 py-4 shadow-xl shadow-blue-500/25"
                  >
                    Get Started Free
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-outline text-lg px-10 py-4"
                  >
                    Sign In
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaBanner;

