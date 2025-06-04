import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-white/5 backdrop-blur-lg border-t border-white/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-bold text-gold-400 mb-4">О факультете</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Наш факультет - ведущее образовательное учреждение, 
              предоставляющее качественное образование и развивающее 
              научную деятельность в различных областях знаний.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-gold-400 mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-white/70 hover:text-white transition-colors duration-200">
                  Главная страница
                </a>
              </li>
              <li>
                <a href="/recordings" className="text-white/70 hover:text-white transition-colors duration-200">
                  Все записи
                </a>
              </li>
              <li>
                <a href="/about" className="text-white/70 hover:text-white transition-colors duration-200">
                  О нас
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white/70 hover:text-white transition-colors duration-200">
                  Контакты
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-gold-400 mb-4">Контакты</h3>
            <div className="space-y-2 text-sm text-white/70">
              <p>Email: info@faculty.edu</p>
              <p>Телефон: +7 (XXX) XXX-XX-XX</p>
              <p>Адрес: г. Москва, ул. Примерная, д. 1</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="border-t border-white/20 mt-8 pt-8 text-center"
        >
          <p className="text-white/60 text-sm">
            © 2024 Факультет. Все права защищены.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;