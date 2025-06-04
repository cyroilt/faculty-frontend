import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { recordingAPI, categoryAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  PhotoIcon,
  DocumentIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const RecordingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm();

  const [categories, setCategories] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchRecording();
    }
  }, [id, isEdit]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Ошибка загрузки категорий');
    }
  };

  const fetchRecording = async () => {
    try {
      const response = await recordingAPI.getById(id);
      const recording = response.data;
      
      // Fill form with existing data
      reset({
        title: recording.title,
        content: recording.content,
        category: recording.category?._id || '',
        isFeatured: recording.isFeatured || false,
      });
      
      setTags(recording.tags || []);
      setExistingImages(recording.images || []);
      setExistingFiles(recording.files || []);
    } catch (error) {
      console.error('Error fetching recording:', error);
      toast.error('Ошибка загрузки записи');
      navigate('/admin/recordings');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Файл ${file.name} слишком большой (максимум 5MB)`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`Файл ${file.name} не является изображением`);
        return false;
      }
      return true;
    });
    
    setSelectedImages(prev => [...prev, ...validFiles]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Файл ${file.name} слишком большой (максимум 10MB)`);
        return false;
      }
      return true;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeSelectedImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = (index) => {
    setExistingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Add text data
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('category', data.category);
      formData.append('isFeatured', data.isFeatured);
      formData.append('tags', JSON.stringify(tags));
      
      // Add new images
      selectedImages.forEach(image => {
        formData.append('images', image);
      });
      
      // Add new files
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      
      // Add existing media info for edit
      if (isEdit) {
        formData.append('existingImages', JSON.stringify(existingImages));
        formData.append('existingFiles', JSON.stringify(existingFiles));
      }
      
      let response;
      if (isEdit) {
        response = await recordingAPI.update(id, formData);
        toast.success('Запись успешно обновлена');
      } else {
        response = await recordingAPI.create(formData);
        toast.success('Запись успешно создана');
      }
      
      navigate(`/recordings/${response.data._id}`);
    } catch (error) {
      console.error('Error saving recording:', error);
      toast.error(
        error.response?.data?.message || 
        `Ошибка ${isEdit ? 'обновления' : 'создания'} записи`
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card animate-pulse">
                        <div className="h-8 bg-white/10 rounded mb-6 w-1/3"></div>
            <div className="space-y-4">
              <div className="h-12 bg-white/10 rounded"></div>
              <div className="h-32 bg-white/10 rounded"></div>
              <div className="h-12 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            {isEdit ? 'Редактировать запись' : 'Создать новую запись'}
          </h1>
          <p className="text-white/70">
            {isEdit ? 'Внесите изменения в существующую запись' : 'Заполните форму для создания новой записи'}
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
            {/* Title */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Заголовок *
              </label>
              <input
                type="text"
                {...register('title', { 
                  required: 'Заголовок обязателен',
                  minLength: { value: 3, message: 'Минимум 3 символа' }
                })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="Введите заголовок записи"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Категория
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                <option value="">Выберите категорию</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Содержание *
              </label>
              <textarea
                {...register('content', { 
                  required: 'Содержание обязательно',
                  minLength: { value: 10, message: 'Минимум 10 символов' }
                })}
                rows={10}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-vertical"
                placeholder="Введите содержание записи"
              />
              {errors.content && (
                <p className="text-red-400 text-sm mt-1">{errors.content.message}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Теги
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-gold-500/20 text-gold-400 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-gold-300"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="Добавить тег"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors duration-200"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Изображения
              </label>
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-white/60 text-sm mb-2">Текущие изображения:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${image.url}`}
                          alt={`Existing ${index}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {selectedImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-white/60 text-sm mb-2">Новые изображения:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`New ${index}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeSelectedImage(index)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/20 border-dashed rounded-lg cursor-pointer hover:border-white/40 transition-colors duration-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <PhotoIcon className="h-8 w-8 text-white/60 mb-2" />
                  <p className="text-white/60 text-sm">
                    Нажмите для выбора изображений
                  </p>
                  <p className="text-white/40 text-xs">PNG, JPG до 5MB</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            </div>

            {/* Files */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Файлы
              </label>
              
              {/* Existing Files */}
              {existingFiles.length > 0 && (
                <div className="mb-4">
                  <p className="text-white/60 text-sm mb-2">Текущие файлы:</p>
                  <div className="space-y-2">
                    {existingFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center">
                          <DocumentIcon className="h-5 w-5 text-white/60 mr-3" />
                          <div>
                            <p className="text-white text-sm">{file.originalName}</p>
                            <p className="text-white/60 text-xs">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingFile(index)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Files */}
              {selectedFiles.length > 0 && (
                <div className="mb-4">
                  <p className="text-white/60 text-sm mb-2">Новые файлы:</p>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center">
                          <DocumentIcon className="h-5 w-5 text-white/60 mr-3" />
                          <div>
                            <p className="text-white text-sm">{file.name}</p>
                            <p className="text-white/60 text-xs">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(index)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/20 border-dashed rounded-lg cursor-pointer hover:border-white/40 transition-colors duration-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <DocumentIcon className="h-8 w-8 text-white/60 mb-2" />
                  <p className="text-white/60 text-sm">
                    Нажмите для выбора файлов
                  </p>
                  <p className="text-white/40 text-xs">Любые файлы до 10MB</p>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            {/* Featured */}
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('isFeatured')}
                className="w-4 h-4 text-gold-500 bg-white/10 border-white/20 rounded focus:ring-gold-500 focus:ring-2"
              />
              <label className="ml-2 text-white/80 text-sm">
                Рекомендуемая запись
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-gold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isEdit ? 'Обновление...' : 'Создание...'}
                  </div>
                ) : (
                  isEdit ? 'Обновить запись' : 'Создать запись'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/admin/recordings')}
                className="flex-1 btn-secondary py-3"
              >
                Отмена
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default RecordingForm;
