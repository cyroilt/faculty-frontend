import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRecordings } from '../context/RecordingContext';
import RecordingCard from '../components/RecordingCard';

const HomePage = () => {
  const { recordings, loading } = useRecordings();
  const [latestRecordings, setLatestRecordings] = useState([]);

  useEffect(() => {
    // Get latest 3 recordings
    const latest = recordings.slice(0, 3);
    setLatestRecordings(latest);
  }, [recordings]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Добро пожаловать в Faculty Portal
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-gray-200"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Центр управления записями и деятельностью факультета
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <a 
              href="/recordings" 
              className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Просмотреть все записи
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Faculty History Section */}
      <motion.section 
        className="py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            variants={itemVariants}
          >
            <h2 className="text-4xl font-bold text-blue-900 mb-8">История факультета</h2>
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <motion.p 
                className="text-lg text-gray-700 leading-relaxed mb-6"
                variants={itemVariants}
              >
                Наш факультет имеет богатую историю, насчитывающую более 50 лет. 
                Основанный в 1970 году, он стал одним из ведущих образовательных 
                учреждений в регионе, готовящим высококвалифицированных специалистов.
              </motion.p>
              <motion.p 
                className="text-lg text-gray-700 leading-relaxed mb-6"
                variants={itemVariants}
              >
                За годы своего существования факультет выпустил тысячи специалистов, 
                многие из которых стали признанными лидерами в своих областях. 
                Мы гордимся нашими традициями и продолжаем развиваться, 
                внедряя современные методы обучения и исследований.
              </motion.p>
              <motion.p 
                className="text-lg text-gray-700 leading-relaxed"
                variants={itemVariants}
              >
                Сегодня факультет активно участвует в научной деятельности, 
                поддерживает спортивные инициативы и развивает международное 
                сотрудничество, оставаясь верным своей миссии подготовки 
                профессионалов высочайшего уровня.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Latest Recordings Section */}
      <motion.section 
        className="py-16 bg-gradient-to-r from-blue-900 to-blue-800"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center text-yellow-400 mb-12"
            variants={itemVariants}
          >
            Последние записи
          </motion.h2>
          
          {loading ? (
            <div className="flex justify-center">
              <motion.div 
                className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
            >
              {latestRecordings.map((recording, index) => (
                <motion.div
                  key={recording._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <RecordingCard recording={recording} />
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {!loading && latestRecordings.length === 0 && (
            <motion.div 
              className="text-center text-gray-300"
              variants={itemVariants}
            >
              <p className="text-xl">Пока нет записей для отображения</p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section 
        className="py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center text-blue-900 mb-12"
            variants={itemVariants}
          >
            Наши достижения
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '50+', label: 'Лет истории', icon: '🏛️' },
              { number: '1000+', label: 'Выпускников', icon: '🎓' },
              { number: '100+', label: 'Преподавателей', icon: '👨‍🏫' },
              { number: '50+', label: 'Научных проектов', icon: '🔬' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-8 text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold text-blue-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;