import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Главная', path: '/' },
    { name: 'Записи', path: '/recordings' },
    { name: 'О факультете', path: '/about' },
  ];

  const adminNavItems = [
    { name: 'Панель управления', path: '/admin' },
    { name: 'Пользователи', path: '/admin/users' },
    { name: 'Категории', path: '/admin/categories' },
  ];

  return (
    <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent"
            >
              Факультет
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-white/80 hover:text-white transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated && (user?.role === 'admin' || user?.role === 'moderator') && (
              <>
                {adminNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-gold-400 hover:text-gold-300 transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200"
                >
                  <UserIcon className="h-6 w-6" />
                  <span className="hidden sm:block">{user?.firstName}</span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-lg shadow-xl border border-white/20 py-2"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>Профиль</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                      >
                        <Cog6ToothIcon className="h-4 w-4" />
                        <span>Настройки</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span>Выйти</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white/80 hover:text-white transition-colors duration-200 font-medium"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="btn-gold"
                >
                  Регистрация
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white/80 hover:text-white transition-colors duration-200"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-white/20"
            >
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-white/80 hover:text-white transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}                  >
                    {item.name}
                  </Link>
                ))}
                
                {isAuthenticated && (user?.role === 'admin' || user?.role === 'moderator') && (
                  <>
                    {adminNavItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="text-gold-400 hover:text-gold-300 transition-colors duration-200 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
