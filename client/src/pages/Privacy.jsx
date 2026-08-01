import { motion } from 'framer-motion';
import { FiShield, FiLock, FiDatabase, FiEye, FiTrash2, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const sections = [
  {
    icon: <FiDatabase className="w-5 h-5" />,
    title: '1. Information We Collect',
    body: [
      'Account Information: When you register, we collect your name, email address, and a securely hashed password.',
      'Weather Data: We store the cities you search for and save as favourites to provide a personalised experience.',
      'Usage Data: We may collect anonymous usage statistics to improve the application, such as popular cities and feature usage.',
    ],
  },
  {
    icon: <FiLock className="w-5 h-5" />,
    title: '2. How We Use Your Information',
    body: [
      'To provide and maintain the WeatherHub service, including saving your favourite cities and search history.',
      'To authenticate your account and keep your data secure using JSON Web Tokens (JWT) and bcrypt password hashing.',
      'To improve our product by analysing aggregate, non-identifiable usage patterns.',
    ],
  },
  {
    icon: <FiEye className="w-5 h-5" />,
    title: '3. Data Sharing',
    body: [
      'We do not sell, rent, or trade your personal information to third parties.',
      'Weather data is fetched from public weather APIs (such as OpenWeatherMap) and is not tied to your identity.',
      'We only disclose information if required by law or to protect the rights and safety of our users.',
    ],
  },
  {
    icon: <FiShield className="w-5 h-5" />,
    title: '4. Data Security',
    body: [
      'Passwords are hashed with bcrypt — we never store or see your plain-text password.',
      'API requests are authenticated with encrypted JSON Web Tokens that expire automatically.',
      'We follow industry best practices for secure data storage and transmission.',
    ],
  },
  {
    icon: <FiTrash2 className="w-5 h-5" />,
    title: '5. Your Rights & Data Deletion',
    body: [
      'You can delete your account at any time from the Profile page. This permanently removes your account, favourites, and search history.',
      'You can clear your search history individually or all at once.',
      'Contact us at support@weatherhub.com to request a copy or deletion of your personal data.',
    ],
  },
  {
    icon: <FiMail className="w-5 h-5" />,
    title: '6. Contact Us',
    body: [
      'If you have any questions about this Privacy Policy or how your data is handled, please reach out to support@weatherhub.com.',
      'We review and update this policy periodically to reflect changes in our practices.',
    ],
  },
];

const Privacy = () => {
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
            <FiShield className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">Last updated: February 2026</p>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Your privacy matters. This policy explains what data we collect and how we protect it.
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
            By using WeatherHub, you agree to this Privacy Policy and our{' '}
            <Link to="/terms" className="text-blue-500 hover:underline">Terms of Service</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;


