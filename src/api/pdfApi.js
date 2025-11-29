import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// PDF API functions
export const pdfApi = {
  // Upload PDF files
  uploadPDF: async (files) => {
    const formData = new FormData();
    
    // Append each file to FormData with key 'files'
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post('/upload-pdf/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Query PDF
  queryPDF: async (question) => {
    const response = await api.get('/query/', {
      params: { question },
    });
    
    return response.data;
  },

  // Clear embeddings and memory
  clearEmbeddings: async () => {
    const response = await api.delete('/clear-embeddings/');
    return response.data;
  },
};

export default api;
