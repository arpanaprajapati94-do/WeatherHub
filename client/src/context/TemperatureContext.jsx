import { createContext, useContext, useEffect, useState, useCallback } from 'react';

/**
 * Temperature unit context — allows °C / °F toggle across the whole app.
 * Preference is persisted in localStorage.
 */

const TemperatureContext = createContext(null);

const STORAGE_KEY = 'weatherhub-temp-unit';

export const useTemperature = () => {
  const ctx = useContext(TemperatureContext);
  if (!ctx) {
    throw new Error('useTemperature must be used within a TemperatureProvider');
  }
  return ctx;
};

/**
 * Convert a celsius value to the active unit.
 * @param {number} celsius - temperature in °C
 * @returns {number} converted value (rounded)
 */
export const convertTemp = (celsius, unit) => {
  if (celsius == null || Number.isNaN(celsius)) return null;
  if (unit === 'f') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
};

/**
 * Convert a temperature to the active unit using the context.
 * @param {number} celsius - temperature in °C
 * @returns {number} converted + rounded value
 */
export const useTemp = () => {
  const { unit } = useTemperature();
  return useCallback((celsius) => convertTemp(celsius, unit), [unit]);
};

export const TemperatureProvider = ({ children }) => {
  const [unit, setUnit] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'f' ? 'f' : 'c';
    } catch {
      return 'c';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, unit);
    } catch { /* ignore */ }
  }, [unit]);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'c' ? 'f' : 'c'));
  }, []);

  return (
    <TemperatureContext.Provider value={{ unit, setUnit, toggleUnit }}>
      {children}
    </TemperatureContext.Provider>
  );
};

export default TemperatureProvider;

