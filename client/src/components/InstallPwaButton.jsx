import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload } from 'react-icons/fi';

/**
 * InstallPwaButton — shows an "Install WeatherHub" button when the browser
 * supports the PWA install prompt (beforeinstallprompt). On iOS/Safari the
 * prompt is not fired, so we fall back to a dismissible tooltip hinting the
 * user to use "Add to Home Screen".
 */
const InstallPwaButton = () => {
  const [installEvent, setInstallEvent] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setInstallEvent(e);
    };
    const onInstalled = () => {
      setInstallEvent(null);
      setInstalled(true);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    // iOS hint (no beforeinstallprompt event) — show after a delay only if standalone-capable
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIos && !window.matchMedia('(display-mode: standalone)').matches) {
      const t = setTimeout(() => setShowHint(true), 6000);
      return () => {
        clearTimeout(t);
        window.removeEventListener('beforeinstallprompt', onBeforeInstall);
        window.removeEventListener('appinstalled', onInstalled);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;
    installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setInstallEvent(null);
  };

  if (installed) return null;

  return (
    <>
      {installEvent && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleInstall}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
            bg-gradient-to-r from-blue-600 to-purple-600 text-white
            shadow-lg shadow-blue-500/25 transition-all"
          title="Install WeatherHub as an app"
        >
          <FiDownload className="w-3.5 h-3.5" />
          Install App
        </motion.button>
      )}

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-0 top-full mt-2 w-56 p-3 rounded-xl glass-card-strong text-xs text-gray-600 dark:text-gray-300 z-50"
          >
            <p className="font-semibold mb-1">📱 Install WeatherHub</p>
            <p>
              Tap the share button in Safari, then choose{' '}
              <span className="font-bold">"Add to Home Screen"</span>.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InstallPwaButton;

