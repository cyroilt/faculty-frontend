import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { recordingAPI, userAPI, categoryAPI } from '../../services/api';
import {
  DocumentTextIcon,
  UsersIcon,
  TagIcon,
  EyeIcon,
  HeartIcon,
  PlusIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRecordings: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalViews: 0,
    totalLikes: 0,
  });
  const [recentRecordings, setRecentRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [recordingsRes, usersRes, categoriesRes, recentRes] = await Promise.all([
        recordingAPI.getStats(),
        userAPI.getStats(),
        categoryAPI.getAll(),
        recordingAPI.getRecent(5),
      ]);

      setStats({
        totalRecordings: recordingsRes.data.total,
        totalUsers: usersRes.data.total,
        totalCategories: categoriesRes.data.length,
        totalViews: recordingsRes.data.totalViews,
        totalLikes: recordingsRes.data.totalLikes,
      });

      setRecentRecordings(recentRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Всего записей',
      value: stats.totalRecordings,
      icon: DocumentTextIcon,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/recordings'
    },
    {
      title: 'Пользователи',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'from-green-500 to-green-600',
      link: '/admin/users'
    },
    {
      title: 'Категории',
      value: stats.totalCategories,
      icon: TagIcon,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/categories'
    },
    {
      title: 'Просмотры',
      value: stats.totalViews,
      icon: EyeIcon,
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: 'Лайки',
      value: stats.totalLikes,
      icon: HeartIcon,
      color: 'from-red-500 to-red-600',
    },
  ];

  const quickActions = [
    {
      title: 'Создать запись',
      description: 'Добавить новую запись',
      icon: PlusIcon,
      link: '/admin/recordings/create',
      color: 'from-gold-500 to-gold-600'
    },
    {
      title: 'Управление записями',
      description: 'Просмотр и редактирование',
      icon: DocumentTextIcon,
      link: '/admin/recordings',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Пользователи',
      description: 'Управление пользователями',
      icon: UsersIcon,
      link: '/admin/users',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Аналитика',
      description: 'Статистика и отчеты',
      icon: ChartBarIcon,
      link: '/admin/analytics',
      color: 'from-purple-500 to-purple-600'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="card animate-pulse">
                <div className="h-16 bg-white/10 rounded mb-4"></div>
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-6 bg-white/10 rounded w-1/2"></div>
              </div>
            ))}
          </div>
                </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Панель администратора
          </h1>
          <p className="text-white/70">
            Добро пожаловать, {user?.firstName} {user?.lastName}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="card group cursor-pointer"
              onClick={() => stat.link && (window.location.href = stat.link)}>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white/80 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-white">
                {stat.value.toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-6">Быстрые действия</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={action.title}
                    to={action.link}
                    className="group p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">{action.title}</h3>
                    <p className="text-white/60 text-sm">{action.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Recordings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Последние записи</h2>
                <Link
                  to="/admin/recordings"
                  className="text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors duration-200"
                >
                  Посмотреть все →
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentRecordings.map((recording) => (
                  <Link
                    key={recording._id}
                    to={`/recordings/${recording._id}`}
                    className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200 group"
                  >
                    <div className="flex items-start space-x-3">
                      {recording.images?.length > 0 && (
                        <img
                          src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${recording.images[0].url}`}
                          alt={recording.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium group-hover:text-gold-400 transition-colors duration-200 truncate">
                          {recording.title}
                        </h3>
                        <p className="text-white/60 text-sm mt-1 line-clamp-2">
                          {recording.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-white/50">
                          <span className="flex items-center">
                            <EyeIcon className="h-3 w-3 mr-1" />
                            {recording.views || 0}
                          </span>
                          <span className="flex items-center">
                            <HeartIcon className="h-3 w-3 mr-1" />
                            {recording.likes?.length || 0}
                          </span>
                          <span>
                            {new Date(recording.createdAt).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {recentRecordings.length === 0 && (
                  <div className="text-center py-8">
                    <DocumentTextIcon className="h-12 w-12 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">Нет записей</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6">Состояние системы</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                <p className="text-white/80 font-medium">Сервер</p>
                <p className="text-white/60 text-sm">Работает нормально</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                <p className="text-white/80 font-medium">База данных</p>
                <p className="text-white/60 text-sm">Подключена</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                <p className="text-white/80 font-medium">Файловое хранилище</p>
                <p className="text-white/60 text-sm">Доступно</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;

        
        