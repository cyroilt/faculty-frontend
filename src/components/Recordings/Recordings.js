import React, { useState, useEffect } from 'react';
import { recordingsAPI, categoriesAPI } from '../services/api';
import RecordingCard from '../components/Recordings/RecordingCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Pagination from '../components/UI/Pagination';

const Recordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchRecordings();
  }, [currentPage, selectedCategory, sortBy, searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      const response = await recordingsAPI.getAll({
        page: currentPage,
        limit: 12,
        search: searchTerm,
        category: selectedCategory,
        sortBy: sortBy
      });
      
      setRecordings(response.data.recordings);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching recordings:', error);
      setError('Ошибка при загрузке записей');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRecordings();
  };

  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    
    switch (filterType) {
      case 'category':
        setSelectedCategory(value);
        break;
      case 'sort':
        setSortBy(value);
        break;
      default:
        break;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Все записи
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Изучайте материалы от преподавателей и студентов
          </p>
        </div>

        {/* Filters */}
        <div className="bg-navy-800 rounded-xl p-6 border border-navy-600 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск записей..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors duration-300"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-xl">🔍</span>
                </div>
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gold-400 hover:text-gold-300 transition-colors"
                >
                  Найти
                </button>
              </div>
            </form>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors duration-300"
            >
              <option value="">Все категории</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nameRu}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors duration-300"
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="popular">Популярные</option>
              <option value="title">По названию</option>
            </select>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCategory || sortBy !== 'newest') && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400">Активные фильтры:</span>
                {searchTerm && (
                  <span className="px-2 py-1 bg-gold-500/20 text-gold-400 rounded">
                    Поиск: "{searchTerm}"
                  </span>
                )}
                {selectedCategory && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                    {categories.find(c => c.id.toString() === selectedCategory)?.nameRu}
                  </span>
                )}
                {sortBy !== 'newest' && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                    {sortBy === 'oldest' && 'Сначала старые'}
                    {sortBy === 'popular' && 'Популярные'}
                    {sortBy === 'title' && 'По названию'}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Очистить фильтры
              </button>
            </div>
          )}
        </div>

        {/* Results Info */}
        {!loading && (
          <div className="mb-6">
            <p className="text-gray-400">
              {pagination.totalItems > 0 
                                ? `Найдено ${pagination.totalItems} записей`
                : 'Записи не найдены'
              }
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="Загрузка записей..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Ошибка загрузки</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={fetchRecordings}
              className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {/* Recordings Grid */}
        {!loading && !error && recordings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📹</div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              {searchTerm || selectedCategory ? 'Записи не найдены' : 'Записи отсутствуют'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || selectedCategory 
                ? 'Попробуйте изменить параметры поиска' 
                : 'Записи будут добавлены позже'
              }
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Показать все записи
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {recordings.map((recording) => (
                <RecordingCard key={recording.id} recording={recording} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Recordings;

