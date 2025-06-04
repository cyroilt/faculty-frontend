import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  return (
    <motion.header 
      className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/" className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors">
              Faculty Portal
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-white hover:text-yellow-400 transition-colors font-medium"
            >
              Главная
            </Link>
            <Link 
              to="/recordings" 
              className="text-white hover:text-yellow-400 transition-colors font-medium"
            >
              Записи
            </Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <>
                    <Link 
                      to="/create-recording" 
                      className="text-white hover:text-yellow-400 transition-colors font-medium"
                    >
                      Создать запись
                    </Link>
                    <Link 
                      to="/admin" 
                      className="text-white hover:text-yellow-400 transition-colors font-medium"
                    >
                      Админ панель
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-yellow-400 font-medium">
                    Привет, {user?.name}!
                  </span>
                  <motion.button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Выйти
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-white hover:text-yellow-400 transition-colors font-medium"
                >
                  Войти
                </Link>
                <Link 
                  to="/register" 
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className="md:hidden pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/" 
                  className="text-white hover:text-yellow-400 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Главная
                </Link>
                <Link 
                  to="/recordings" 
                  className="text-white hover:text-yellow-400 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Записи
                </Link>
                
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <>
                        <Link 
                          to="/create-recording" 
                          className="text-white hover:text-yellow-400 transition-colors py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Создать запись
                        </Link>
                        <Link 
                          to="/admin" 
                          className="text-white hover:text-yellow-400 transition-colors py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Админ панель
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors py-2 text-left"
                    >
                      Выйти
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="text-white hover:text-yellow-400 transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Войти
                    </Link>
                    <Link 
                      to="/register" 
                      className="text-yellow-400 hover:text-yellow-300 transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Регистрация
                    </Link>
                  </>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
