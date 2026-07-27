import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiSun, FiCloud, FiSearch, FiHeart, FiClock, FiBarChart2 } from 'react-icons/fi';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: <FiSun className="w-6 h-6" />, title: 'Real-Time Weather', description: 'Get accurate, real-time weather data for any city worldwide with detailed metrics.' },
    { icon: <FiHeart className="w-6 h-6" />, title: 'Favourite Cities', description: 'Save your favourite cities for quick access and track weather conditions at a glance.' },
    { icon: <FiClock className="w-6 h-6" />, title: 'Search History', description: 'View your search history and quickly revisit weather data for previously searched cities.' },
    { icon: <FiBarChart2 className="w-6 h-6" />, title: 'Detailed Analytics', description: 'Comprehensive weather data including temperature, humidity, wind speed, pressure and more.' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-blob2" />
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-float" />
          
          {/* Floating Clouds */}
          <div className="absolute top-32 left-0 text-white/5 animate-cloud-drift">
            <FiCloud className="w-32 h-32" />
          </div>
          <div className="absolute top-52 left-0 text-white/5 animate-cloud-drift-slow">
            <FiCloud className="w-24 h-24" />
          </div>
          
          {/* Floating Sun */}
          <div className="absolute top-20 right-1/4 animate-float">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <FiSun className="w-16 h-16 text-yellow-500/20" />
            </motion.div>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm border border-blue-200/50 dark:border-blue-500/20">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
            Live Weather Data — Real-time updates every minute
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            Your Personal
            <motion.span
              className="block gradient-text"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 8, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Weather Companion
            </motion.span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Stay informed with real-time weather updates, save your favourite cities, 
            and track weather patterns with WeatherHub's modern, premium dashboard.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn-primary text-lg px-10 py-4 shadow-xl shadow-blue-500/25">
                  <FiSearch className="w-5 h-5" />
                  Go to Dashboard
                </motion.div>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn-primary text-lg px-10 py-4 shadow-xl shadow-blue-500/25">
                    Get Started Free
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.div>
                </Link>
                <Link to="/login">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn-outline text-lg px-10 py-4">
                    Sign In
                  </motion.div>
                </Link>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '50K+', label: 'Cities Covered' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.9★', label: 'User Rating' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Everything you need in one place
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">
              Powerful weather tracking features designed for everyone, from casual users to weather enthusiasts.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card p-8 text-center group cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 
                    flex items-center justify-center text-white shadow-lg shadow-blue-500/20"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card-strong p-10 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 relative z-10">
              Ready to check the weather?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto text-lg relative z-10">
              Join WeatherHub today and get access to real-time weather data, favourite cities, and much more.
            </p>
            {!isAuthenticated && (
              <Link to="/register" className="relative z-10">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="btn-primary text-lg px-10 py-4 inline-flex shadow-xl shadow-blue-500/25">
                  Create Free Account
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.div>
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

