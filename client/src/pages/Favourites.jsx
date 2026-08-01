import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import { favouritesAPI } from '../services/api';
import WeatherCard from '../components/WeatherCard';
import LoadingSpinner from '../components/LoadingSpinner';
import useWeather from '../hooks/useWeather';

const FavouritesPage = () => {
  const [favourites, setFavourites] = useState([]);
  const [loadingFavourites, setLoadingFavourites] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);
  const { success, error: showError } = useToast();
  const { weather, loading: weatherLoading, searchWeather, clearWeather } = useWeather();

  useEffect(() => { loadFavourites(); }, []);

  const loadFavourites = async () => {
    try {
      const res = await favouritesAPI.getAll();
      setFavourites(res.data.data || []);
    } catch (err) {
      showError('Failed to load favourites');
    } finally {
      setLoadingFavourites(false);
    }
  };

  const handleCityClick = async (fav) => {
    setSelectedCity(fav);
    try {
      await searchWeather(fav.city);
    } catch (err) {
      // searchWeather throws on failure — surface a friendly error instead of
      // letting the rejection go unhandled.
      showError(err.displayMessage || 'Failed to load weather for this city');
    }
  };

  const handleRemoveFavourite = async (fav) => {
    try {
      await favouritesAPI.remove(fav._id);
      setFavourites((prev) => prev.filter((f) => f._id !== fav._id));
      success(`Removed ${fav.city} from favourites`);
      if (selectedCity?._id === fav._id) { clearWeather(); setSelectedCity(null); }
    } catch (err) {
      showError(err.displayMessage || 'Failed to remove favourite');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-blob2" />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Favourite Cities
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Your saved cities for quick weather access</p>
        </motion.div>

        {loadingFavourites ? (
          <div className="glass-card p-12"><LoadingSpinner size="lg" text="Loading favourites..." /></div>
        ) : favourites.length === 0 ? (
          <div className="glass-card p-12 text-center animate-fade-in">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center"
            >
              <FiStar className="w-12 h-12 text-red-500" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Favourite Cities Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Start adding cities to your favourites from the dashboard.
            </p>
            <Link to="/dashboard">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                className="btn-primary inline-flex items-center gap-2">
                <FiArrowLeft className="w-4 h-4" />
                Go to Dashboard
              </motion.div>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="glass-card p-4 space-y-2 max-h-[600px] overflow-y-auto">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 px-2">
                  Saved Cities ({favourites.length})
                </h2>
                {favourites.map((fav, i) => (
                  <motion.div
                    key={fav._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      selectedCity?._id === fav._id
                        ? 'bg-blue-100 dark:bg-blue-500/20 ring-2 ring-blue-500'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => handleCityClick(fav)}
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{fav.city}</p>
                      {fav.country && <p className="text-xs text-gray-500 dark:text-gray-400">{fav.country}</p>}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemoveFavourite(fav); }}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              {weatherLoading ? (
                <div className="glass-card p-12"><LoadingSpinner size="lg" text="Loading weather data..." /></div>
              ) : weather ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                  <WeatherCard
                    weather={weather}
                    isFavourite={true}
                    onToggleFavourite={() => handleRemoveFavourite(selectedCity)}
                    onRefresh={() => selectedCity && searchWeather(selectedCity.city)}
                  />
                </motion.div>
              ) : (
                <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <FiStar className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Select a City</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Click on a city from the list to view its weather details.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavouritesPage;

