import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecordings } from '../context/RecordingContext';

const EditRecording = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
    image: '',
    video: ''
  });
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recordingLoading, setRecordingLoading] = useState(true);
  
  const { recordings, updateRecording, categories } = useRecordings();
  const navigate = useNavigate();

  useEffect(() => {
    const recording = recordings.find(r => r._id === id);
    if (recording) {
      setFormData({
        title: recording.title || '',
        content: recording.content || '',
        category: recording.category || '',
        tags: recording.tags || [],
        image: recording.image || '',
        video: recording.video || ''
      });
      setRecordingLoading(false);
    } else if (recordings.length > 0) {
      // Recording not found
      navigate('/recordings');
    }
  }, [recordings, id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title || !formData.content || !formData.category) {
      setError('Пожалуйста, заполните все обязательные поля');
      setLoading(false);
      return;
    }

    const result = await updateRecording(id, formData);
    
    if (result.success) {
      navigate('/recordings');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  if (recordingLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600">Загрузка записи...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">
            Редактировать запись
          </h1>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {error && (
              <motion.div 
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Заголовок *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Введите заголовок записи"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Содержание *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
                  placeholder="Введите содержание записи"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Теги
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Добавить тег"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <motion.button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Добавить
                  </motion.button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      className="inline-flex items-center bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-yellow-600 hover:text-yellow-800"
                      >
                        ×
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL изображения
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL видео
                </label>
                <input
                  type="url"
                  name="video"
                  value={formData.video}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/video.mp4"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <motion.button
                  type="button"
                  onClick={() => navigate('/recordings')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Отмена
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <motion.div 
                        className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Сохранение...
                    </div>
                  ) : (
                    'Сохранить изменения'
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditRecording;