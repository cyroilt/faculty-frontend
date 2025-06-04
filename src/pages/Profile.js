import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { recordingsAPI, authAPI } from '../services/api';
import RecordingCard from '../components/Recordings/RecordingCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Pagination from '../components/UI/Pagination';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('recordings');
  const [recordings, setRecordings] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    totalRecordings: 0,
    totalViews: 0,
    totalLikes: 0,
    pendingRecordings: 0
  });

  // Profile edit state
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  useEffect(() => {
    if (activeTab === 'recordings') {
      fetchUserRecordings();
    }
  }, [activeTab, currentPage]);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserRecordings = async () => {
    try {
      setLoading(true);
      const response = await recordingsAPI.getUserRecordings({
        page: currentPage,
        limit: 12
      });
      
      setRecordings(response.data.recordings);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching user recordings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await authAPI.getProfile();
      setStats({
        totalRecordings: response.data.recordingsCount || 0,
        totalViews: response.data.totalViews || 0,
        totalLikes: response.data.totalLikes || 0,
        pendingRecordings: response.data.pendingRecordings || 0
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.updateProfile(profileData);
      updateUser(response.data.user);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Ошибка при обновлении профиля');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const tabs = [
    { id: 'recordings', name: 'Мои записи', icon: '📹' },
    { id: 'profile', name: 'Профиль', icon: '👤' },
    { id: 'settings', name: 'Настройки', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-navy-800 rounded-xl border border-navy-600 p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-navy-700 rounded-full flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl">👤</span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user?.name || 'Пользователь'}
              </h1>
              <p className="text-gray-400 mb-4">
                {user?.email}
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold-400">{stats.totalRecordings}</div>
                  <div className="text-gray-400">Записей</div>
                </div>
                <div className="text-center">
                                    <div className="text-2xl font-bold text-gold-400">{stats.totalViews}</div>
                  <div className="text-gray-400">Просмотров</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold-400">{stats.totalLikes}</div>
                  <div className="text-gray-400">Лайков</div>
                </div>
                {stats.pendingRecordings > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{stats.pendingRecordings}</div>
                    <div className="text-gray-400">На модерации</div>
                  </div>
                )}
              </div>
            </div>
            <Link
              to="/upload"
              className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg transition-colors duration-300 flex items-center space-x-2"
            >
              <span>📤</span>
              <span>Загрузить запись</span>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-navy-800 rounded-xl border border-navy-600 mb-8">
          <div className="flex border-b border-navy-600">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-center transition-colors duration-300 ${
                  activeTab === tab.id
                    ? 'text-gold-400 border-b-2 border-gold-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* Recordings Tab */}
            {activeTab === 'recordings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Мои записи</h2>
                  <div className="text-gray-400">
                    {pagination.totalItems > 0 && `${pagination.totalItems} записей`}
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size="large" text="Загрузка записей..." />
                  </div>
                ) : recordings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📹</div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      У вас пока нет записей
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Загрузите свою первую запись и поделитесь знаниями с сообществом
                    </p>
                    <Link
                      to="/upload"
                      className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg transition-colors duration-300 inline-flex items-center space-x-2"
                    >
                      <span>📤</span>
                      <span>Загрузить запись</span>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                      {recordings.map((recording) => (
                        <RecordingCard key={recording.id} recording={recording} showStatus />
                      ))}
                    </div>

                    {pagination.totalPages > 1 && (
                      <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Профиль</h2>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    {editMode ? 'Отмена' : 'Редактировать'}
                  </button>
                </div>

                {editMode ? (
                  <form onSubmit={handleProfileUpdate} className="max-w-2xl space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Имя
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        О себе
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                        className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors duration-300 resize-vertical"
                        placeholder="Расскажите о себе..."
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        type="submit"
                        className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
                      >
                        Сохранить изменения
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="max-w-2xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-navy-700 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Имя</h4>
                        <p className="text-gray-300">{user?.name || 'Не указано'}</p>
                      </div>
                      <div className="p-4 bg-navy-700 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Email</h4>
                        <p className="text-gray-300">{user?.email}</p>
                      </div>
                      <div className="p-4 bg-navy-700 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Роль</h4>
                        <p className="text-gray-300">
                          {user?.role === 'admin' && 'Администратор'}
                          {user?.role === 'moderator' && 'Модератор'}
                          {user?.role === 'user' && 'Пользователь'}
                        </p>
                      </div>
                      <div className="p-4 bg-navy-700 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Дата регистрации</h4>
                        <p className="text-gray-300">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Неизвестно'}
                        </p>
                      </div>
                    </div>
                    
                    {user?.bio && (
                      <div className="p-4 bg-navy-700 rounded-lg">
                        <h4 className="text-white font-medium mb-2">О себе</h4>
                        <p className="text-gray-300 whitespace-pre-wrap">{user.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Настройки</h2>
                
                <div className="max-w-2xl space-y-6">
                  {/* Change Password */}
                  <div className="p-6 bg-navy-700 rounded-lg">
                    <h3 className="text-white font-semibold mb-4">Изменить пароль</h3>
                    <ChangePasswordForm />
                  </div>

                  {/* Account Actions */}
                  <div className="p-6 bg-navy-700 rounded-lg">
                    <h3 className="text-white font-semibold mb-4">Действия с аккаунтом</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left px-4 py-3 bg-navy-600 hover:bg-navy-500 text-white rounded-lg transition-colors duration-300">
                        📧 Изменить email
                      </button>
                      <button className="w-full text-left px-4 py-3 bg-navy-600 hover:bg-navy-500 text-white rounded-lg transition-colors duration-300">
                        🔔 Настройки уведомлений
                      </button>
                      <button className="w-full text-left px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300">
                        🗑️ Удалить аккаунт
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Change Password Component
const ChangePasswordForm = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка при изменении пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="password"
          placeholder="Текущий пароль"
          value={passwordData.currentPassword}
          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
          className="w-full bg-navy-600 border border-navy-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors duration-300"
          required
        />
      </div>
      
      <div>
        <input
          type="password"
          placeholder="Новый пароль"
          value={passwordData.newPassword}
          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
          className="w-full bg-navy-600 border border-navy-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors duration-300"
          required
        />
      </div>
      
      <div>
        <input
          type="password"
          placeholder="Подтвердите новый пароль"
          value={passwordData.confirmPassword}
          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          className="w-full bg-navy-600 border border-navy-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors duration-300"
          required
        />
      </div>

      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}

      {success && (
        <div className="text-green-400 text-sm">Пароль успешно изменен</div>
      )}

      <button
        type="submit"
        disabled={loading}
                className="bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
      >
        {loading ? (
          <>
            <LoadingSpinner size="small" />
            <span>Изменение...</span>
          </>
        ) : (
          <span>Изменить пароль</span>
        )}
      </button>
    </form>
  );
};

export default Profile;

