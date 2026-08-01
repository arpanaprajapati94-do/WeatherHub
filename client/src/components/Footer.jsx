import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiHeart } from 'react-icons/fi';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Link to="/" aria-label="WeatherHub Home">
                <Logo size={34} />
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-4">
              Your personal weather companion. Real-time weather updates, forecasts, and more — all in a beautiful, modern interface.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/arpanaprajapati94-do?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:text-blue-500 transition-all">
                <FiGithub className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/in/arpana-b-prajapati-4239a235b" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:text-blue-500 transition-all">
                <FiLinkedin className="w-4 h-4" />
              </a>
              <a href="mailto:support@weatherhub.com" aria-label="Email"
                className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:text-blue-500 transition-all">
                <FiMail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/favourites', label: 'Favourites' },
                { to: '/calendar', label: 'Weather Calendar' },
                { to: '/about', label: 'About' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              {[
                { to: '/dashboard', label: 'Live Weather' },
                { to: '/favourites', label: 'Favourite Cities' },
                { to: '/about', label: 'About Us' },
                { to: '/register', label: 'Get Started' },
                { to: '/faq', label: 'FAQ' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-center gap-3">
                <FiMail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                support@weatherhub.com
              </li>
              <li className="flex items-center gap-3">
                <FiMapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                123 Weather Street, Cloud City
              </li>
            </ul>
            <ul className="space-y-3 mt-4">
              {[
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms of Service' },
                { to: '/faq', label: 'FAQ' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; {currentYear} WeatherHub. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
            Built with <FiHeart className="w-3 h-3 text-red-500 fill-current" aria-label="love" /> using the MERN Stack.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

