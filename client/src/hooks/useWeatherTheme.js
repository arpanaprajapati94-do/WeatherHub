import { useEffect } from 'react';

/**
 * useWeatherTheme — applies a weather-conditioned accent theme to the app root.
 * Sets CSS custom properties (--wh-accent, --wh-accent-rgb, --wh-glow) based on
 * the current weather condition so cards, buttons, and glows pick up the mood:
 *   Clear day   → warm orange/gold
 *   Rain/Storm  → deep blue
 *   Snow        → cool ice blue
 *   Mist/Fog    → slate gray
 *   Night       → dark navy/violet
 *   Clouds      → soft blue
 *
 * Themes are subtle and respect the existing blue/purple design language —
 * the accent is applied only to highlight borders/glows, not a full redesign.
 */
const useWeatherTheme = (condition, isDay) => {
  useEffect(() => {
    const root = document.documentElement;
    const main = String(condition || '').toLowerCase();
    const night = !isDay;

    let accent = '#3b82f6';
    let accentRgb = '59, 130, 246';
    let glow = 'rgba(59, 130, 246, 0.25)';

    if (night) {
      accent = '#818cf8';
      accentRgb = '129, 140, 248';
      glow = 'rgba(129, 140, 248, 0.25)';
    } else if (['rain', 'drizzle', 'thunderstorm'].includes(main)) {
      accent = '#2563eb';
      accentRgb = '37, 99, 235';
      glow = 'rgba(37, 99, 235, 0.3)';
    } else if (main === 'snow') {
      accent = '#38bdf8';
      accentRgb = '56, 189, 248';
      glow = 'rgba(56, 189, 248, 0.2)';
    } else if (['mist', 'fog', 'haze'].includes(main)) {
      accent = '#94a3b8';
      accentRgb = '148, 163, 184';
      glow = 'rgba(148, 163, 184, 0.2)';
    } else if (main === 'clear') {
      accent = '#f59e0b';
      accentRgb = '245, 158, 11';
      glow = 'rgba(245, 158, 11, 0.25)';
    } else if (main === 'clouds') {
      accent = '#0ea5e9';
      accentRgb = '14, 165, 233';
      glow = 'rgba(14, 165, 233, 0.25)';
    }

    root.style.setProperty('--wh-accent', accent);
    root.style.setProperty('--wh-accent-rgb', accentRgb);
    root.style.setProperty('--wh-glow', glow);

    return () => {
      root.style.removeProperty('--wh-accent');
      root.style.removeProperty('--wh-accent-rgb');
      root.style.removeProperty('--wh-glow');
    };
  }, [condition, isDay]);
};

export default useWeatherTheme;

