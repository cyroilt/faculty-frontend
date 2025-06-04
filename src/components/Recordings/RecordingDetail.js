import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { recordingAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  HeartIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  ArrowLeftIcon,
  ShareIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const RecordingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchRecording();
  }, [id]);

  const fetchRecording = async () => {
    try {
      const response = await recordingAPI.getById(id);
      const recordingData = response.data;
      setRecording(recordingData);
      setIsLiked(recordingData.likes?.includes(user?._id) || false);
      setLikesCount(recordingData.likes?.length || 0);
    } catch (error) {
      console.error('Error fetching recording:', error);
      toast.error('Ошибка загрузки записи');
      navigate('/recordings');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated || isLiking) return;
    
    setIsLiking(true);
    try {
      const response = await recordingAPI.like(id);
      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.likes);
    } catch (error) {
      console.error('Error liking recording:', error);
      toast.error('Ошибка при добавлении лайка');
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) return;
    
    try {
      await recordingAPI.delete(id);
      toast.success('Запись успешно удалена');
      navigate('/recordings');
    } catch (error) {
      console.error('Error deleting recording:', error);
      toast.error('Ошибка при удалении записи');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recording.title,
          text: recording.content.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Ссылка скопирована в буфер обмена');
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

  const canEdit = isAuthenticated && (
    user?.role === 'admin' || 
    user?.role === 'moderator' || 
    user?._id === recording?.author?._id
  );

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card animate-pulse">
            <div className="h-8 bg-white/10 rounded mb-4 w-3/4"></div>
            <div className="h-64 bg-white/10 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-white/10 rounded"></div>
              <div className="h-4 bg-white/10 rounded w-5/6"></div>
              <div className="h-4 bg-white/10 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recording) {
    return (
      <div className="min-h-screen py-8 px-4">
                <div className="max-w-4xl mx-auto">
          <div className="card text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Запись не найдена</h2>
            <p className="text-white/70 mb-6">Запрашиваемая запись не существует или была удалена</p>
            <Link to="/recordings" className="btn-primary">
              Вернуться к записям
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Назад</span>
          </button>
        </motion.div>

        {/* Main Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                  {recording.title}
                </h1>
                
                {/* Category */}
                {recording.category && (
                  <div className="inline-flex items-center mb-4">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: recording.category.color || '#1e3a8a' }}
                    >
                      {recording.category.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleShare}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors duration-200"
                  title="Поделиться"
                >
                  <ShareIcon className="h-5 w-5" />
                </button>

                {canEdit && (
                  <>
                    <Link
                      to={`/admin/recordings/edit/${recording._id}`}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors duration-200"
                      title="Редактировать"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors duration-200"
                      title="Удалить"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/60 mb-6">
              {recording.author && (
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  <span>{recording.author.firstName} {recording.author.lastName}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>{formatDate(recording.createdAt)}</span>
              </div>
              
              <div className="flex items-center">
                <EyeIcon className="h-4 w-4 mr-2" />
                <span>{recording.views || 0} просмотров</span>
              </div>

              <button
                onClick={handleLike}
                disabled={!isAuthenticated || isLiking}
                className={`flex items-center space-x-1 transition-colors duration-200 ${
                  isLiked 
                    ? 'text-red-400 hover:text-red-300' 
                    : 'text-white/60 hover:text-red-400'
                } ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {isLiked ? (
                  <HeartSolidIcon className="h-4 w-4" />
                ) : (
                  <HeartIcon className="h-4 w-4" />
                )}
                <span>{likesCount}</span>
              </button>
            </div>

            {/* Featured Badge */}
            {recording.isFeatured && (
              <div className="inline-flex items-center bg-gold-500/20 text-gold-400 px-3 py-1 rounded-full text-sm font-medium mb-6">
                ⭐ Рекомендуемая запись
              </div>
            )}
          </header>

          {/* Images */}
          {recording.images?.length > 0 && (
            <div className="mb-8">
              <div className="relative">
                <img
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${recording.images[currentImageIndex].url}`}
                  alt={recording.title}
                  className="w-full h-64 lg:h-96 object-cover rounded-lg"
                />
                
                {recording.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(
                        currentImageIndex === 0 ? recording.images.length - 1 : currentImageIndex - 1
                      )}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(
                        currentImageIndex === recording.images.length - 1 ? 0 : currentImageIndex + 1
                      )}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
                    >
                      →
                    </button>
                  </>
                )}
              </div>
              
              {recording.images.length > 1 && (
                <div className="flex justify-center space-x-2 mt-4">
                  {recording.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                        index === currentImageIndex ? 'bg-gold-400' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-8">
            <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
              {recording.content}
            </div>
          </div>

          {/* Tags */}
          {recording.tags?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Теги</h3>
              <div className="flex flex-wrap gap-2">
                {recording.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full hover:bg-white/20 transition-colors duration-200"
                  >
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {recording.files?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Прикрепленные файлы</h3>
              <div className="space-y-2">
                {recording.files.map((file, index) => (
                  <a
                    key={index}
                    href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${file.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <div className="text-white font-medium">{file.originalName}</div>
                      <div className="text-white/60 text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <div className="text-gold-400">
                      Скачать →
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.article>

        {/* Related Recordings */}
        {/* This would be implemented with a separate API call */}
      </div>
    </div>
  );
};

export default RecordingDetail;
