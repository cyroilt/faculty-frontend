import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Ошибка при загрузке категорий');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.nameRu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center">
        <LoadingSpinner size="large" text="Загрузка категорий..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Категории записей
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Изучайте материалы по различным направлениям и дисциплинам
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск категорий..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-navy-800 border border-navy-600 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors duration-300"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xl">🔍</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              {searchTerm ? 'Категории не найдены' : 'Категории отсутствуют'}
            </h3>
            <p className="text-gray-400">
              {searchTerm 
                ? 'Попробуйте изменить поисковый запрос' 
                : 'Категории будут добавлены позже'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className="group"
              >
                <div className="bg-navy-800 rounded-xl p-6 border border-navy-600 hover:border-gold-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  {/* Category Icon */}
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl mb-4 mx-auto"
                    style={{ 
                      backgroundColor: `${category.color}20`,
                      border: `2px solid ${category.color}40`
                    }}
                  >
                    <span>{category.icon}</span>
                  </div>

                  {/* Category Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors duration-300">
                      {category.nameRu}
                    </h3>
                    
                    {category.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    {/* Recordings Count */}
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <span className="text-gray-500">📹</span>
                      <span className="text-gray-400">
                                                {category.recordingsCount || 0} записей
                      </span>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-gold-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Statistics */}
        {filteredCategories.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-4 bg-navy-800 rounded-lg px-6 py-3 border border-navy-600">
              <span className="text-gray-400">Всего категорий:</span>
              <span className="text-gold-400 font-semibold">{filteredCategories.length}</span>
              <span className="text-gray-600">|</span>
              <span className="text-gray-400">Всего записей:</span>
              <span className="text-gold-400 font-semibold">
                {filteredCategories.reduce((total, cat) => total + (cat.recordingsCount || 0), 0)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;

