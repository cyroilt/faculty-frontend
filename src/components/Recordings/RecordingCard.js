import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatFileSize, getFileTypeIcon, truncateText } from '../../utils/helpers';

const RecordingCard = ({ recording, showStatus = false }) => {
  return (
    <div className="bg-navy-800 rounded-xl border border-navy-600 overflow-hidden hover:border-gold-500/50 transition-all duration-300 group">
      {/* Thumbnail */}
      <div className="relative h-48 bg-navy-700 flex items-center justify-center">
        <span className="text-4xl">
          {getFileTypeIcon(recording.mimeType)}
        </span>
        
        {/* Status Badge */}
        {showStatus && (
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              recording.isApproved 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {recording.isApproved ? 'Одобрено' : 'На модерации'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-semibold mb-2 group-hover:text-gold-400 transition-colors">
          <Link to={`/recordings/${recording.id}`}>
            {truncateText(recording.title, 60)}
          </Link>
        </h3>
        
        {recording.description && (
          <p className="text-gray-400 text-sm mb-3">
            {truncateText(recording.description, 100)}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{formatDate(recording.createdAt)}</span>
          <span>{formatFileSize(recording.fileSize)}</span>
        </div>

        {/* Category & Stats */}
        <div className="flex items-center justify-between">
          {recording.category && (
            <span className="px-2 py-1 bg-navy-700 text-gray-300 rounded text-xs">
              {recording.category.nameRu}
            </span>
          )}
          
          <div className="flex items-center space-x-3 text-xs text-gray-400">
            <span>👁️ {recording.viewsCount || 0}</span>
            <span>❤️ {recording.likesCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingCard;
