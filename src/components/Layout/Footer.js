import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-8 mt-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Faculty Portal</h3>
            <p className="text-gray-300">
              Портал факультета для управления записями и информацией о деятельности.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-yellow-400 mb-4">Быстрые ссылки</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Главная
                </a>
              </li>
              <li>
                <a href="/recordings" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  Все записи
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-yellow-400 mb-4">Контакты</h4>
            <p className="text-gray-300">
              Email: info@faculty.edu<br />
              Телефон: +7 (xxx) xxx-xx-xx
            </p>
          </div>
        </div>
        
        <div className="border-t border-blue-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Faculty Portal. Все права защищены.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
