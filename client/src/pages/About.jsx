import { motion } from 'framer-motion';
import { FiShield, FiZap, FiCloud, FiServer, FiDatabase, FiLock } from 'react-icons/fi';

const About = () => {
  const techStack = [
    { name: 'React', icon: <FiZap className="w-5 h-5" />, color: 'bg-blue-500/20 text-blue-400' },
    { name: 'Vite', icon: <FiZap className="w-5 h-5" />, color: 'bg-purple-500/20 text-purple-400' },
    { name: 'Tailwind CSS', icon: <FiCloud className="w-5 h-5" />, color: 'bg-cyan-500/20 text-cyan-400' },
    { name: 'Node.js', icon: <FiServer className="w-5 h-5" />, color: 'bg-green-500/20 text-green-400' },
    { name: 'Express', icon: <FiServer className="w-5 h-5" />, color: 'bg-gray-500/20 text-gray-400' },
    { name: 'MongoDB', icon: <FiDatabase className="w-5 h-5" />, color: 'bg-green-500/20 text-green-400' },
    { name: 'Mongoose', icon: <FiDatabase className="w-5 h-5" />, color: 'bg-red-500/20 text-red-400' },
    { name: 'JWT', icon: <FiLock className="w-5 h-5" />, color: 'bg-pink-500/20 text-pink-400' },
    { name: 'Axios', icon: <FiShield className="w-5 h-5" />, color: 'bg-indigo-500/20 text-indigo-400' },
  ];

  const features = [
    'Real-time weather data from OpenWeatherMap API',
    'User authentication with JWT',
    'Save and manage favourite cities',
    'Search history tracking',
    'Dark/Light mode with theme persistence',
    'Fully responsive mobile-first design',
    'Detailed weather metrics (temperature, humidity, wind, pressure)',
    'Sunrise and sunset times',
    'Glassmorphism modern UI design',
    'Smooth animations and transitions',
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-blob2" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4"
          >
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79z"/>
            </svg>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            About <span className="gradient-text">WeatherHub</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A modern weather application built with the MERN Stack, providing real-time weather information, favourite cities, and a beautiful user experience.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">⚡</span>
            Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            We believe weather information should be fast, accurate, and accessible. WeatherHub provides a clean, premium interface for checking current weather conditions anywhere in the world. Our mission is to make weather tracking delightful and effortless.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm">✓</span>
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-white/5"
              >
                <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm">💻</span>
            Technology Stack
          </h2>
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech) => (
              <motion.span
                key={tech.name}
                whileHover={{ y: -2, scale: 1.05 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${tech.color} backdrop-blur-sm border border-white/10`}
              >
                {tech.icon}
                {tech.name}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { value: '10K+', label: 'Users' },
            { value: '50K+', label: 'Cities' },
            { value: '99.9%', label: 'Uptime' },
            { value: '24/7', label: 'Support' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-5 text-center">
              <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <p className="text-gray-500 dark:text-gray-400">
            Built with <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="inline-block">❤️</motion.span> using the MERN Stack.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

