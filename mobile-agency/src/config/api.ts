// API Configuration pour l'application Agency Mwolo Energy Systems
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// URL de l'API - à changer selon l'environnement
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.100:8000/api'  // Localhost en dev (changer selon votre IP)
  : 'https://api.mwolo-energy.com/api';  // Production

// Créer instance Axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Erreur récupération token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs et le refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si 401 et pas déjà réessayé
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          await SecureStore.setItemAsync('access_token', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh échoué - déconnecter
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
        await SecureStore.deleteItemAsync('user_data');
      }
    }

    return Promise.reject(error);
  }
);

// ============= API ENDPOINTS =============

// Auth
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/token/', credentials),
  
  loginWithBadge: (badgeCode: string) =>
    api.post('/hr/employees/badge_login/', { badge_code: badgeCode }),
  
  refresh: (refreshToken: string) =>
    api.post('/token/refresh/', { refresh: refreshToken }),
  
  me: () => api.get('/accounts/me/'),
  
  logout: () => api.post('/accounts/logout/'),
};

// Agences
export const agencyAPI = {
  list: () => api.get('/agencies/'),
  get: (id: string) => api.get(`/agencies/${id}/`),
  getConfig: (id: string) => api.get(`/agencies/${id}/config/`),
  setConfig: (id: string, data: any) => api.post(`/agencies/${id}/config/`, data),
};

// Queue Management
export const queueAPI = {
  getTickets: (agencyId: string) => api.get(`/operations/queue/by_agency/?agency_id=${agencyId}`),
  createTicket: (data: any) => api.post('/operations/queue/', data),
  callNext: (ticketId: string, counterId: number) => 
    api.post(`/operations/queue/${ticketId}/call_next/`, { counter_id: counterId }),
  complete: (ticketId: string, data?: any) => 
    api.post(`/operations/queue/${ticketId}/complete/`, data),
  cancel: (ticketId: string) => api.post(`/operations/queue/${ticketId}/cancel/`),
  getStats: (agencyId: string) => api.get(`/operations/queue/stats/?agency_id=${agencyId}`),
};

// Clients
export const clientAPI = {
  list: (params?: any) => api.get('/crm/clients/', { params }),
  get: (id: string) => api.get(`/crm/clients/${id}/`),
  create: (data: any) => api.post('/crm/clients/', data),
  update: (id: string, data: any) => api.patch(`/crm/clients/${id}/`, data),
  search: (query: string) => api.get(`/crm/clients/search/?q=${encodeURIComponent(query)}`),
  activate: (id: string, serviceData: any) => 
    api.post(`/crm/clients/${id}/activate_service/`, serviceData),
};

// Services
export const serviceAPI = {
  list: () => api.get('/cms/services/'),
  get: (id: string) => api.get(`/cms/services/${id}/`),
};

// Appointments
export const appointmentAPI = {
  list: (params?: any) => api.get('/operations/appointments/', { params }),
  get: (id: string) => api.get(`/operations/appointments/${id}/`),
  create: (data: any) => api.post('/operations/appointments/', data),
  update: (id: string, data: any) => api.patch(`/operations/appointments/${id}/`, data),
  cancel: (id: string) => api.post(`/operations/appointments/${id}/cancel/`),
  confirm: (id: string) => api.post(`/operations/appointments/${id}/confirm/`),
  getAvailableSlots: (agencyId: string, date: string) => 
    api.get(`/operations/appointments/available_slots/?agency_id=${agencyId}&date=${date}`),
};

// Employees
export const employeeAPI = {
  list: (params?: any) => api.get('/hr/employees/', { params }),
  get: (id: string) => api.get(`/hr/employees/${id}/`),
  getByAgency: (agencyId: string) => 
    api.get(`/hr/employees/by_agency/?agency_id=${agencyId}`),
  clockIn: (data: any) => api.post('/hr/attendance/clock_in/', data),
  clockOut: (data: any) => api.post('/hr/attendance/clock_out/', data),
};

// Billing
export const billingAPI = {
  createInvoice: (data: any) => api.post('/billing/invoices/', data),
  getInvoice: (id: string) => api.get(`/billing/invoices/${id}/`),
  processPayment: (invoiceId: string, data: any) => 
    api.post(`/billing/invoices/${invoiceId}/pay/`, data),
};

// Support
export const supportAPI = {
  createTicket: (data: any) => api.post('/support/tickets/', data),
  getTickets: (params?: any) => api.get('/support/tickets/', { params }),
};

export default api;
