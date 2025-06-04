import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            О нашем факультете
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Узнайте больше о нашей истории, миссии и достижениях
          </p>
        </div>

        {/* History Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Наша история</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Наш факультет был основан в 1965 году с целью подготовки высококвалифицированных специалистов 
                в области естественных и точных наук. За более чем полвека существования мы выпустили 
                тысячи успешных профессионалов.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Сегодня мы продолжаем традиции качественного образования, внедряя современные технологии 
                и методики обучения, чтобы наши студенты были готовы к вызовам будущего.
              </p>
            </div>
            <div className="bg-navy-800 rounded-2xl p-8 border border-gold-500/20">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gold-400 mb-2">1965</div>
                  <div className="text-gray-400">Год основания</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gold-400 mb-2">15K+</div>
                  <div className="text-gray-400">Выпускников</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gold-400 mb-2">120+</div>
                  <div className="text-gray-400">Преподавателей</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gold-400 mb-2">25</div>
                  <div className="text-gray-400">Специальностей</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Наша миссия</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-navy-800 rounded-xl p-8 border border-gold-500/20">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold text-white mb-4">Качественное образование</h3>
              <p className="text-gray-400">
                Предоставляем современное образование высочайшего качества, 
                соответствующее международным стандартам
              </p>
            </div>
            <div className="bg-navy-800 rounded-xl p-8 border border-gold-500/20">
              <div className="text-4xl mb-4">🔬</div>
              <h3 className="text-xl font-semibold text-white mb-4">Научные исследования</h3>
              <p className="text-gray-400">
                Ведем передовые исследования в различных областях науки 
                и внедряем инновационные решения
              </p>
            </div>
            <div className="bg-navy-800 rounded-xl p-8 border border-gold-500/20">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold text-white mb-4">Развитие личности</h3>
              <p className="text-gray-400">
                Способствуем всестороннему развитию студентов, 
                формируя лидеров будущего
              </p>
            </div>
          </div>
        </div>

        {/* Departments Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Наши кафедры</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Математика и информатика', icon: '📐', color: '#10b981' },
              { name: 'Физика и астрономия', icon: '⚛️', color: '#8b5cf6' },
              { name: 'Химия и биология', icon: '🧪', color: '#ef4444' },
              { name: 'История и философия', icon: '📚', color: '#f59e0b' },
              { name: 'Литература и языки', icon: '📖', color: '#f97316' },
              { name: 'Экономика и управление', icon: '📊', color: '#06b6d4' }
            ].map((dept, index) => (
              <div key={index} className="bg-navy-800 rounded-lg p-6 border border-navy-700 hover:border-gold-500/50 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${dept.color}20`, color: dept.color }}
                  >
                    {dept.icon}
                  </div>
                  <h3 className="text-white font-semibold">{dept.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 rounded-3xl p-12 border border-gold-500/20">
            <h2 className="text-4xl font-bold text-white mb-6">
              Присоединяйтесь к нам
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Станьте частью нашего академического сообщества и откройте новые возможности для обучения и развития
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              >
                Зарегистрироваться
              </Link>
              <Link
                to="/contact"
                className="border-2 border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-navy-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              >
                Связаться с нами
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;