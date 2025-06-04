import React, { useState, useEffect } from 'react';
import { flaskFileAPI, flaskDirectoryAPI } from '../../services/flaskApi';
import FileUploader from './FileUploader';
import FileList from './FileList';
import DirectoryTree from './DirectoryTree';
import FileViewer from './FileViewer';
import LoadingSpinner from '../UI/LoadingSpinner';

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [directoryTree, setDirectoryTree] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    type: '',
    search: ''
  });

  useEffect(() => {
    loadFiles();
    loadDirectoryTree();
  }, [filters]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await flaskFileAPI.listFiles(filters);
      setFiles(response.data.files);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDirectoryTree = async () => {
    try {
      const response = await flaskDirectoryAPI.getDirectoryTree(currentPath);
      setDirectoryTree(response.data);
    } catch (error) {
      console.error('Error loading directory tree:', error);
    }
  };

  const handleFileUpload = async (file, onProgress) => {
    try {
      const response = await flaskFileAPI.uploadFile(file, onProgress);
      await loadFiles(); // Refresh file list
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleFileSelect = async (file) => {
    try {
      setLoading(true);
      const [fileInfo, fileContent] = await Promise.all([
        flaskFileAPI.getFileInfo(file.name),
        flaskFileAPI.getFileContent(file.name).catch(() => ({ data: { content: 'Content preview not available' } }))
      ]);
      
      setSelectedFile({
        ...file,
        info: fileInfo.data,
        content: fileContent.data.content
      });
    } catch (error) {
      console.error('Error loading file details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await flaskFileAPI.downloadFile(filename);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Файловый менеджер</h1>
          <p className="text-gray-400">Управление файлами и документами</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Directory Tree Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-navy-800 rounded-xl border border-navy-600 p-6">
              <h3 className="text-white font-semibold mb-4">📁 Структура папок</h3>
              {directoryTree ? (
                <DirectoryTree 
                  tree={directoryTree} 
                  onPathChange={setCurrentPath}
                  currentPath={currentPath}
                />
              ) : (
                <div className="text-gray-400 text-sm">Загрузка...</div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* File Uploader */}
            <div className="bg-navy-800 rounded-xl border border-navy-600 p-6">
              <h3 className="text-white font-semibold mb-4">📤 Загрузка файлов</h3>
              <FileUploader onUpload={handleFileUpload} />
            </div>

            {/* File Filters */}
            <div className="bg-navy-800 rounded-xl border border-navy-600 p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-64">
                  <input
                    type="text"
                    placeholder="Поиск файлов..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange({ search: e.target.value })}
                    className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-gold-500"
                  />
                </div>
                
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange({ type: e.target.value })}
                  className="bg-navy-700 border border-navy-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="">Все типы</option>
                  <option value="image">Изображения</option>
                  <option value="video">Видео</option>
                  <option value="audio">Аудио</option>
                  <option value="document">Документы</option>
                  <option value="text">Текст</option>
                  <option value="archive">Архивы</option>
                </select>

                <select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange({ limit: parseInt(e.target.value) })}
                  className="bg-navy-700 border border-navy-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500"
                >
                  <option value={10}>10 на странице</option>
                  <option value={20}>20 на странице</option>
                  <option value={50}>50 на странице</option>
                </select>
              </div>
            </div>

            {/* File List */}
            <div className="bg-navy-800 rounded-xl border border-navy-600">
              <div className="p-6 border-b border-navy-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">📋 Список файлов</h3>
                  {pagination.total_items > 0 && (
                    <span className="text-gray-400 text-sm">
                      {pagination.total_items} файлов найдено
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="large" text="Загрузка файлов..." />
                  </div>
                ) : (
                  <FileList
                    files={files}
                    onFileSelect={handleFileSelect}
                    onDownload={handleDownload}
                    selectedFile={selectedFile}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </div>

            {/* File Viewer */}
            {selectedFile && (
              <div className="bg-navy-800 rounded-xl border border-navy-600">
                <div className="p-6 border-b border-navy-600">
                  <h3 className="text-white font-semibold">👁️ Просмотр файла</h3>
                </div>
                <div className="p-6">
                  <FileViewer file={selectedFile} onClose={() => setSelectedFile(null)} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManager;