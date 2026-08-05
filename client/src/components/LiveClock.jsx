import { useState, useEffect } from 'react';

/**
 * LiveClock — real-time day/date/time that updates every second.
 * Formats: "Sunday", "2 August 2026", "03:15:45 PM"
 *
 * @param {string}  className - extra classes for the wrapper
 * @param {boolean} showSeconds - toggle seconds display
 */
const LiveClock = ({ className = '', showSeconds = false }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
  const date = now.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
  });

  return (
    <div className={`text-center ${className}`} role="timer" aria-live="off">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{weekday}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{date}</p>
      <p className="text-lg font-bold tabular-nums gradient-text">{time}</p>
    </div>
  );
};

export default LiveClock;

