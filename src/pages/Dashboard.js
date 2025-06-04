import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import RecordingCard from '../components/Recordings/RecordingCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myRecordings: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  });
  const [recentRecordings, setRecentRecordings] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data for dashboard
      setTimeout(() => {
        setStats({
          myRecordings: 12,
          totalViews: 3450,
          totalLikes: 89,
          totalComments: 156
        });

        setRecentRecordings([
          {
            id: 1,
            title: 'Мои заметки по программированию',
            content: 'Личные заметки и примеры кода для изучения программирования',
            createdAt: new Date().toISOString(),
            viewsCount: 245,
            tags: ['программирование', 'заметки'],
            category: {
              name: 'Программирование',
              nameRu: 'Программирование',
              color: '#3b82f6',
              icon: '💻'
            },
            user: {
              name: user?.name || 'Вы'
            }
          },
          {
            id: 2,
            title: 'Решение задач по математике',
            content: 'Подробные решения сложных математических задач',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            viewsCount: 189,
            tags: ['математика', 'решения'],
            category: {
              name: 'Математика',
              nameRu: 'Математика',
              color: '#10b981',
              icon: '📐'
            },
            user: {
              name: user?.name || 'Вы'
            }
          }
        ]);

        setRecentActivity([
          {
            id: 1,
            type: 'view',
            message: 'Ваша запись "Мои заметки по программированию" была просмотрена 15 раз',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            icon: '👁️'
          },
          {
            id: 2,
            type: 'like',
            message: 'Пользователь Иван Петров оценил вашу запись',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            icon: '❤️'
          },
          {
            id: 3,
            type: 'comment',
            message: 'Новый комментарий к записи "Решение задач по математике"',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            icon: '💬'
          },
          {
            id: 4,
            type: 'upload',
            message: 'Вы успешно загрузили новую запись',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            icon: '📤'
          }
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Только что';
    if (diffInHours < 24) return `${diffInHours} ч. назад`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} дн. назад`;
    return time.toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center">
        <LoadingSpinner size="large" text="Загрузка панели управления..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Добро пожаловать, {user?.name || 'Пользователь'}!
          </h1>
          <p className="text-gray-400 text-lg">
            Управляйте своими записями и отслеживайте активность
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-navy-800 rounded-xl p-6 border border-gold-500/20 hover:border-gold-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Мои записи</p>
                <p className="text-3xl font-bold text-white">{stats.myRecordings}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-400">+2</span>
              <span className="text-gray-400 ml-1">за последний месяц</span>
            </div>
          </div>

          <div className="bg-navy-800 rounded-xl p-6 border border-gold-500/20 hover:border-gold-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Просмотры</p>
                <p className="text-3xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👁️</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-400">+15%</span>
              <span className="text-gray-400 ml-1">за последнюю неделю</span>
            </div>
          </div>

          <div className="bg-navy-800 rounded-xl p-6 border border-gold-500/20 hover:border-gold-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Лайки</p>
                <p className="text-3xl font-bold text-white">{stats.totalLikes}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">❤️</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-400">+8</span>
              <span className="text-gray-400 ml-1">за последний день</span>
            </div>
          </div>

          <div className="bg-navy-800 rounded-xl p-6 border border-gold-500/20 hover:border-gold-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Комментарии</p>
                <p className="text-3xl font-bold text-white">{stats.totalComments}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-400">+12</span>
              <span className="text-gray-400 ml-1">за последнюю неделю</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-navy-800 rounded-xl p-6 border border-gold-500/20 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/upload"
              className="flex items-center space-x-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 p-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <span className="text-2xl">📤</span>
              <span>Загрузить запись</span>
            </Link>
            
            <Link
              to="/my-recordings"
              className="flex items-center space-x-3 bg-navy-700 hover:bg-navy-600 text-white p-4 rounded-lg font-semibold transition-all duration-300 border border-navy-600 hover:border-gold-500"
            >
              <span className="text-2xl">📋</span>
              <span>Мои записи</span>
            </Link>
            
            <Link
              to="/analytics"
              className="flex items-center space-x-3 bg-navy-700 hover:bg-navy-600 text-white p-4 rounded-lg font-semibold transition-all duration-300 border border-navy-600 hover:border-gold-500"
            >
              <span className="text-2xl">📊</span>
              <span>Аналитика</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Recordings */}
          <div className="bg-navy-800 rounded-xl p-6 border border-gold-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Мои последние записи</h2>
              <Link
                to="/my-recordings"
                className="text-gold-400 hover:text-gold-300 font-medium transition-colors duration-300"
              >
                Все записи →
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentRecordings.length > 0 ? (
                recentRecordings.map(recording => (
                  <div key={recording.id} className="bg-navy-700 rounded-lg p-4 hover:bg-navy-600 transition-colors duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">{recording.title}</h3>
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">{recording.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>👁️ {recording.viewsCount}</span>
                          <span>{formatTimeAgo(recording.createdAt)}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: recording.category.color }}
                        ></span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-gray-400 mb-4">У вас пока нет записей</p>
                  <Link
                    to="/upload"
                    className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                  >
                    Создать первую запись
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-navy-800 rounded-xl p-6 border border-gold-500/20">
            <h2 className="text-2xl font-semibold text-white mb-6">Последняя активность</h2>
            
            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-navy-700 rounded-lg hover:bg-navy-600 transition-colors duration-300">
                  <div className="flex-shrink-0 w-8 h-8 bg-navy-600 rounded-full flex items-center justify-center">
                    <span className="text-sm">{activity.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-gray-400 text-xs mt-1">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
                        <div className="mt-6 text-center">
              <Link
                to="/activity"
                className="text-gold-400 hover:text-gold-300 font-medium transition-colors duration-300"
              >
                Показать всю активность →
              </Link>
            </div>
          </div>
        </div>

        {/* Popular Categories Chart */}
        <div className="mt-8 bg-navy-800 rounded-xl p-6 border border-gold-500/20">
          <h2 className="text-2xl font-semibold text-white mb-6">Популярные категории</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Программирование', count: 45, color: '#3b82f6', icon: '💻' },
              { name: 'Математика', count: 38, color: '#10b981', icon: '📐' },
              { name: 'История', count: 32, color: '#f59e0b', icon: '📚' },
              { name: 'Физика', count: 28, color: '#8b5cf6', icon: '⚛️' }
            ].map((category, index) => (
              <div key={index} className="bg-navy-700 rounded-lg p-4 hover:bg-navy-600 transition-colors duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="text-white font-medium">{category.name}</h3>
                    <p className="text-gray-400 text-sm">{category.count} записей</p>
                  </div>
                </div>
                <div className="w-full bg-navy-600 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(category.count / 45) * 100}%`,
                      backgroundColor: category.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-gold-500/10 to-gold-600/10 rounded-xl p-6 border border-gold-500/20">
          <h2 className="text-2xl font-semibold text-white mb-4">💡 Советы для улучшения контента</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-navy-900 text-xs font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">Используйте описательные заголовки</h3>
                  <p className="text-gray-400 text-sm">Четкие заголовки помогают пользователям найти ваш контент</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-navy-900 text-xs font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">Добавляйте теги</h3>
                  <p className="text-gray-400 text-sm">Теги улучшают поиск и категоризацию материалов</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-navy-900 text-xs font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">Регулярно обновляйте контент</h3>
                  <p className="text-gray-400 text-sm">Активность привлекает больше просмотров</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-navy-900 text-xs font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">Отвечайте на комментарии</h3>
                  <p className="text-gray-400 text-sm">Взаимодействие с аудиторией повышает вовлеченность</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
