import axios from 'axios';

const FLASK_API_URL = process.env.REACT_APP_FLASK_API_URL || 'http://localhost:5001';

const flaskApi = axios.create({
  baseURL: FLASK_API_URL,
});

// File operations
export const flaskFileAPI = {
  uploadFile: (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return flaskApi.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      }
    });
  },

  getFileInfo: (filename) => flaskApi.get(`/api/files/${filename}`),
  
  downloadFile: (filename) => flaskApi.get(`/api/files/${filename}/download`, {
    responseType: 'blob'
  }),
  
    getFileContent: (filename) => flaskApi.get(`/api/files/${filename}/content`),
  
  listFiles: (params = {}) => flaskApi.get('/api/files', { params }),
};

// Directory operations
export const flaskDirectoryAPI = {
  scanDirectory: (path) => flaskApi.post('/api/directory/scan', { path }),
  
  getDirectoryTree: (path) => flaskApi.get('/api/directory/tree', { 
    params: { path } 
  }),
  
  listFiles: (params = {}) => flaskApi.get('/api/files', { params }),
};

// Health check
export const flaskHealthAPI = {
  check: () => flaskApi.get('/api/health'),
};

export default flaskApi;
