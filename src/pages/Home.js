import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RecordingCard from '../components/Recordings/RecordingCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Home = () => {
  const [latestRecordings, setLatestRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRecordings: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalViews: 0
  });

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      try {
        // Mock data for demonstration
        setTimeout(() => {
          setLatestRecordings([
            {
              id: 1,
              title: 'Введение в программирование',
              content: 'Основы программирования для начинающих. Изучаем базовые концепции и принципы разработки программного обеспечения.',
              imageUrl: null,
              videoUrl: '/videos/intro-programming.mp4',
              createdAt: new Date().toISOString(),
              viewsCount: 1250,
              tags: ['программирование', 'основы', 'обучение'],
              category: {
                name: 'Программирование',
                nameRu: 'Программирование',
                color: '#3b82f6',
                icon: '💻'
              },
              user: {
                name: 'Иван Петров'
              }
            },
            {
              id: 2,
              title: 'История факультета',
              content: 'Рассказ об истории создания и развития нашего факультета. Важные вехи и достижения за годы существования.',
              imageUrl: null,
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              viewsCount: 890,
              tags: ['история', 'факультет', 'традиции'],
              category: {
                name: 'История',
                nameRu: 'История',
                color: '#f59e0b',
                icon: '📚'
              },
              user: {
                name: 'Мария Сидорова'
              }
            },
            {
              id: 3,
              title: 'Математический анализ',
              content: 'Лекция по основам математического анализа. Пределы, производные и их применение в решении практических задач.',
              imageUrl: null,
              createdAt: new Date(Date.now() - 172800000).toISOString(),
              viewsCount: 2100,
              tags: ['математика', 'анализ', 'лекция'],
              category: {
                name: 'Математика',
                nameRu: 'Математика',
                color: '#10b981',
                icon: '📐'
              },
              user: {
                name: 'Александр Козлов'
              }
            }
          ]);

          setStats({
            totalRecordings: 156,
            totalCategories: 12,
            totalUsers: 45,
            totalViews: 15420
          });

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center">
        <LoadingSpinner size="large" text="Загрузка данных..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-glow">
              Добро пожаловать
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Современная платформа для хранения и управления записями факультета. 
              Удобный доступ к образовательным материалам и ресурсам.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Начать работу
                  </Link>
                  <Link
                    to="/recordings"
                    className="border-2 border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-navy-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Просмотреть записи
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Панель управления
                  </Link>
                  <Link
                    to="/recordings"
                    className="border-2 border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-navy-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Все записи
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gold-500/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gold-500/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gold-500/8 rounded-full animate-bounce-slow"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-navy-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">
                {stats.totalRecordings}
              </div>
              <div className="text-gray-400 text-lg">Записей</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">
                {stats.totalCategories}
              </div>
              <div className="text-gray-400 text-lg">Категорий</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">
                {stats.totalUsers}
              </div>
              <div className="text-gray-400 text-lg">Пользователей</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">
                {stats.totalViews.toLocaleString()}
              </div>
              <div className="text-gray-400 text-lg">Просмотров</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Recordings */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Последние записи
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Ознакомьтесь с новейшими материалами и записями, добавленными на платформу
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {latestRecordings.map((recording, index) => (
              <div
                key={recording.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <RecordingCard recording={recording} />
              </div>
            ))}
          </div>

          <div className="text-center animate-fade-in">
            <Link
              to="/recordings"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span>Посмотреть все записи</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Faculty History Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-navy-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                История факультета
              </h2>
              <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                Наш факультет имеет богатую историю, начинающуюся с 1965 года. 
                За более чем полвека существования мы подготовили тысячи высококвалифицированных специалистов.
              </p>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Сегодня мы продолжаем традиции качественного образования, 
                внедряя современные технологии и методы обучения.
              </p>
                            <Link
                to="/about"
                className="inline-flex items-center space-x-2 text-gold-400 hover:text-gold-300 font-semibold text-lg transition-colors duration-300 group"
              >
                <span>Узнать больше</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            
            <div className="animate-slide-up">
              <div className="bg-navy-800 rounded-2xl p-8 border border-gold-500/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold-400 mb-2">58</div>
                    <div className="text-gray-400">Лет опыта</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold-400 mb-2">15K+</div>
                    <div className="text-gray-400">Выпускников</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold-400 mb-2">120+</div>
                    <div className="text-gray-400">Преподавателей</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold-400 mb-2">25</div>
                    <div className="text-gray-400">Специальностей</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 rounded-3xl p-12 border border-gold-500/20 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Готовы начать?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к нашему сообществу и получите доступ ко всем материалам и ресурсам факультета
            </p>
            
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Зарегистрироваться бесплатно
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-navy-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Уже есть аккаунт?
                </Link>
              </div>
            ) : (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Перейти в панель управления
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
