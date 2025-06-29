import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface HealthQuery {
  question: string;
  include_cbt?: boolean;
  include_shifa?: boolean;
  user_id?: string;
}

export interface CBTRequest {
  query: string;
  mood_level?: number;
}

export interface ShifaRequest {
  query: string;
  category?: string;
}

export interface HealthResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
  request_id?: string;
}

export const apiService = {
  // Health check
  healthCheck: async (): Promise<any> => {
    const response = await api.get('/health');
    return response.data;
  },

  // Main health query
  askHealthQuestion: async (query: HealthQuery): Promise<HealthResponse> => {
    const response = await api.post('/medical/ask', query);
    return response.data as HealthResponse;
  },

  // CBT endpoints
  getCBTRecommendation: async (request: CBTRequest): Promise<HealthResponse> => {
    const response = await api.post('/cbt/recommendation', request);
    return response.data as HealthResponse;
  },

  getRandomCBTExercise: async (exercise_type?: string): Promise<HealthResponse> => {
    const params = exercise_type ? { exercise_type } : {};
    const response = await api.get('/cbt/exercise', { params });
    return response.data as HealthResponse;
  },

  getDailyCBTTip: async (): Promise<HealthResponse> => {
    const response = await api.get('/cbt/daily-tip');
    return response.data as HealthResponse;
  },

  // Shifa endpoints
  getShifaGuidance: async (request: ShifaRequest): Promise<HealthResponse> => {
    const response = await api.post('/shifa/guidance', request);
    return response.data as HealthResponse;
  },

  getHealingDua: async (category?: string): Promise<HealthResponse> => {
    const params = category ? { category } : {};
    const response = await api.get('/shifa/dua', { params });
    return response.data as HealthResponse;
  },

  getPropheticMedicine: async (condition?: string): Promise<HealthResponse> => {
    const params = condition ? { condition } : {};
    const response = await api.get('/shifa/prophetic-medicine', { params });
    return response.data as HealthResponse;
  },

  // Knowledge base endpoints
  searchKnowledgeBase: async (q: string, category?: string, limit: number = 5): Promise<HealthResponse> => {
    const params = { q, limit, ...(category && { category }) };
    const response = await api.get('/knowledge/search', { params });
    return response.data as HealthResponse;
  },

  getKnowledgeCategories: async (): Promise<HealthResponse> => {
    const response = await api.get('/knowledge/categories');
    return response.data as HealthResponse;
  },

  getRandomFAQs: async (count: number = 3, category?: string): Promise<HealthResponse> => {
    const params = { count, ...(category && { category }) };
    const response = await api.get('/knowledge/random', { params });
    return response.data as HealthResponse;
  },

  // Admin endpoints
  getAdminStats: async (): Promise<HealthResponse> => {
    const response = await api.get('/admin/stats');
    return response.data as HealthResponse;
  },
};

export default api; 