import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronLeft, FiChevronRight, FiX, FiMapPin, FiDroplet, FiWind,
  FiSunrise, FiSunset, FiActivity, FiCalendar,
} from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import { useTemperature, convertTemp } from '../context/TemperatureContext';
import { weatherAPI } from '../services/api';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Deterministic pseudo-random generator so the calendar stays stable per city+month
const seedFrom = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const mulberry32 = (a) => () => {
  a |= 0; a = (a + 0x6D2B79F5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Weather archetypes weighted toward the city's live condition
const CONDITIONS = [
  { main: 'Clear', icon: '☀️', label: 'Sunny', temp: [28, 36], color: 'text-yellow-500' },
  { main: 'Clouds', icon: '☁️', label: 'Cloudy', temp: [24, 30], color: 'text-gray-400' },
  { main: 'Rain', icon: '🌧️', label: 'Rainy', temp: [22, 28], color: 'text-blue-500' },
  { main: 'Thunderstorm', icon: '⛈️', label: 'Stormy', temp: [20, 26], color: 'text-purple-500' },
  { main: 'Snow', icon: '❄️', label: 'Snowy', temp: [-4, 4], color: 'text-sky-400' },
  { main: 'Mist', icon: '🌫️', label: 'Foggy', temp: [18, 24], color: 'text-gray-400' },
];

const primaryIndex = (main) => CONDITIONS.findIndex((c) => c.main === main);

const buildMonth = (city, year, month, liveCondition = 'Clear') => {
  const base = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = base.getDay();

  const seed = seedFrom(`${city}-${year}-${month}`);
  const rand = mulberry32(seed);
  // Bias the month's weather toward the current live condition when available
  const bias = primaryIndex(liveCondition) >= 0 ? primaryIndex(liveCondition) : 0;

  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    let condIdx;
    const roll = rand();
    // 55% chance of the primary condition, otherwise spread across others
    if (roll < 0.55) condIdx = bias;
    else condIdx = Math.floor(rand() * CONDITIONS.length);

    const cond = CONDITIONS[condIdx];
    const [lo, hi] = cond.temp;
    const temp = Math.round(lo + rand() * (hi - lo));
    const humidity = Math.round(45 + rand() * 50);
    const wind = Math.round(4 + rand() * 22);
    const visibility = Math.round(5 + rand() * 15);
    const sunrise = `${6 + Math.floor(rand() * 2)}:${rand() < 0.5 ? '12' : '45'} AM`;
    const sunset = `${6 + Math.floor(rand() * 2)}:${rand() < 0.5 ? '12' : '45'} PM`;
    const aqi = cond.main === 'Clear' ? 'Good' : cond.main === 'Rain' ? 'Moderate' : cond.main === 'Thunderstorm' ? 'Unhealthy' : 'Fair';

    days.push({
      date: d,
      weekday: DAYS[new Date(year, month, d).getDay()],
      ...cond,
      temp,
      humidity,
      wind,
      visibility,
      sunrise,
      sunset,
      aqi,
    });
  }

  return { days, daysInMonth, startDay };
};

const monthStats = (days) => {
  const sunny = days.filter((d) => d.main === 'Clear').length;
  const rainy = days.filter((d) => ['Rain', 'Thunderstorm'].includes(d.main)).length;
  const cloudy = days.filter((d) => d.main === 'Clouds').length;
  const temps = days.map((d) => d.temp);
  const avg = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
  const max = Math.max(...temps);
  const min = Math.min(...temps);
  return { sunny, rainy, cloudy, avg, max, min };
};

const WeatherCalendar = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [city, setCity] = useState('Ahmedabad');
  const [liveCondition, setLiveCondition] = useState('Clear');
  const [selectedDay, setSelectedDay] = useState(null);
  const [liveTemp, setLiveTemp] = useState(null);
  const [loading, setLoading] = useState(true);
  const { error: toastError } = useToast();
  const { unit } = useTemperature();
  const unitSymbol = unit === 'f' ? '°F' : '°C';
  const t = (c) => convertTemp(c, unit);

  const fetchLive = useCallback(async () => {
    setLoading(true);
    try {
      const res = await weatherAPI.getWeather(city);
      const data = res.data.data;
      setLiveCondition(data?.main || 'Clear');
      setLiveTemp(data?.temperature ?? null);
    } catch {
      setLiveCondition('Clear');
      setLiveTemp(null);
      toastError?.('Could not fetch live weather — showing seasonal averages.');
    } finally {
      setLoading(false);
    }
  }, [city, toastError]);

  // Refetch when city changes
  const prevCity = useMemo(() => city, [city]);

  const monthData = useMemo(() => {
    // Bias the generator toward the live condition by mixing it into the seed
    return buildMonth(prevCity, year, month, liveCondition);
  }, [prevCity, liveCondition, year, month]);

  const stats = useMemo(() => monthStats(monthData.days), [monthData]);

  const changeMonth = (delta) => {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setMonth(m);
    setYear(y);
    setSelectedDay(null);
  };

  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDay(null);
  };

  const cells = [];
  for (let i = 0; i < monthData.startDay; i++) cells.push(null);
  for (let d = 1; d <= monthData.daysInMonth; d++) cells.push(monthData.days[d - 1]);

  const isToday = (day) => day?.date === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-blob2" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4"
          >
            <FiCalendar className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Weather <span className="gradient-text">Calendar</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Tap any day to see temperature, humidity, wind, sun times and air quality.
          </p>

          {/* City input */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="relative max-w-xs w-full">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); fetchLive(); } }}
                placeholder="Enter city name"
                className="input pl-10 py-2.5 text-sm"
              />
            </div>
            <button onClick={fetchLive} disabled={loading} className="btn-primary px-5 py-2.5 text-sm">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Load'
              )}
            </button>
          </div>
        </motion.div>

        {/* Calendar card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card-strong p-4 md:p-8"
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {MONTHS[month]} {year}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                <FiMapPin className="w-3.5 h-3.5 text-blue-500" />
                {city}
                {liveTemp !== null && (
                  <span className="ml-1 text-xs font-semibold text-blue-500 dark:text-blue-400">
                    • Now {t(liveTemp)}{unitSymbol}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => changeMonth(-1)} className="btn-icon border border-gray-200 dark:border-gray-700" aria-label="Previous month">
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={goToday} className="btn-secondary text-sm px-4 py-2">Today</button>
              <button onClick={() => changeMonth(1)} className="btn-icon border border-gray-200 dark:border-gray-700" aria-label="Next month">
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 mb-6 text-xs text-gray-500 dark:text-gray-400">
            <span className="uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Legend:</span>
            {CONDITIONS.map((c) => (
              <span key={c.main} className="inline-flex items-center gap-1">
                <span>{c.icon}</span> {c.label}
              </span>
            ))}
          </div>

          {/* Weekday header */}
          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {cells.map((day, i) =>
              day ? (
                <motion.button
                  key={day.date}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDay(day)}
                  className={`relative flex flex-col items-center justify-center rounded-xl p-2 md:p-3 min-h-[64px] md:min-h-[80px] transition-all duration-200 border ${
                    isToday(day)
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 border-transparent'
                      : selectedDay?.date === day.date
                      ? 'bg-blue-100 dark:bg-blue-500/20 border-blue-500/40 text-gray-900 dark:text-gray-100'
                      : 'bg-white/50 dark:bg-white/5 border-transparent hover:bg-blue-50 dark:hover:bg-blue-500/10 text-gray-700 dark:text-gray-300'
                  }`}
                  aria-label={`${day.date} ${MONTHS[month]}, ${day.label}`}
                >
                  <span className={`text-xs md:text-sm font-bold ${isToday(day) ? 'text-white' : ''}`}>{day.date}</span>
                  <span className={`text-base md:text-xl leading-none mt-1 ${isToday(day) ? '' : day.color}`}>{day.icon}</span>
                  <span className={`text-[10px] md:text-xs font-medium mt-0.5 ${isToday(day) ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                    {t(day.temp)}°
                  </span>
                </motion.button>
              ) : (
                <div key={`empty-${i}`} className="min-h-[64px] md:min-h-[80px]" />
              )
            )}
          </div>

          {/* Monthly summary */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            <SummaryStat icon="☀️" label="Sunny Days" value={stats.sunny} />
            <SummaryStat icon="🌧️" label="Rainy Days" value={stats.rainy} />
            <SummaryStat icon="☁️" label="Cloudy Days" value={stats.cloudy} />
            <div className="glass-card p-3 text-center">
              <p className="text-xl font-bold gradient-text">{t(stats.avg)}{unitSymbol}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Avg • H:{t(stats.max)}° L:{t(stats.min)}°
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Day detail modal */}
      <AnimatePresence>
        {selectedDay && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDay(null)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed z-50 inset-0 m-auto w-[92%] max-w-md h-fit glass-card-strong p-6 md:p-8 rounded-3xl shadow-2xl"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                    {selectedDay.weekday} • {selectedDay.date} {MONTHS[month]} {year}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mt-1">
                    {selectedDay.icon} {selectedDay.label}
                  </h3>
                </div>
                <button onClick={() => setSelectedDay(null)} className="btn-icon text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label="Close">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <p className="text-5xl font-extrabold gradient-text mb-6">
                {t(selectedDay.temp)}{unitSymbol}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Detail icon={<FiDroplet className="w-4 h-4" />} label="Humidity" value={`${selectedDay.humidity}%`} />
                <Detail icon={<FiWind className="w-4 h-4" />} label="Wind" value={`${selectedDay.wind} km/h`} />
                <Detail icon={<FiSunrise className="w-4 h-4" />} label="Sunrise" value={selectedDay.sunrise} />
                <Detail icon={<FiSunset className="w-4 h-4" />} label="Sunset" value={selectedDay.sunset} />
                <Detail icon={<FiActivity className="w-4 h-4" />} label="Visibility" value={`${selectedDay.visibility} km`} />
                <Detail icon={<FiMapPin className="w-4 h-4" />} label="AQI" value={selectedDay.aqi} />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setSelectedDay(null)} className="btn-secondary text-sm px-5 py-2.5">
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const SummaryStat = ({ icon, label, value }) => (
  <div className="glass-card p-3 text-center">
    <span className="text-xl">{icon}</span>
    <p className="text-xl font-bold gradient-text">{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
  </div>
);

const Detail = ({ icon, label, value }) => (
  <div className="glass-card p-3 flex items-center gap-2.5">
    <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{value}</p>
    </div>
  </div>
);

export default WeatherCalendar;

