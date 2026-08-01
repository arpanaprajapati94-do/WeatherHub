import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiLock, FiClock, FiHeart, FiSearch, FiTrash2, FiAlertTriangle, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { historyAPI, favouritesAPI, authAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { success, error: showError } = useToast();

  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ favourites: 0, searches: 0 });
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) setProfileData({ name: user.name || '', email: user.email || '' });
    loadStats();
    loadHistory();
  }, [user]);

  const loadStats = async () => {
    try {
      const [favRes, histRes] = await Promise.all([favouritesAPI.getAll(), historyAPI.getAll()]);
      setStats({
        favourites: favRes.data.count ?? favRes.data.data?.length ?? 0,
        searches: histRes.data.count ?? histRes.data.data?.length ?? 0,
      });
    } catch (err) { console.error('Failed to load stats:', err); }
  };

  const loadHistory = async () => {
    try {
      const res = await historyAPI.getAll();
      setHistory(res.data.data || []);
    } catch (err) { console.error('Failed to load history:', err); }
    finally { setLoadingHistory(false); }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) { showError('Name is required'); return; }
    setLoading(true);
    try {
      await updateProfile({ name: profileData.name });
      success('Profile updated successfully');
    } catch (err) { showError(err.displayMessage || 'Failed to update profile'); }
    finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) { showError('New passwords do not match'); return; }
    if (passwordData.newPassword.length < 6) { showError('New password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { showError(err.displayMessage || 'Failed to change password'); }
    finally { setLoading(false); }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all search history?')) return;
    try {
      await historyAPI.clear();
      setHistory([]);
      setStats((prev) => ({ ...prev, searches: 0 }));
      success('Search history cleared');
    } catch (err) { showError('Failed to clear history'); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeleting(true);
    try {
      await authAPI.deleteAccount();
      success('Account deleted successfully');
      setTimeout(() => { logout(); window.location.href = '/'; }, 1500);
    } catch (err) { showError(err.displayMessage || 'Failed to delete account'); }
    finally { setDeleting(false); setShowDeleteModal(false); setDeleteConfirmText(''); }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'password', label: 'Password', icon: FiLock },
    { id: 'history', label: 'History', icon: FiClock },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatHistoryDate = (entry) => {
    const raw = entry?.timestamp || entry?.createdAt || entry?.date;
    if (!raw) return 'N/A';
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString();
  };

  const memberSince = user?.createdAt ? formatDate(user.createdAt) : user?.date ? formatDate(user.date) : 'N/A';

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-blob2" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600
              flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-500/20
              ring-4 ring-blue-500/20 dark:ring-blue-400/20"
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{user?.name || 'User'}</h1>
          <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">
            <FiShield className="w-3.5 h-3.5" />
            Verified Account
          </span>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-5 text-center hover:shadow-lg hover:shadow-blue-500/10 transition-shadow">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FiHeart className="w-5 h-5 text-red-500 fill-current" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Favourite Cities</span>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              {stats.favourites}
            </p>
            <div className="mt-3 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.favourites / 10) * 100, 100)}%` }} />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="glass-card p-5 text-center hover:shadow-lg hover:shadow-blue-500/10 transition-shadow">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FiSearch className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Weather Searches</span>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              {stats.searches}
            </p>
            <div className="mt-3 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.searches / 50) * 100, 100)}%` }} />
            </div>
          </motion.div>
        </div>

        {/* Account Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <FiUser className="w-5 h-5 text-blue-500" />
            Account Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: FiClock, label: 'Member Since', value: memberSince, color: 'text-blue-500' },
              { icon: FiShield, label: 'Email Verified', value: 'Yes', color: 'text-green-500' },
              { icon: FiUser, label: 'Account Type', value: 'Free', color: 'text-purple-500' },
              { icon: FiClock, label: 'Last Login', value: user?.lastLogin ? formatDate(user.lastLogin) : 'Today', color: 'text-amber-500' },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{item.label}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card overflow-hidden mb-8">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all
                  ${activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-500/5'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.form key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleProfileUpdate} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input type="text" value={profileData.name} onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                      className="input" disabled={loading} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input type="email" value={profileData.email} disabled className="input bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary" disabled={loading}>
                      {loading ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</span> : 'Update Profile'}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => setShowDeleteModal(true)} className="btn-danger">
                      Delete Account
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {activeTab === 'password' && (
                <motion.form key="password" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                    <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                      className="input" disabled={loading} required placeholder="Enter current password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                    <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                      className="input" disabled={loading} required minLength={6} placeholder="At least 6 characters" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                    <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      className="input" disabled={loading} required placeholder="Re-enter new password" />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Changing...</span> : 'Change Password'}
                  </motion.button>
                </motion.form>
              )}

              {activeTab === 'history' && (
                <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Search History</h3>
                    {history.length > 0 && (
                      <button onClick={handleClearHistory}
                        className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1">
                        <FiTrash2 className="w-4 h-4" />
                        Clear All
                      </button>
                    )}
                  </div>

                  {loadingHistory ? (
                    <div className="py-12"><LoadingSpinner size="lg" text="Loading history..." /></div>
                  ) : history.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <FiClock className="w-8 h-8 text-blue-500" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">No search history yet</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Search for a city on the dashboard to see your history here</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {history.map((entry) => (
                        <div key={entry._id}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-center gap-3">
                            {entry.weatherIcon && (
                              <img src={`https://openweathermap.org/img/wn/${entry.weatherIcon}.png`}
                                alt={entry.weatherDescription || 'weather icon'} className="w-8 h-8" />
                            )}
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {entry.city}{entry.country ? `, ${entry.country}` : ''}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {entry.temperature ? `${entry.temperature}°C` : ''}{entry.weatherDescription ? ` - ${entry.weatherDescription}` : ''}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {formatHistoryDate(entry)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <FiAlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete Account</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                </div>
              </div>
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <span className="font-semibold">Warning:</span> Deleting your account will permanently remove all your data including favourites and search history.
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type <span className="font-bold text-red-500">DELETE</span> to confirm
                </label>
                <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="input" placeholder="Type DELETE to confirm" autoFocus />
              </div>
              <div className="flex items-center gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="button" onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
                  className="btn-secondary flex-1" disabled={deleting}>
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="button" onClick={handleDeleteAccount} className="btn-danger flex-1"
                  disabled={deleteConfirmText !== 'DELETE' || deleting}>
                  {deleting ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting...</span> : 'Delete Account'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;

