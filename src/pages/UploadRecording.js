import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { recordingsAPI, categoriesAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const UploadRecording = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    tags: '',
    isPublic: true,
    file: null
  });

  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCategories();
  }, [user, navigate]);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file size (500MB max)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Файл слишком большой. Максимальный размер: 500MB');
      return;
    }

    // Validate file type
    const allowedTypes = [
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
      'audio/mp3', 'audio/wav', 'audio/m4a',
      'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Неподдерживаемый тип файла');
      return;
    }

    setError('');
    setFormData(prev => ({ ...prev, file }));

    // Auto-fill title if empty
    if (!formData.title) {
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      setFormData(prev => ({ ...prev, title: fileName }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Введите название записи');
      return;
    }

    if (!formData.categoryId) {
      setError('Выберите категорию');
      return;
    }

    if (!formData.file) {
      setError('Выберите файл для загрузки');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const uploadData = new FormData();
      uploadData.append('title', formData.title.trim());
      uploadData.append('description', formData.description.trim());
      uploadData.append('categoryId', formData.categoryId);
      uploadData.append('isPublic', formData.isPublic);
      uploadData.append('file', formData.file);

      if (formData.tags.trim()) {
        const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        uploadData.append('tags', JSON.stringify(tags));
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      const response = await recordingsAPI.create(uploadData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Redirect to the new recording
      setTimeout(() => {
        navigate(`/recordings/${response.data.id}`);
      }, 1000);

    } catch (error) {
      console.error('Error uploading recording:', error);
      setError(error.response?.data?.message || 'Ошибка при загрузке файла');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    if (!file) return '📄';
    if (file.type.startsWith('video/')) return '🎥';
    if (file.type.startsWith('audio/')) return '🎵';
    if (file.type.includes('pdf')) return '📕';
    if (file.type.includes('word')) return '📘';
    if (file.type.includes('powerpoint') || file.type.includes('presentation')) return '📊';
    return '📄';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center">
        <LoadingSpinner size="large" text="Загрузка..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Загрузить запись
          </h1>
          <p className="text-gray-400">
            Поделитесь своими материалами с сообществом
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-navy-800 rounded-xl border border-navy-600 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-white font-medium mb-3">
                Файл записи *
              </label>
              
              {!formData.file ? (
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 ${
                    dragActive 
                      ? 'border-gold-500 bg-gold-500/10' 
                      : 'border-navy-600 hover:border-navy-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="text-6xl mb-4">📁</div>
                  <p className="text-white mb-2">
                    Перетащите файл сюда или нажмите для выбора
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    Поддерживаемые форматы: MP4, AVI, MOV, MP3, WAV, PDF, DOC, PPT
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    Максимальный размер: 500MB
                  </p>
                  <input
                    type="file"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                    accept="video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors duration-300"
                  >
                    Выбрать файл
                  </label>
                </div>
              ) : (
                <div className="border border-navy-600 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getFileIcon(formData.file)}</span>
                      <div>
                        <p className="text-white font-medium">{formData.file.name}</p>
                        <p className="text-gray-400 text-sm">
                          {formatFileSize(formData.file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-white font-medium mb-2">
                Название записи *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors duration-300"
                placeholder="Введите название записи"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-white font-medium mb-2">
                Описание
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors duration-300 resize-vertical"
                placeholder="Опишите содержание записи..."
              />
            </div>

            {/* Category */}
            <div>
                            <label htmlFor="categoryId" className="block text-white font-medium mb-2">
                Категория *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors duration-300"
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.nameRu}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-white font-medium mb-2">
                Теги
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors duration-300"
                placeholder="Введите теги через запятую (например: математика, лекция, алгебра)"
              />
              <p className="text-gray-400 text-sm mt-1">
                Теги помогут другим пользователям найти вашу запись
              </p>
            </div>

            {/* Privacy Settings */}
            <div>
              <label className="block text-white font-medium mb-3">
                Настройки доступа
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-gold-500 bg-navy-700 border-navy-600 rounded focus:ring-gold-500 focus:ring-2"
                  />
                  <div>
                    <span className="text-white">Публичная запись</span>
                    <p className="text-gray-400 text-sm">
                      Запись будет доступна всем пользователям после модерации
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-red-400">❌</span>
                  <span className="text-red-400">{error}</span>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="bg-navy-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">Загрузка файла...</span>
                  <span className="text-gold-400">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-navy-600 rounded-full h-2">
                  <div 
                    className="bg-gold-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-navy-600 text-gray-400 rounded-lg hover:border-navy-500 hover:text-white transition-colors duration-300"
                disabled={uploading}
              >
                Отмена
              </button>
              
              <button
                type="submit"
                disabled={uploading || !formData.file || !formData.title.trim() || !formData.categoryId}
                className="px-8 py-3 bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 text-white rounded-lg transition-colors duration-300 flex items-center space-x-2"
              >
                {uploading ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span>Загрузка...</span>
                  </>
                ) : (
                  <>
                    <span>📤</span>
                    <span>Загрузить запись</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Upload Guidelines */}
        <div className="mt-8 bg-navy-800/50 rounded-xl border border-navy-600 p-6">
          <h3 className="text-white font-semibold mb-4">📋 Рекомендации по загрузке</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="text-gold-400 font-medium mb-2">Качество контента</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• Используйте описательные названия</li>
                <li>• Добавляйте подробное описание</li>
                <li>• Указывайте релевантные теги</li>
                <li>• Выбирайте правильную категорию</li>
              </ul>
            </div>
            <div>
              <h4 className="text-gold-400 font-medium mb-2">Технические требования</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• Максимальный размер файла: 500MB</li>
                <li>• Поддерживаемые форматы: видео, аудио, документы</li>
                <li>• Файлы проходят модерацию</li>
                <li>• Время обработки: до 24 часов</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadRecording;
