/**
 * Mwolo Energy Systems - Mobile Agency API Service
 * Service API centralisé pour l'application mobile agence
 */

import { Platform } from 'react-native';
import storage from '../utils/storage';

// Configuration API
const DEV_API_URL = Platform.select({
  android: 'http://10.0.2.2:8000',
  ios: 'http://localhost:8000',
  web: 'http://localhost:8000',
  default: 'http://192.168.1.100:8000',
});

const PROD_API_URL = 'https://mwolo-api.onrender.com';

// URL de l'API - utilise la variable d'env si disponible
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || (__DEV__ ? DEV_API_URL : PROD_API_URL);

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Obtenir le token d'authentification
  private async getAuthToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await storage.getItem('auth_token');
    }
    return this.token;
  }

  // Définir le token
  async setToken(token: string | null) {
    this.token = token;
    if (token) {
      await storage.setItem('auth_token', token);
    } else {
      await storage.removeItem('auth_token');
    }
  }

  // Méthode générique pour les requêtes
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: `HTTP ${response.status}`,
          message: errorData.detail || errorData.message || response.statusText,
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Erreur réseau',
      };
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Clear authentication
  async clearAuth() {
    this.token = null;
    await storage.removeItem('auth_token');
    await storage.removeItem('user');
    await storage.removeItem('agency');
  }
}

export const apiService = new ApiService();
export { API_BASE_URL };
