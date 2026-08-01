import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
  {
    q: 'How accurate is the weather data?',
    a: 'WeatherHub is powered by the OpenWeather API, one of the most reliable weather data providers in the world. Current conditions update in real time, while forecasts are generated from global meteorological models.',
  },
  {
    q: 'Is WeatherHub free to use?',
    a: 'Yes! You can search any city and view current weather conditions without an account. Creating a free account unlocks favourites, search history, and a personalized dashboard experience.',
  },
  {
    q: 'Can I save my favourite cities?',
    a: 'Absolutely. Once you sign in, you can add any city to your favourites with a single click. Your favourites are saved securely to MongoDB and accessible from the dashboard, just like a production SaaS app.',
  },
  {
    q: 'Which cities are supported?',
    a: 'WeatherHub supports 700+ cities worldwide through smart search autocomplete. If a city is missing, you can still type it directly and our API will fetch the data for you.',
  },
  {
    q: 'Does it work on mobile?',
    a: 'Yes — the entire dashboard is fully responsive and optimized for desktop, tablet, and mobile devices. The dark mode also adapts automatically if you prefer a darker interface.',
  },
  {
    q: 'How is my data protected?',
    a: 'Your account is secured with JWT authentication and your password is hashed using bcrypt. Favourites and search history are private to your account only.',
  },
];

/**
 * Animated FAQ accordion.
 */
const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Everything you need to know about WeatherHub.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`glass-card overflow-hidden transition-colors duration-300 ${isOpen ? 'border-blue-500/30' : ''}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 text-gray-400 dark:text-gray-500"
                  >
                    <FiChevronDown className="w-5 h-5" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-6 pb-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

