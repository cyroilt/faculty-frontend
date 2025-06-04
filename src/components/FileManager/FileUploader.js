import React, { useState, useRef } from 'react';

const FileUploader = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    const file = files[0];
    
    try {
      setUploading(true);
      setUploadStatus(`Загрузка ${file.name}...`);
      
      const result = await onUpload(file, (progress) => {
        setUploadProgress(progress);
      });
      
      setUploadStatus(`✅ Файл ${file.name} успешно загружен`);
      setTimeout(() => {
        setUploadStatus('');
        setUploadProgress(0);
      }, 3000);
      
    } catch (error) {
      setUploadStatus(`❌ Ошибка загрузки: ${error.message}`);
      setTimeout(() => setUploadStatus(''), 5000);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${
          dragActive
            ? 'border-gold-500 bg-gold-500/10'
            : 'border-navy-600 hover:border-navy-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept=".txt,.pdf,.png,.jpg,.jpeg,.gif,.mp4,.avi,.mov,.mp3,.wav,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
        />
        
        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          <div>
            <p className="text-white font-medium mb-2">
              Перетащите файл сюда или нажмите для выбора
            </p>
            <p className="text-gray-400 text-sm">
              Поддерживаемые форматы: изображения, видео, аудио, документы
            </p>
            <p className="text-gray-400 text-sm">
              Максимальный размер: 500MB
            </p>
          </div>
          
          <button
            type="button"
            onClick={onButtonClick}
            disabled={uploading}
            className="bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            {uploading ? 'Загрузка...' : 'Выбрать файл'}
          </button>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-navy-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">{uploadStatus}</span>
            <span className="text-gold-400 text-sm">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-navy-600 rounded-full h-2">
            <div 
              className="bg-gold-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Status Message */}
      {uploadStatus && !uploading && (
        <div className={`p-4 rounded-lg ${
                    uploadStatus.includes('✅')
            ? 'bg-green-500/20 text-green-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {uploadStatus}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
