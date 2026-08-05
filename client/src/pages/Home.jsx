import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiNavigation, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { weatherAPI } from '../services/api';
import CountUp from '../components/home/CountUp';
import AnimatedBackground from '../components/home/AnimatedBackground';
import CursorGlow from '../components/home/CursorGlow';
import LiveWeatherWidget from '../components/home/LiveWeatherWidget';
import TrustedBy from '../components/home/TrustedBy';
import DashboardPreview from '../components/home/DashboardPreview';
import Features from '../components/home/Features';
import WeatherMapSection from '../components/home/WeatherMapSection';
import ChartsSection from '../components/home/ChartsSection';
import Testimonials from '../components/home/Testimonials';
import FaqSection from '../components/home/FaqSection';
import CtaBanner from '../components/home/CtaBanner';
import CitySearch from '../components/CitySearch';
import LiveClock from '../components/LiveClock';
import WeatherSummary from '../components/WeatherSummary';
import PopularCitiesCarousel from '../components/PopularCitiesCarousel';
import useWeatherTheme from '../hooks/useWeatherTheme';
import useGeolocation from '../hooks/useGeolocation';
import { useToast } from '../context/ToastContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stats = [
  { end: 10, suffix: 'K+', label: 'Active Users' },
  { end: 50, suffix: 'K+', label: 'Cities Covered' },
  { end: 99.9, suffix: '%', label: 'Uptime', decimals: 1 },
  { end: 4.9, suffix: '★', label: 'User Rating', decimals: 1 },
];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  const [liveWeather, setLiveWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [heroWeather, setHeroWeather] = useState(null);
  const [heroLoading, setHeroLoading] = useState(false);
  const { locating, locateCity } = useGeolocation();

  // Apply weather-conditioned accent theme (sunny/rain/snow/night/clouds)
  useWeatherTheme(liveWeather?.main || heroWeather?.main || 'Clear', heroWeather ? heroWeather.icon?.includes('d') : liveWeather ? liveWeather.icon?.includes('d') : true);

  const fetchLiveWeather = useCallback(async (city = 'Ahmedabad') => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const res = await weatherAPI.getWeather(city);
      setLiveWeather(res.data.data);
    } catch (err) {
      setWeatherError(err.displayMessage || 'Unable to load live weather');
      setLiveWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveWeather();
  }, [fetchLiveWeather]);

  const handleHeroSearch = useCallback(async (city) => {
    if (!city) return;
    setHeroLoading(true);
    try {
      const res = await weatherAPI.getWeather(city);
      setHeroWeather(res.data.data);
    } catch (err) {
      showError(err.displayMessage || 'Failed to load weather for that city');
    } finally {
      setHeroLoading(false);
    }
  }, [showError]);

  const handleUseMyLocation = useCallback(async () => {
    try {
      const city = await locateCity();
      await handleHeroSearch(city);
      success(`Weather updated for ${city}`);
    } catch (err) {
      showError(err.message || 'Unable to detect your location');
    }
  }, [locateCity, handleHeroSearch, success, showError]);

  // Derive dynamic background from real weather condition
  const backgroundCondition = liveWeather?.main || heroWeather?.main || 'Clear';
  const isDay = heroWeather ? heroWeather.icon?.includes('d') : liveWeather ? liveWeather.icon?.includes('d') : true;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
        <AnimatedBackground condition={backgroundCondition} isDay={isDay} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm border border-blue-200/50 dark:border-blue-500/20"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
                Live Weather Data — Real-time updates every minute
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 leading-tight"
              >
                Your Personal
                <motion.span
                  className="block gradient-text"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Weather Companion
                </motion.span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl mb-6"
              >
                Stay informed with real-time weather updates, save your favourite cities,
                and track weather patterns with WeatherHub's modern, premium dashboard.
              </motion.p>

              {/* Hero search box */}
              <motion.div variants={itemVariants} className="w-full max-w-xl mb-8">
                <CitySearch
                  onSearch={handleHeroSearch}
                  loading={heroLoading}
                  placeholder="Search any city… try Ahmedabad, Mumbai, London"
                />
                <button
                  onClick={handleUseMyLocation}
                  disabled={locating}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiNavigation className="w-4 h-4" />
                  {locating ? 'Detecting your location…' : 'Use My Location'}
                </button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-start gap-4"
              >
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary text-lg px-10 py-4 shadow-xl shadow-blue-500/25"
                    >
                      <FiSearch className="w-5 h-5" />
                      Go to Dashboard
                    </motion.div>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary text-lg px-10 py-4 shadow-xl shadow-blue-500/25"
                      >
                        Get Started Free
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </motion.div>
                    </Link>
                    <Link to="/login">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-outline text-lg px-10 py-4"
                      >
                        Sign In
                      </motion.div>
                    </Link>
                  </>
                )}
              </motion.div>

              {/* Stats with count-up */}
              <motion.div variants={itemVariants} className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold gradient-text">
                      <CountUp
                        end={stat.end}
                        suffix={stat.suffix}
                        decimals={stat.decimals || 0}
                      />
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Live weather widget */}
            <div className="relative flex flex-col gap-4">
              <LiveClock className="glass-card p-4" />
              <LiveWeatherWidget
                weather={heroWeather || liveWeather}
                loading={heroLoading || weatherLoading}
                error={weatherError}
                onRefresh={() => (heroWeather ? handleHeroSearch(heroWeather.city) : fetchLiveWeather())}
              />
              {heroWeather && <WeatherSummary weather={heroWeather} />}
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <TrustedBy />

      {/* Popular Cities */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8"
          >
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
                Trending Now
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Weather in <span className="gradient-text">Popular Cities</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Live conditions from around the world — tap a city to see full details.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FiMapPin className="w-4 h-4" />
              Scroll to explore →
            </div>
          </motion.div>

          <PopularCitiesCarousel
            count={10}
            onSelect={(city) => handleHeroSearch(city)}
          />
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 md:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
              Product Preview
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              A dashboard built for <span className="gradient-text">delight</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Every metric you care about — temperature, humidity, wind, AQI, and forecasts —
              presented in a clean, glassmorphism interface.
            </p>
          </motion.div>
          <DashboardPreview />
        </div>
      </section>

      {/* Features */}
      <Features />

      {/* Weather Map */}
      <WeatherMapSection />

      {/* Charts */}
      <ChartsSection />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FaqSection />

      {/* CTA */}
      <CtaBanner />

      {/* Cursor glow overlay */}
      <CursorGlow />
    </div>
  );
};

export default Home;

