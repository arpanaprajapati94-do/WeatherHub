import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle, FiMessageCircle, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const faqs = [
  {
    category: 'General',
    items: [
      {
        q: 'What is WeatherHub?',
        a: 'WeatherHub is a modern, real-time weather application built with the MERN stack (MongoDB, Express, React, Node.js). It provides current weather conditions, forecasts, air quality, and more for cities worldwide — with a clean, premium interface.',
      },
      {
        q: 'Is WeatherHub free to use?',
        a: 'Yes! WeatherHub is completely free. You can search any city for current weather instantly without an account. Creating a free account lets you save favourite cities and keep a search history across devices.',
      },
      {
        q: 'Which cities are supported?',
        a: 'WeatherHub supports thousands of cities worldwide. Start typing in the search bar to see matching results, or pick from the popular cities on the home page.',
      },
    ],
  },
  {
    category: 'Features & Usage',
    items: [
      {
        q: 'How do I save a city to my favourites?',
        a: 'Once you create an account and sign in, open any city\'s weather details and click the heart icon. Your favourite cities will appear on the Favourites page for quick access.',
      },
      {
        q: 'Does WeatherHub work on mobile?',
        a: 'Absolutely. WeatherHub is fully responsive and mobile-first. The interface adapts seamlessly to phones, tablets, and desktop screens, including touch-friendly menus and controls.',
      },
      {
        q: 'Can I switch between dark and light mode?',
        a: 'Yes. Use the moon/sun toggle in the top navigation bar. Your preference is saved automatically and applied every time you visit.',
      },
      {
        q: 'What does the search history do?',
        a: 'When signed in, WeatherHub keeps track of the cities you search. You can review your recent searches on the Profile page and clear the history at any time.',
      },
    ],
  },
  {
    category: 'Data & Accuracy',
    items: [
      {
        q: 'Where does the weather data come from?',
        a: 'Weather data is sourced from the OpenWeatherMap API, a globally recognised weather data provider that aggregates information from thousands of meteorological stations and satellites.',
      },
      {
        q: 'How often is the data updated?',
        a: 'Weather conditions are updated in real time. Each time you search or refresh a city, you receive the latest available observation for that location.',
      },
      {
        q: 'Why does my city show different conditions than other apps?',
        a: 'Weather apps can differ because they sample from different stations, use different update times, or apply different forecast models. WeatherHub always uses the most recent observation from our data provider.',
      },
    ],
  },
  {
    category: 'Account & Privacy',
    items: [
      {
        q: 'How do I create an account?',
        a: 'Click the "Sign Up" button in the top-right corner, enter your name, email, and a secure password. You\'ll be signed in instantly and can start saving favourite cities right away.',
      },
      {
        q: 'I forgot my password. What can I do?',
        a: 'For now, please contact support at support@weatherhub.com and our team will help you regain access to your account as quickly as possible.',
      },
      {
        q: 'Is my data safe?',
        a: 'Yes. Passwords are securely hashed using bcrypt, and authentication is handled with JSON Web Tokens (JWT). We never share your personal information. See our Privacy Policy for full details.',
      },
    ],
  },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-200">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center"
        >
          <FiChevronDown className="w-4 h-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-blob2" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
            <FiHelpCircle className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Everything you need to know about WeatherHub. Can't find an answer? Contact us!
          </p>
        </motion.div>

        <div className="space-y-10">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-blue-500 to-purple-600 inline-block" />
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 text-center mt-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <FiMessageCircle className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Still have questions?</h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Our team is happy to help. Reach out and we'll get back to you as soon as possible.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-primary py-2.5 px-6 text-sm">Contact Us</Link>
            <a href="mailto:support@weatherhub.com" className="btn-secondary py-2.5 px-6 text-sm inline-flex items-center gap-2">
              <FiMail className="w-4 h-4" />
              support@weatherhub.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;

