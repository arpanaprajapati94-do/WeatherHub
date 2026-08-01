import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const testimonials = [
  {
    name: 'John Carter',
    role: 'Product Manager',
    initials: 'JC',
    quote: 'The cleanest weather dashboard I have used. Real-time data, beautiful charts, and the favourite cities feature is incredibly handy for daily planning.',
    rating: 5,
    accent: 'from-blue-500 to-purple-600',
  },
  {
    name: 'Priya Sharma',
    role: 'Frontend Developer',
    initials: 'PS',
    quote: 'As a developer, I appreciate the attention to detail — glassmorphism UI, smooth animations, and a polished dark mode. This is SaaS-grade quality.',
    rating: 5,
    accent: 'from-purple-500 to-pink-600',
  },
  {
    name: 'Alex Morgan',
    role: 'Travel Blogger',
    initials: 'AM',
    quote: 'I check WeatherHub before every trip. The air quality data and sunrise/sunset times make it my go-to weather companion worldwide.',
    rating: 5,
    accent: 'from-emerald-500 to-cyan-600',
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

/**
 * Testimonials section with rating stars.
 */
const Testimonials = () => (
  <section className="py-16 md:py-24 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 text-xs font-semibold uppercase tracking-wider mb-4">
          Testimonials
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Loved by users <span className="gradient-text">worldwide</span>
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="flex gap-1 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">4.9/5 average rating</span>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {testimonials.map((t) => (
          <motion.div
            key={t.name}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="glass-card p-8 flex flex-col"
          >
            <div className="flex gap-1 text-yellow-400 mb-5">
              {[...Array(t.rating)].map((_, i) => (
                <FiStar key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-1 mb-6">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.accent} flex items-center justify-center text-white text-sm font-bold`}>
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Testimonials;

