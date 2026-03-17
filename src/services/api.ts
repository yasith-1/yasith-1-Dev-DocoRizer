import axios from 'axios';
import { ResourceLink } from '../types';
import { CONFIG } from '../config';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// ─── Resource Links ────────────────────────────────────────────────────────────

export const resourceLinksAPI = {
  getResourceLinks: async (projectId: string): Promise<ResourceLink[]> => {
    const response = await api.get(`/projects/${projectId}/links`);
    return response.data;
  },

  addResourceLink: async (projectId: string, resourceLink: Omit<ResourceLink, 'id' | 'addedAt'>): Promise<ResourceLink> => {
    const response = await api.post(`/projects/${projectId}/links`, resourceLink);
    return response.data;
  },

  updateResourceLink: async (_projectId: string, _linkId: string, _updates: Partial<ResourceLink>): Promise<ResourceLink> => {
    throw new Error('Update link not implemented on backend yet');
  },

  deleteResourceLink: async (projectId: string, linkId: string): Promise<void> => {
    await api.delete(`/projects/${projectId}/links/${linkId}`);
  }
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projectsAPI = {
  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  createProject: async (projectData: any) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },
  getProject: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  updateProject: async (id: string, updates: any) => {
    const response = await api.put(`/projects/${id}`, updates);
    return response.data;
  },
  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
  addTodo: async (projectId: string, todoData: any) => {
    const response = await api.post(`/projects/${projectId}/todos`, todoData);
    return response.data;
  },
  updateTodo: async (projectId: string, todoId: string, updates: any) => {
    const response = await api.put(`/projects/${projectId}/todos/${todoId}`, updates);
    return response.data;
  },
  deleteTodo: async (projectId: string, todoId: string) => {
    const response = await api.delete(`/projects/${projectId}/todos/${todoId}`);
    return response.data;
  },

  /**
   * Upload a real file to the backend (which stores it in Supabase)
   * Uses multipart/form-data
   */
  uploadDocument: async (
    projectId: string,
    file: File,
    type: string,
    onProgress?: (percent: number) => void
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await api.post(`/projects/${projectId}/documents/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 min for large files
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      }
    });
    return response.data;
  },

  /**
   * Metadata-only document add (fallback / backward compat)
   */
  addDocument: async (projectId: string, docData: any) => {
    const response = await api.post(`/projects/${projectId}/documents`, docData);
    return response.data;
  },

  deleteDocument: async (projectId: string, docId: string) => {
    const response = await api.delete(`/projects/${projectId}/documents/${docId}`);
    return response.data;
  }
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  }
};

// Export axios instance for other API calls
export default api;

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
}