import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = '', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-600 border-t-gold-500 ${sizeClasses[size]}`}></div>
      {text && (
        <p className="mt-3 text-gray-400 text-sm">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
