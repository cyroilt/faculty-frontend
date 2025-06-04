import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Pagination from '../components/UI/Pagination';

const Recordings = () => {
  const { user } = useAuth();
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    category: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadRecordings();
    loadCategories();
  }, [filters]);

  const loadRecordings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/recordings', { params: filters });
      setRecordings(response.data.recordings);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading recordings:', error);
      setError('Ошибка загрузки записей');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleDelete = async (recordingId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      return;
    }

    try {
      await api.delete(`/api/recordings/${recordingId}`);
      await loadRecordings();
    } catch (error) {
      console.error('Error deleting recording:', error);
      setError('Ошибка удаления записи');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading && recordings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center">
        <LoadingSpinner size="large" text="Загрузка записей..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Записи лекций</h1>
          <p className="text-gray-400">Управление аудио и видео записями</p>
        </div>

        {/* Filters */}
        <div className="bg-navy-800 rounded-xl border border-navy-600 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Поиск
              </label>
              <input
                type="text"
                placeholder="Поиск записей..."
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Категория
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange({ category: e.target.value })}
                className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500"
              >
                <option value="">Все категории</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Сортировка
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500"
              >
                <option value="createdAt">По дате создания</option>
                <option value="title">По названию</option>
                <option value="duration">По длительности</option>
                <option value="size">По размеру</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Порядок
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange({ sortOrder: e.target.value })}
                className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500"
              >
                <option value="desc">По убыванию</option>
                <option value="asc">По возрастанию</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Recordings Grid */}
        {recordings.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              Записи не найдены
            </h3>
            <p className="text-gray-400">
              Попробуйте изменить параметры поиска или загрузите новые записи
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recordings.map((recording) => (
                <div
                  key={recording.id}
                  className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden hover:border-gold-500/50 transition-all duration-300"
                >
                  {/* Recording Thumbnail/Icon */}
                  <div className="bg-navy-700 p-6 text-center">
                    <div className="text-4xl mb-2">
                      {recording.type === 'video' ? '🎥' : '🎵'}
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">
                      {recording.type} • {recording.format}
                    </div>
                  </div>

                  {/* Recording Info */}
                  <div className="p-6">
                    <h3 className="text-white font-semibold mb-2 truncate">
                      {recording.title}
                    </h3>
                    
                    {recording.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {recording.description}
                      </p>
                    )}

                    {/* Recording Details */}
                    <div className="space-y-2 text-xs text-gray-400 mb-4">
                      <div className="flex justify-between">
                        <span>Длительность:</span>
                        <span>{formatDuration(recording.duration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Размер:</span>
                        <span>{recording.sizeFormatted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Создано:</span>
                        <span>{formatDate(recording.createdAt)}</span>
                      </div>
                      {recording.category && (
                        <div className="flex justify-between">
                          <span>Категория:</span>
                          <span className="text-gold-400">{recording.category.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`/api/recordings/${recording.id}/download`, '_blank')}
                        className="flex-1 bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300"
                      >
                        📥 Скачать
                      </button>
                      
                      {(user?.role === 'admin' || recording.userId === user?.id) && (
                        <button
                          onClick={() => handleDelete(recording.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading indicator for pagination */}
            {loading && (
              <div className="flex justify-center py-8">
                <LoadingSpinner text="Загрузка..." />
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  showInfo={true}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recordings;
