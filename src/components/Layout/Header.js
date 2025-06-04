import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-navy-900 border-b border-gold-500/20 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-navy-900 font-bold text-lg">Ф</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white group-hover:text-gold-400 transition-colors duration-300">
                Факультет
              </h1>
              <p className="text-xs text-gray-400 -mt-1">Веб-сервис</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-medium"
            >
              Главная
            </Link>
            <Link
              to="/recordings"
              className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-medium"
            >
              Записи
            </Link>
            <Link
              to="/categories"
              className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-medium"
            >
              Категории
            </Link>
          </nav>

                    {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-medium"
                >
                  Панель
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                    <span className="text-navy-900 font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-300">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-medium"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 px-4 py-2 rounded-lg transition-all duration-300 font-medium transform hover:scale-105"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-gold-400 transition-colors duration-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-navy-700 py-4 animate-slide-down">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-medium"
              >
                Главная
              </Link>
              <Link
                to="/recordings"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-medium"
              >
                Записи
              </Link>
              <Link
                to="/categories"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-medium"
              >
                Категории
              </Link>
              
              {isAuthenticated ? (
                <div className="flex flex-col space-y-4 pt-4 border-t border-navy-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                      <span className="text-navy-900 font-semibold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-300">{user?.name}</span>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-medium"
                  >
                    Панель управления
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium text-left"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-4 pt-4 border-t border-navy-700">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-300 hover:text-gold-400 transition-colors duration-300 font-medium"
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 px-4 py-2 rounded-lg transition-all duration-300 font-medium text-center"
                  >
                    Регистрация
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
