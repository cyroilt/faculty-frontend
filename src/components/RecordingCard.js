import React from 'react';
import { Link } from 'react-router-dom';

const RecordingCard = ({ recording }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-navy-800 rounded-xl overflow-hidden border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 transform hover:scale-105 group">
      {/* Image */}
      {recording.imageUrl && (
        <div className="relative overflow-hidden h-48">
          <img
            src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${recording.imageUrl}`}
            alt={recording.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent"></div>
          
          {/* Category Badge */}
          {recording.category && (
            <div className="absolute top-4 left-4">
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: recording.category.color || '#f59e0b' }}
              >
                {recording.category.icon} {recording.category.nameRu || recording.category.name}
              </span>
            </div>
          )}

          {/* Video Indicator */}
          {recording.videoUrl && (
            <div className="absolute top-4 right-4">
              <div className="bg-navy-900/80 rounded-full p-2">
                <svg className="w-5 h-5 text-gold-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gold-400 transition-colors duration-300">
          <Link to={`/recordings/${recording.id}`} className="hover:underline">
            {recording.title}
          </Link>
        </h3>

        {/* Content Preview */}
        {recording.content && (
          <p className="text-gray-400 mb-4 leading-relaxed">
            {truncateText(recording.content)}
          </p>
        )}

        {/* Tags */}
        {recording.tags && recording.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {recording.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-navy-700 text-gold-400 px-2 py-1 rounded text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
            {recording.tags.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{recording.tags.length - 3} еще
              </span>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {/* Author */}
            {recording.user && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                  <span className="text-navy-900 font-semibold text-xs">
                    {recording.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hover:text-gold-400 transition-colors duration-300">
                  {recording.user.name}
                </span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(recording.createdAt)}</span>
            </div>
          </div>

          {/* Views Count */}
          {recording.viewsCount && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{recording.viewsCount}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-navy-700">
          <Link
            to={`/recordings/${recording.id}`}
            className="inline-flex items-center space-x-2 text-gold-400 hover:text-gold-300 font-medium transition-colors duration-300 group"
          >
            <span>Подробнее</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecordingCard;
