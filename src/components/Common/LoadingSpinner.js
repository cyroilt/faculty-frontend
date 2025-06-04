import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Загрузка...', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-navy-600 border-t-gold-500 rounded-full animate-spin`}></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-r-gold-400 rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      {text && (
        <p className={`text-gray-400 ${textSizeClasses[size]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
