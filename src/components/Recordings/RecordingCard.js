import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { recordingAPI } from '../../services/api';
import {
  HeartIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const RecordingCard = ({ recording, onUpdate }) => {
  const { user, isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(
    recording.likes?.includes(user?._id) || false
  );
  const [likesCount, setLikesCount] = useState(recording.likes?.length || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated || isLiking) return;
    
    setIsLiking(true);
    try {
      const response = await recordingAPI.like(recording._id);
      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.likes);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error liking recording:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="card group h-full flex flex-col"
    >
      <Link to={`/recordings/${recording._id}`} className="flex-1 flex flex-col">
        {/* Image/Video Preview */}
        {recording.images?.length > 0 && (
          <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
            <img
              src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${recording.images[0].url}`}
              alt={recording.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Category Badge */}
            {recording.category && (
              <div 
                className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: recording.category.color || '#1e3a8a' }}
              >
                {recording.category.name}
              </div>
            )}
            
            {/* Featured Badge */}
            {recording.isFeatured && (
              <div className="absolute top-3 right-3 bg-gold-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Рекомендуемое
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors duration-200">
            {recording.title}
          </h3>
          
          <p className="text-white/70 mb-4 flex-1 leading-relaxed">
            {truncateText(recording.content)}
          </p>

          {/* Tags */}
          {recording.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {recording.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full"
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
              {recording.tags.length > 3 && (
                <span className="text-white/60 text-xs">
                  +{recording.tags.length - 3} еще
                </span>
              )}
            </div>
          )}

          {/* Meta Information */}
          <div className="space-y-2 text-sm text-white/60">
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
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
        <button
          onClick={handleLike}
          disabled={!isAuthenticated || isLiking}
          className={`flex items-center space-x-2 transition-colors duration-200 ${
            isLiked 
              ? 'text-red-400 hover:text-red-300' 
              : 'text-white/60 hover:text-red-400'
          } ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {isLiked ? (
            <HeartSolidIcon className="h-5 w-5" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
          <span className="text-sm">{likesCount}</span>
        </button>

        <Link
          to={`/recordings/${recording._id}`}
          className="text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors duration-200"
        >
          Читать далее →
        </Link>
      </div>
    </motion.div>
  );
};

export default RecordingCard;