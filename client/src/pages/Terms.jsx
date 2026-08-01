import { motion } from 'framer-motion';
import { FiFileText, FiCheckCircle, FiAlertTriangle, FiInfo, FiLock, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const sections = [
  {
    icon: <FiFileText className="w-5 h-5" />,
    title: '1. Acceptance of Terms',
    body: [
      'By accessing or using WeatherHub, you agree to be bound by these Terms of Service and all applicable laws and regulations.',
      'If you do not agree with any part of these terms, you should discontinue use of the application.',
    ],
  },
  {
    icon: <FiInfo className="w-5 h-5" />,
    title: '2. Service Description',
    body: [
      'WeatherHub provides real-time weather information, forecasts, and related features for cities worldwide.',
      'Weather data is sourced from third-party providers (e.g., OpenWeatherMap) and may occasionally be delayed or inaccurate.',
      'The service is provided "as is" for informational purposes and should not be relied upon for critical safety decisions.',
    ],
  },
  {
    icon: <FiCheckCircle className="w-5 h-5" />,
    title: '3. User Responsibilities',
    body: [
      'You agree to provide accurate information when creating an account.',
      'You are responsible for maintaining the confidentiality of your login credentials.',
      'You agree not to misuse the service, attempt to disrupt it, or use it for unlawful purposes.',
    ],
  },
  {
    icon: <FiAlertTriangle className="w-5 h-5" />,
    title: '4. Acceptable Use',
    body: [
      'Do not attempt to gain unauthorised access to other users\' accounts or the underlying systems.',
      'Do not scrape, automate, or excessively query the service in a way that degrades performance for others.',
      'Do not use the service to harass, abuse, or harm other individuals.',
    ],
  },
  {
    icon: <FiLock className="w-5 h-5" />,
    title: '5. Accounts & Termination',
    body: [
      'You can delete your account at any time from the Profile page.',
      'We reserve the right to suspend or terminate accounts that violate these terms.',
      'Upon termination, your access to the service ceases, but provisions that should survive will remain in effect.',
    ],
  },
  {
    icon: <FiMail className="w-5 h-5" />,
    title: '6. Changes & Contact',
    body: [
      'We may update these terms from time to time. Continued use of the service after changes constitutes acceptance.',
      'For questions about these terms, contact us at support@weatherhub.com.',
    ],
  },
];

const Terms = () => {
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
            <FiFileText className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">Last updated: February 2026</p>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Please read these terms carefully before using WeatherHub.
          </p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6"
            >
              <h2 className="flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                  {section.icon}
                </span>
                {section.title}
              </h2>
              <ul className="space-y-2 pl-2">
                {section.body.map((point) => (
                  <li key={point} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex gap-2">
                    <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Read our{' '}
            <Link to="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link> to learn how we handle your data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;


