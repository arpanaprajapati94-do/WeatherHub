import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiStar, FiX, FiMapPin, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useWeather from '../hooks/useWeather';
import { favouritesAPI } from '../services/api';
import CitySearch from '../components/CitySearch';
import WeatherCard from '../components/WeatherCard';
import ForecastSection from '../components/ForecastSection';
import AirQualityWidget from '../components/AirQualityWidget';
import WeatherAlerts from '../components/WeatherAlerts';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const {
    weather, forecast, airQuality, alerts,
    loading, error, searchWeather, setError,
  } = useWeather();
  const [favourites, setFavourites] = useState([]);
  const [loadingFavourites, setLoadingFavourites] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

const loadFavourites = async () => {
    try {
      const res = await favouritesAPI.getAll();
      setFavourites(res.data.data || []);
    } catch (err) {
      console.error('Failed to load favourites:', err);
    } finally {
      setLoadingFavourites(false);
    }
  };

  useEffect(() => { loadFavourites(); }, []);

  const handleSearch = async (city) => {
    try { await searchWeather(city); }
    catch (err) { /* Error is set in the hook */ }
  };

  const handleToggleFavourite = useCallback(async () => {
    if (!weather) return;
    const isFav = favourites.some((f) => f.city.toLowerCase() === weather.city.toLowerCase());
    try {
      if (isFav) {
        const fav = favourites.find((f) => f.city.toLowerCase() === weather.city.toLowerCase());
        if (fav?._id) {
          await favouritesAPI.remove(fav._id);
          setFavourites((prev) => prev.filter((f) => f._id !== fav._id));
          success(`Removed ${weather.city} from favourites`);
        }
      } else {
        const res = await favouritesAPI.add({
          city: weather.city, country: weather.country,
          latitude: weather.coordinates?.lat, longitude: weather.coordinates?.lon,
        });
        setFavourites((prev) => [res.data.data, ...prev]);
        success(`Added ${weather.city} to favourites`);
      }
    } catch (err) {
      showError(err.displayMessage || 'Failed to update favourites');
    }
  }, [weather, favourites, success, showError]);

  const isCurrentFavourite = weather
    ? favourites.some((f) => f.city.toLowerCase() === weather.city.toLowerCase()) : false;

  const handleRefresh = () => { if (weather?.city) handleSearch(weather.city); };

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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Search for any city to get real-time weather information
          </p>
        </motion.div>

        <div className="mb-10">
          <CitySearch onSearch={handleSearch} loading={loading} />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center gap-3"
          >
            <FiX className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300 flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <FiX className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {loading && (
          <div className="glass-card p-12">
            <LoadingSpinner size="lg" text="Fetching weather data..." />
          </div>
        )}

        {weather && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <WeatherCard
              weather={weather}
              isFavourite={isCurrentFavourite}
              onToggleFavourite={handleToggleFavourite}
              onRefresh={handleRefresh}
            />

            {/* Extended details toggle */}
            <button
              onClick={() => setShowDetails((prev) => !prev)}
              className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
            >
              {showDetails ? (
                <>
                  <FiChevronDown className="w-4 h-4 rotate-180 transition-transform" />
                  Hide forecast, air quality & alerts
                </>
              ) : (
                <>
                  <FiChevronDown className="w-4 h-4 transition-transform" />
                  Show 7-day forecast, air quality & alerts
                </>
              )}
            </button>

            {showDetails && (
              <div className="mt-4 space-y-6">
                <ForecastSection data={forecast} loading={false} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AirQualityWidget data={airQuality} />
                  <WeatherAlerts data={alerts} />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {!weather && !loading && !error && (
          <div className="glass-card p-12 text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center"
            >
              <FiSearch className="w-12 h-12 text-blue-500" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Search for a City
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Enter a city name above to get detailed weather information including temperature, humidity, wind speed, and more.
            </p>
          </div>
        )}

        {!loading && favourites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <FiStar className="w-5 h-5 text-yellow-500 fill-current" />
              Quick Access — Favourite Cities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {favourites.slice(0, 4).map((fav, i) => (
                <motion.button
                  key={fav._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => handleSearch(fav.city)}
                  className="glass-card p-4 text-center cursor-pointer"
                >
                  <FiMapPin className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{fav.city}</p>
                  {fav.country && <p className="text-xs text-gray-500 dark:text-gray-400">{fav.country}</p>}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

