import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoriesAPI } from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import RecordingCard from '../components/Recordings/RecordingCard';
import Pagination from '../components/UI/Pagination';

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCategoryData();
  }, [id, currentPage, searchTerm]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getById(id, {
        page: currentPage,
        limit: 12,
        search: searchTerm
      });
      
      setCategory(response.data.category);
      setRecordings(response.data.recordings);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching category:', error);
      setError('Ошибка при загрузке категории');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCategoryData();
  };

  if (loading && !category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center">
        <LoadingSpinner size="large" text="Загрузка категории..." />
      </div>
    );
  }

  if (error && !category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-4">Ошибка загрузки</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            to="/categories"
            className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
          >
            Вернуться к категориям
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-400 hover:text-gold-400 transition-colors">
              Главная
            </Link>
            <span className="text-gray-600">/</span>
            <Link to="/categories" className="text-gray-400 hover:text-gold-400 transition-colors">
              Категории
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gold-400">{category?.nameRu}</span>
          </div>
        </nav>

        {/* Category Header */}
        {category && (
          <div className="bg-navy-800 rounded-xl p-8 border border-navy-600 mb-8">
            <div className="flex items-center space-x-6">
              <div 
                className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl"
                style={{ 
                  backgroundColor: `${category.color}20`,
                  border: `2px solid ${category.color}40`
                }}
              >
                <span>{category.icon}</span>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {category.nameRu}
                </h1>
                {category.description && (
                  <p className="text-gray-400 text-lg mb-4">
                    {category.description}
                  </p>
                )}
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-navy-700 px-3 py-1 rounded-full text-gray-300">
                    📹 {pagination.totalItems || 0} записей
                  </span>
                  <span className="bg-navy-700 px-3 py-1 rounded-full text-gray-300">
                    🏷️ {category.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск записей в категории..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-navy-800 border border-navy-600 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors duration-300"
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
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Загрузка записей..." />
          </div>
        )}

        {/* Recordings Grid */}
        {!loading && recordings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📹</div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              {searchTerm ? 'Записи не найдены' : 'В этой категории пока нет записей'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm 
                ? 'Попробуйте изменить поисковый запрос' 
                : 'Записи будут добавлены позже'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
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

export default CategoryDetail;