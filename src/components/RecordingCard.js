import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useRecordings } from '../context/RecordingContext';

const RecordingCard = ({ recording }) => {
  const { user } = useAuth();
  const { deleteRecording } = useRecordings();
  
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      await deleteRecording(recording._id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {recording.image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={recording.image} 
            alt={recording.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
            {recording.category}
          </span>
          <span className="text-gray-500 text-sm">
            {formatDate(recording.createdAt)}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {recording.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {recording.content}
        </p>
        
        {recording.tags && recording.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {recording.tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {recording.video && (
          <div className="mb-4">
            <video 
              controls 
              className="w-full rounded-lg"
              poster={recording.image}
            >
              <source src={recording.video} type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
          </div>
        )}
        
        {isAdmin && (
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <motion.a
              href={`/edit-recording/${recording._id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Редактировать
            </motion.a>
            <motion.button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Удалить
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecordingCard;
