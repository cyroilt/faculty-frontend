import React, { useState } from 'react';

const FileViewer = ({ file, onClose }) => {
  const [activeTab, setActiveTab] = useState('info');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderFileInfo = () => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-navy-700 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">Основная информация</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Имя файла:</span>
              <span className="text-white">{file.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Размер:</span>
              <span className="text-white">{file.info?.size_formatted || 'Неизвестно'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Тип:</span>
              <span className="text-white">{file.info?.mime_type || 'Неизвестно'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Расширение:</span>
              <span className="text-white">{file.info?.extension || 'Неизвестно'}</span>
            </div>
          </div>
        </div>

        <div className="bg-navy-700 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">Даты</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Создан:</span>
              <span className="text-white">
                {file.info?.created_at ? formatDate(file.info.created_at) : 'Неизвестно'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Изменен:</span>
              <span className="text-white">
                {file.info?.modified_at ? formatDate(file.info.modified_at) : 'Неизвестно'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Type-specific Info */}
      {file.info && renderTypeSpecificInfo()}
    </div>
  );

  const renderTypeSpecificInfo = () => {
    const info = file.info;
    
    if (info.type === 'image' && info.width && info.height) {
      return (
        <div className="bg-navy-700 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">Информация об изображении</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Размеры:</span>
              <span className="text-white">{info.dimensions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Формат:</span>
              <span className="text-white">{info.format}</span>
            </div>
            {info.mode && (
              <div className="flex justify-between">
                <span className="text-gray-400">Режим:</span>
                <span className="text-white">{info.mode}</span>
              </div>
            )}
          </div>
          
          {info.exif && (
            <div className="mt-4">
              <h5 className="text-white font-