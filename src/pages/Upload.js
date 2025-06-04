import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Upload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    file: null,
    isPublic: true
  });

  const categories = [
    { id: 1, name: 'Программирование', nameRu: 'Программирование', icon: '💻' },
    { id: 2, name: 'История', nameRu: 'История', icon: '📚' },
    { id: 3, name: 'Математика', nameRu: 'Математика', icon: '📐' },
    { id: 4, name: 'Физика', nameRu: 'Физика', icon: '⚛️' },
    { id: 5, name: 'Химия', nameRu: 'Химия', icon: '🧪' },
    { id: 6, name: 'Литература', nameRu: 'Литература', icon: '📖' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      file: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would normally upload to your API
      console.log('Uploading:', formData);
      
      // Redirect to dashboard after successful upload
      navigate('/dashboard');
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Загрузить новую запись
          </h1>
          <p className="text-gray-400 text-lg">
            Поделитесь своими знаниями с сообществом
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-navy-800 rounded-xl p-8 border border-gold-500/20">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                required
                className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors duration-300"
                placeholder="Введите название записи..."
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-white font-medium mb-2">
                Описание *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 transition-colors duration-300 resize-none"
                placeholder="Опишите содержание вашей записи..."
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-white font-medium mb-2">
                Категория *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors duration-300"
              >
                <option value="">Выберите категорию</option>
                {categories.map(category => (
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
                placeholder="Введите теги через запятую..."
              />
              <p className="text-gray-400 text-sm mt-1">
                Например: программирование, обучение, javascript
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="file" className="block text-white font-medium mb-2">
                Файл записи
              </label>
              <div className="border-2 border-dashed border-navy-600 rounded-lg p-6 text-center hover:border-gold-500 transition-colors duration-300">
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  accept="video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx"
                  className="hidden"
                />
                <label htmlFor="file" className="cursor-pointer">
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-white font-medium mb-1">
                    Нажмите для выбора файла
                  </p>
                  <p className="text-gray-400 text-sm">
                    Поддерживаются: видео, аудио, PDF, документы
                  </p>
                  {formData.file && (
                    <p className="text-gold-400 mt-2">
                      Выбран файл: {formData.file.name}
                    </p>
                  )}
                </label>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className="w-4 h-4 text-gold-500 bg-navy-700 border-navy-600 rounded focus:ring-gold-500 focus:ring-2"
              />
              <label htmlFor="isPublic" className="text-white">
                Сделать запись публичной
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-navy-600 text-gray-400 rounded-lg font-medium hover:border-gold-500 hover:text-white transition-all duration-300"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
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

                {/* Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">💡 Советы для успешной загрузки</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <span className="text-gold-400 mt-1">•</span>
                <p className="text-gray-300 text-sm">Используйте понятные и описательные названия</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-gold-400 mt-1">•</span>
                <p className="text-gray-300 text-sm">Добавьте подробное описание содержания</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-gold-400 mt-1">•</span>
                <p className="text-gray-300 text-sm">Выберите подходящую категорию для лучшего поиска</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <span className="text-gold-400 mt-1">•</span>
                <p className="text-gray-300 text-sm">Используйте релевантные теги</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-gold-400 mt-1">•</span>
                <p className="text-gray-300 text-sm">Проверьте качество файла перед загрузкой</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-gold-400 mt-1">•</span>
                <p className="text-gray-300 text-sm">Максимальный размер файла: 500 МБ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
