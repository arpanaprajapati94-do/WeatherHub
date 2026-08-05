import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

/**
 * Smart weather alerts panel.
 * Shows severe weather warnings (thunderstorm, heavy rain, heatwave, wind, cold).
 */
const WeatherAlerts = ({ data, loading = false, error = null }) => {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState([]);

  const allAlerts = data?.alerts || [];
  // Attach a stable, original-index-based key to each alert so that dismissing
  // one alert always removes the correct entry even after previous dismissals
  // (neither the visible index nor the filtered index can be relied on).
  const alerts = allAlerts
    .map((alert, i) => ({ alert, key: `${alert.title}-${i}` }))
    .filter(({ key }) => !dismissed.includes(key));

  const dismissAlert = (key) => {
    setDismissed((prev) => (prev.includes(key) ? prev : [...prev, key]));
  };

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Checking alerts
          </span>
        </div>
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-14" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (alerts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 flex items-center gap-3 border-l-4 border-l-green-500"
      >
        <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center text-green-500 flex-shrink-0">
          <FiAlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">No weather alerts</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Conditions look clear — no severe weather warnings for {data?.city || 'this area'}.
          </p>
        </div>
      </motion.div>
    );
  }

  const highSeverity = alerts.filter((a) => a.alert.severity === 'high');
  const visible = expanded ? alerts : alerts.slice(0, 2);

  const severityColor = {
    high: 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300',
    moderate: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
    low: 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300',
  };

  const severityIcon = {
    high: '🔴',
    moderate: '🟡',
    low: '🔵',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            highSeverity.length > 0
              ? 'bg-gradient-to-br from-red-400 to-rose-500 text-white'
              : 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white'
          }`}>
            <FiAlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Weather Alerts
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {highSeverity.length > 0
                ? `${highSeverity.length} active warning${highSeverity.length > 1 ? 's' : ''}`
                : `${alerts.length} notice${alerts.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        {data.city && <span className="badge-blue text-xs">{data.city}</span>}
      </div>

      {/* Alerts list */}
      <div className="space-y-2">
        <AnimatePresence>
          {visible.map(({ alert, key }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-l-4 ${severityColor[alert.severity] || severityColor.low}`}
            >
              <span className="text-xl leading-none mt-0.5">{alert.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{alert.title}</p>
                  <span className="text-xs opacity-70">{severityIcon[alert.severity]} {alert.severity}</span>
                </div>
                <p className="text-xs mt-1 opacity-80 leading-relaxed">{alert.message}</p>
              </div>
              <button
                onClick={() => dismissAlert(key)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 opacity-60"
                aria-label="Dismiss"
              >
                <FiX className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Expand / collapse */}
      {alerts.length > 2 && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
        >
          {expanded ? (
            <>
              <FiChevronUp className="w-4 h-4" />
              Show fewer alerts
            </>
          ) : (
            <>
              <FiChevronDown className="w-4 h-4" />
              Show all {alerts.length} alerts
            </>
          )}
        </button>
      )}
    </motion.div>
  );
};

export default WeatherAlerts;

