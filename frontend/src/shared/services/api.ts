import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../constants';
import type {
  ApiResponse,
  HealthQuery,
  CBTRecommendation,
  ShifaGuidance,
  KnowledgeBaseItem,
  HealthMetrics,
  CBTExercise,
  Dua,
  PropheticMedicine,
} from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add authentication token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any) {
    if (error.response) {
      // Server responded with error status
      return {
        code: error.response.status,
        message: error.response.data?.message || 'Server error occurred',
        details: error.response.data,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error - please check your connection',
        details: error.request,
      };
    } else {
      // Something else happened
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message || 'An unexpected error occurred',
        details: error,
      };
    }
  }

  // Health & System
  async healthCheck(): Promise<ApiResponse> {
    const response = await this.client.get(API_ENDPOINTS.HEALTH_CHECK);
    return response.data;
  }

  // Medical Services
  async askHealthQuestion(query: HealthQuery): Promise<ApiResponse> {
    const response = await this.client.post(API_ENDPOINTS.MEDICAL_ASK, query);
    return response.data;
  }

  async searchKnowledgeBase(
    q: string,
    options?: {
      category?: string;
      limit?: number;
    }
  ): Promise<ApiResponse<KnowledgeBaseItem[]>> {
    const params = { q, ...options };
    const response = await this.client.get(API_ENDPOINTS.KNOWLEDGE_SEARCH, { params });
    return response.data;
  }

  async getKnowledgeCategories(): Promise<ApiResponse<string[]>> {
    const response = await this.client.get(API_ENDPOINTS.KNOWLEDGE_CATEGORIES);
    return response.data;
  }

  async getRandomFAQs(
    count: number = 3,
    category?: string
  ): Promise<ApiResponse<KnowledgeBaseItem[]>> {
    const params = { count, ...(category && { category }) };
    const response = await this.client.get(API_ENDPOINTS.KNOWLEDGE_RANDOM, { params });
    return response.data;
  }

  // CBT Services
  async getCBTRecommendation(
    query: string,
    moodLevel?: number
  ): Promise<ApiResponse<CBTRecommendation>> {
    const response = await this.client.post(API_ENDPOINTS.CBT_RECOMMENDATION, {
      query,
      mood_level: moodLevel,
    });
    return response.data;
  }

  async getRandomCBTExercise(
    exerciseType?: string
  ): Promise<ApiResponse<CBTExercise>> {
    const params = exerciseType ? { exercise_type: exerciseType } : {};
    const response = await this.client.get(API_ENDPOINTS.CBT_EXERCISE, { params });
    return response.data;
  }

  async getDailyCBTTip(): Promise<ApiResponse<string>> {
    const response = await this.client.get(API_ENDPOINTS.CBT_DAILY_TIP);
    return response.data;
  }

  // Shifa Services
  async getShifaGuidance(
    query: string,
    category?: string
  ): Promise<ApiResponse<ShifaGuidance>> {
    const response = await this.client.post(API_ENDPOINTS.SHIFA_GUIDANCE, {
      query,
      category,
    });
    return response.data;
  }

  async getHealingDua(category?: string): Promise<ApiResponse<Dua>> {
    const params = category ? { category } : {};
    const response = await this.client.get(API_ENDPOINTS.SHIFA_DUA, { params });
    return response.data;
  }

  async getPropheticMedicine(
    condition?: string
  ): Promise<ApiResponse<PropheticMedicine>> {
    const params = condition ? { condition } : {};
    const response = await this.client.get(API_ENDPOINTS.SHIFA_PROPHETIC_MEDICINE, { params });
    return response.data;
  }

  // Admin Services
  async getAdminStats(): Promise<ApiResponse<HealthMetrics>> {
    const response = await this.client.get(API_ENDPOINTS.ADMIN_STATS);
    return response.data;
  }
}

// Create singleton instance
export const apiService = new ApiService();
export default apiService; 