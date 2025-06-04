import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { recordingsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const RecordingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchRecording();
  }, [id]);

  const fetchRecording = async () => {
    try {
      setLoading(true);
      const response = await recordingsAPI.getById(id);
      setRecording(response.data);
    } catch (error) {
      console.error('Error fetching recording:', error);
      if (error.response?.status === 404) {
        setError('Запись не найдена');
      } else if (error.response?.status === 403) {
        setError('У вас нет доступа к этой записи');
      } else {
        setError('Ошибка при загрузке записи');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!recording.filePath) return;
    
    try {
      setDownloading(true);
      const response = await recordingsAPI.download(id);
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', recording.fileName || `recording-${id}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Ошибка при скачивании файла');
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) return;
    
    try {
      await recordingsAPI.delete(id);
      navigate('/profile');
    } catch (error) {
      console.error('Error deleting recording:', error);
      alert('Ошибка при удалении записи');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileTypeIcon = (mimeType) => {
    if (!mimeType) return '📄';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📕';
    if (mimeType.includes('word')) return '📘';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📊';
    return '📄';
  };

  const canEdit = user && (user.id === recording?.userId || user.role === 'admin' || user.role === 'moderator');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center">
        <LoadingSpinner size="large" text="Загрузка записи..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-4">Ошибка</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            to="/recordings"
            className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
          >
            Вернуться к записям
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-400 hover:text-gold-400 transition-colors">
              Главная
            </Link>
            <span className="text-gray-600">/</span>
            <Link to="/recordings" className="text-gray-400 hover:text-gold-400 transition-colors">
              Записи
            </Link>
            {recording?.category && (
              <>
                <span className="text-gray-600">/</span>
                <Link 
                  to={`/categories/${recording.category.id}`}
                  className="text-gray-400 hover:text-gold-400 transition-colors"
                >
                  {recording.category.nameRu}
                </Link>
              </>
            )}
            <span className="text-gray-600">/</span>
            <span className="text-gold-400 truncate">{recording?.title}</span>
          </div>
        </nav>

        {/* Main Content */}
        <div className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-navy-600">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">
                  {getFileTypeIcon(recording.mimeType)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {recording.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm">
                    {recording.category && (
                      <span 
                        className="px-3 py-1 rounded-full font-medium"
                        style={{ 
                          backgroundColor: `${recording.category.color}20`,
                          color: recording.category.color
                        }}
                      >
                        {recording.category.nameRu}
                      </span>
                    )}
                    {!recording.isApproved && (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                        На модерации
                      </span>
                    )}
                    {!recording.isPublic && (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full">
                        Приватная
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {canEdit && (
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/recordings/${recording.id}/edit`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
                  >
                    Редактировать
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
                  >
                    Удалить
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center space-x-1">
                <span>👁️</span>
                <span>{recording.viewsCount || 0} просмотров</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>❤️</span>
                <span>{recording.likesCount || 0} лайков</span>
              </span>
              <span>📅 {formatDate(recording.createdAt)}</span>
              {recording.fileSize && (
                <span>📦 {formatFileSize(recording.fileSize)}</span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Description */}
            {recording.description && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Описание</h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {recording.description}
                  </p>
                </div>
              </div>
                          )}

            {/* Tags */}
            {recording.tags && recording.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Теги</h3>
                <div className="flex flex-wrap gap-2">
                  {recording.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-navy-700 text-gray-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Info */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Автор</h3>
              <div className="flex items-center space-x-4 p-4 bg-navy-700 rounded-lg">
                {recording.user?.avatar ? (
                  <img
                    src={recording.user.avatar}
                    alt={recording.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-navy-600 rounded-full flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                )}
                <div>
                  <h4 className="text-white font-medium">
                    {recording.user?.name || 'Неизвестный автор'}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {recording.user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Download Section */}
            {recording.filePath && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Скачать файл</h3>
                <div className="p-4 bg-navy-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {getFileTypeIcon(recording.mimeType)}
                      </span>
                      <div>
                        <p className="text-white font-medium">
                          {recording.fileName || 'Файл записи'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {recording.mimeType} • {formatFileSize(recording.fileSize)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="px-6 py-2 bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 text-white rounded-lg transition-colors duration-300 flex items-center space-x-2"
                    >
                      {downloading ? (
                        <>
                          <LoadingSpinner size="small" />
                          <span>Скачивание...</span>
                        </>
                      ) : (
                        <>
                          <span>⬇️</span>
                          <span>Скачать</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-navy-700 rounded-lg">
                <h4 className="text-white font-medium mb-2">Информация о файле</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Тип файла:</span>
                    <span className="text-white">{recording.mimeType || 'Неизвестно'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Размер:</span>
                    <span className="text-white">{formatFileSize(recording.fileSize) || 'Неизвестно'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Загружено:</span>
                    <span className="text-white">{formatDate(recording.createdAt)}</span>
                  </div>
                  {recording.updatedAt !== recording.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Обновлено:</span>
                      <span className="text-white">{formatDate(recording.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-navy-700 rounded-lg">
                <h4 className="text-white font-medium mb-2">Статистика</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Просмотры:</span>
                    <span className="text-white">{recording.viewsCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Лайки:</span>
                    <span className="text-white">{recording.likesCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Статус:</span>
                    <span className={`${recording.isApproved ? 'text-green-400' : 'text-yellow-400'}`}>
                      {recording.isApproved ? 'Одобрено' : 'На модерации'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Доступ:</span>
                    <span className={`${recording.isPublic ? 'text-green-400' : 'text-red-400'}`}>
                      {recording.isPublic ? 'Публичная' : 'Приватная'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Recordings */}
        {recording.category && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Другие записи в категории "{recording.category.nameRu}"
              </h2>
              <Link
                to={`/categories/${recording.category.id}`}
                className="text-gold-400 hover:text-gold-300 transition-colors"
              >
                Смотреть все →
              </Link>
            </div>
            {/* Here you could add a component to show related recordings */}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingDetail;

