import React, { useState } from 'react';

const DirectoryTree = ({ tree, onPathChange, currentPath }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set([tree?.path]));

  const toggleNode = (path) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedNodes(newExpanded);
  };

  const handlePathSelect = (path) => {
    onPathChange(path);
  };

  const renderNode = (node, level = 0) => {
    if (!node) return null;

    const isExpanded = expandedNodes.has(node.path);
    const isSelected = currentPath === node.path;
    const hasChildren = node.children && node.children.length > 0;
    const directories = node.children?.filter(child => child.type === 'directory') || [];
    const files = node.children?.filter(child => child.type === 'file') || [];

    return (
      <div key={node.path} className="select-none">
        {/* Directory Node */}
        {node.type === 'directory' && (
          <div
            className={`flex items-center space-x-2 py-1 px-2 rounded cursor-pointer transition-colors duration-200 ${
              isSelected
                ? 'bg-gold-500/20 text-gold-400'
                : 'hover:bg-navy-600 text-gray-300'
            }`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => handlePathSelect(node.path)}
          >
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(node.path);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isExpanded ? '📂' : '📁'}
              </button>
            )}
            {!hasChildren && <span className="text-gray-500">📁</span>}
            <span className="text-sm truncate">{node.name}</span>
            {directories.length > 0 && (
              <span className="text-xs text-gray-500">({directories.length})</span>
            )}
          </div>
        )}

        {/* File Node */}
        {node.type === 'file' && (
          <div
            className="flex items-center space-x-2 py-1 px-2 text-gray-400 text-sm"
            style={{ paddingLeft: `${level * 16 + 24}px` }}
          >
            <span>{getFileIcon(node.file_type)}</span>
            <span className="truncate">{node.name}</span>
            <span className="text-xs text-gray-500">
              {formatFileSize(node.size)}
            </span>
          </div>
        )}

        {/* Render Children */}
        {node.type === 'directory' && isExpanded && hasChildren && (
          <div>
            {/* Render directories first */}
            {directories.map(child => renderNode(child, level + 1))}
            {/* Render files */}
            {files.slice(0, 5).map(child => renderNode(child, level + 1))}
            {files.length > 5 && (
              <div
                className="text-xs text-gray-500 py-1"
                style={{ paddingLeft: `${(level + 1) * 16 + 24}px` }}
              >
                ... и еще {files.length - 5} файлов
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {node.error && (
          <div
            className="text-red-400 text-xs py-1"
            style={{ paddingLeft: `${level * 16 + 24}px` }}
          >
            Ошибка: {node.error}
          </div>
        )}
      </div>
    );
  };

  const getFileIcon = (type) => {
    const icons = {
      image: '🖼️',
      video: '🎥',
      audio: '🎵',
      document: '📄',
      text: '📝',
      archive: '📦',
      other: '📄'
    };
    return icons[type] || icons.other;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!tree) {
    return (
      <div className="text-gray-400 text-sm">
        Структура папок недоступна
      </div>
    );
  }

  return (
    <div className="space-y-1 max-h-96 overflow-y-auto">
      {renderNode(tree)}
    </div>
  );
};

export default DirectoryTree;