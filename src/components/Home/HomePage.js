import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { recordingAPI } from '../../services/api';
import RecordingCard from '../Recordings/RecordingCard';
import {
  AcademicCapIcon,
  BeakerIcon,
  BuildingOfficeIcon,
  UsersIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const [latestRecordings, setLatestRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestRecordings();
  }, []);

  const fetchLatestRecordings = async () => {
    try {
      const response = await recordingAPI.getLatest();
      setLatestRecordings(response.data);
    } catch (error) {
      console.error('Error fetching latest recordings:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      name: 'Учебная деятельность',
      icon: AcademicCapIcon,
      color: 'from-blue-500 to-blue-600',
      description: 'Образовательные программы и учебные материалы'
    },
    {
      name: 'Научная деятельность',
      icon: BeakerIcon,
      color: 'from-purple-500 to-purple-600',
      description: 'Исследования и научные публикации'
    },
    {
      name: 'Служебная деятельность',
      icon: BuildingOfficeIcon,
      color: 'from-red-500 to-red-600',
      description: 'Административная работа и управление'
    },
    {
      name: 'Работа с личным составом',
      icon: UsersIcon,
      color: 'from-green-500 to-green-600',
      description: 'Кадровая политика и развитие персонала'
    },
    {
      name: 'Спортивная деятельность',
      icon: TrophyIcon,
      color: 'from-orange-500 to-orange-600',
      description: 'Спортивные мероприятия и достижения'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Добро пожаловать на
              <span className="block bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                Факультет
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Центр образования, науки и инноваций. Мы создаем будущее через качественное 
              образование, передовые исследования и развитие талантов.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/recordings" className="btn-primary text-lg px-8 py-3">
                Просмотреть записи
              </Link>
              <Link to="/about" className="btn-gold text-lg px-8 py-3">
                О факультете
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Faculty History Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">История факультета</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-white/80 text-lg leading-relaxed mb-6">
                  Наш факультет был основан в 1950 году и с тех пор является одним из ведущих 
                  образовательных учреждений страны. За более чем 70 лет работы мы подготовили 
                  тысячи высококвалифицированных специалистов.
                </p>
                <p className="text-white/80 text-lg leading-relaxed">
                  Сегодня факультет продолжает традиции качественного образования, внедряя 
                  современные технологии и методики обучения, развивая научную деятельность 
                  и поддерживая инновационные проекты.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-3xl font-bold text-gold-400 mb-2">70+</div>
                  <div className="text-white/70">Лет опыта</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-3xl font-bold text-gold-400 mb-2">5000+</div>
                  <div className="text-white/70">Выпускников</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-3xl font-bold text-gold-400 mb-2">50+</div>
                  <div className="text-white/70">Преподавателей</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-3xl font-bold text-gold-400 mb-2">15</div>
                  <div className="text-white/70">Кафедр</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Направления деятельности</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto mb-6"></div>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Наш факультет ведет активную работу по различным направлениям
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="card group cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <category.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{category.name}</h3>
                <p className="text-white/70 leading-relaxed">{category.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Recordings Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Последние записи</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold-400 to-gold-600 mx-auto mb-6"></div>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Ознакомьтесь с последними событиями и достижениями нашего факультета
            </p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="h-48 bg-white/10 rounded-lg mb-4"></div>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestRecordings.map((recording, index) => (
                  <motion.div
                    key={recording._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <RecordingCard recording={recording} />
                  </motion.div>
                ))}
              </div>
              
              {latestRecordings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-center mt-12"
                >
                  <Link to="/recordings" className="btn-primary text-lg px-8 py-3">
                    Посмотреть все записи
                  </Link>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Присоединяйтесь к нашему сообществу
            </h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Станьте частью нашего академического сообщества. Получите доступ к 
              образовательным ресурсам, участвуйте в научных проектах и развивайте 
              свои профессиональные навыки.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-gold text-lg px-8 py-3">
                Зарегистрироваться
              </Link>
              <Link to="/contact" className="btn-primary text-lg px-8 py-3">
                Связаться с нами
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
