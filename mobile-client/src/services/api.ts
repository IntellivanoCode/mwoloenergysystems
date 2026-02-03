import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config/api';

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token
    this.api.interceptors.request.use(
      async (config) => {
        if (!this.token) {
          this.token = await SecureStore.getItemAsync('authToken');
        }
        if (this.token) {
          config.headers.Authorization = `Token ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur pour gérer les erreurs
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expiré ou invalide
          await this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(username: string, password: string) {
    const response = await this.api.post('/api/accounts/login/', { username, password });
    if (response.data.token) {
      this.token = response.data.token;
      await SecureStore.setItemAsync('authToken', response.data.token);
      await SecureStore.setItemAsync('userData', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async register(data: { 
    username: string; 
    email: string; 
    password: string; 
    first_name: string; 
    last_name: string;
    phone?: string;
  }) {
    const response = await this.api.post('/api/accounts/register/', data);
    return response.data;
  }

  async logout() {
    try {
      await this.api.post('/api/accounts/logout/');
    } catch (e) {
      // Ignorer les erreurs de logout
    }
    this.token = null;
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('userData');
  }

  async getProfile() {
    const response = await this.api.get('/api/accounts/profile/');
    return response.data;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await SecureStore.getItemAsync('authToken');
    return !!token;
  }

  async getStoredUser() {
    const userData = await SecureStore.getItemAsync('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Client Info
  async getClientInfo() {
    const response = await this.api.get('/api/crm/clients/me/');
    return response.data;
  }

  // Factures
  async getInvoices(params?: { status?: string; page?: number }) {
    const response = await this.api.get('/api/billing/invoices/', { params });
    return response.data;
  }

  async getInvoiceDetail(id: number) {
    const response = await this.api.get(`/api/billing/invoices/${id}/`);
    return response.data;
  }

  // Paiements
  async getPayments(params?: { page?: number }) {
    const response = await this.api.get('/api/billing/payments/', { params });
    return response.data;
  }

  async initiatePayment(data: { invoice_id: number; amount: number; method: string }) {
    const response = await this.api.post('/api/billing/payments/initiate/', data);
    return response.data;
  }

  // Consommation
  async getConsumption(params?: { period?: string }) {
    const response = await this.api.get('/api/billing/consumption/', { params });
    return response.data;
  }

  // Support Tickets
  async getTickets(params?: { status?: string; page?: number }) {
    const response = await this.api.get('/api/support/tickets/', { params });
    return response.data;
  }

  async createTicket(data: { subject: string; description: string; category: string; priority?: string }) {
    const response = await this.api.post('/api/support/tickets/', data);
    return response.data;
  }

  async getTicketDetail(id: number) {
    const response = await this.api.get(`/api/support/tickets/${id}/`);
    return response.data;
  }

  // Agences
  async getAgencies(params?: { city?: string; is_active?: boolean }) {
    const response = await this.api.get('/api/agencies/', { params });
    return response.data;
  }

  async getAgencyDetail(id: number) {
    const response = await this.api.get(`/api/agencies/${id}/`);
    return response.data;
  }

  // RDV
  async getAppointments(params?: { status?: string; page?: number }) {
    const response = await this.api.get('/api/appointments/', { params });
    return response.data;
  }

  async createAppointment(data: { 
    agency: number; 
    date: string; 
    time: string; 
    service_type: string;
    notes?: string;
  }) {
    const response = await this.api.post('/api/appointments/', data);
    return response.data;
  }

  async cancelAppointment(id: number) {
    const response = await this.api.post(`/api/appointments/${id}/cancel/`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
