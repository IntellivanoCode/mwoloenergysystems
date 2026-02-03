import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';

// Clés de stockage
const TOKEN_KEY = 'staff_auth_token';
const REFRESH_TOKEN_KEY = 'staff_refresh_token';

// Instance Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs et refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        if (refreshToken) {
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
            { refresh: refreshToken }
          );
          
          const { access } = response.data;
          await SecureStore.setItemAsync(TOKEN_KEY, access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Supprimer les tokens si le refresh échoue
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      }
    }
    
    return Promise.reject(error);
  }
);

// Service API
const staffApiService = {
  // Token management
  setTokens: async (access: string, refresh: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, access);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh);
  },
  
  getToken: async () => {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },
  
  clearTokens: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
  
  // ========== AUTHENTIFICATION ==========
  login: async (username: string, password: string) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { username, password });
    if (response.data.access && response.data.refresh) {
      await staffApiService.setTokens(response.data.access, response.data.refresh);
    }
    return response.data;
  },
  
  logout: async () => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      await staffApiService.clearTokens();
    }
  },
  
  getProfile: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },
  
  changePassword: async (data: { current_password: string; new_password: string }) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    return response.data;
  },
  
  // ========== FILE D'ATTENTE ==========
  getQueueStatus: async () => {
    const response = await apiClient.get(API_ENDPOINTS.QUEUE.STATUS);
    return response.data;
  },
  
  getQueueTickets: async (params?: any) => {
    const response = await apiClient.get(API_ENDPOINTS.QUEUE.TICKETS, { params });
    return response.data;
  },
  
  callNextTicket: async (counterId?: number) => {
    const response = await apiClient.post(API_ENDPOINTS.QUEUE.CALL_NEXT, { counter_id: counterId });
    return response.data;
  },
  
  completeTicket: async (ticketId: number, data?: { notes?: string; outcome?: string }) => {
    const response = await apiClient.post(API_ENDPOINTS.QUEUE.COMPLETE_TICKET(ticketId), data);
    return response.data;
  },
  
  cancelTicket: async (ticketId: number, reason?: string) => {
    const response = await apiClient.post(API_ENDPOINTS.QUEUE.CANCEL_TICKET(ticketId), { reason });
    return response.data;
  },
  
  transferTicket: async (ticketId: number, data: { target_service: string; reason?: string }) => {
    const response = await apiClient.post(API_ENDPOINTS.QUEUE.TRANSFER_TICKET(ticketId), data);
    return response.data;
  },
  
  // ========== RENDEZ-VOUS ==========
  getAppointments: async (params?: any) => {
    const response = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.LIST, { params });
    return response.data;
  },
  
  getTodayAppointments: async () => {
    const response = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.TODAY);
    return response.data;
  },
  
  getAppointmentDetail: async (id: number) => {
    const response = await apiClient.get(API_ENDPOINTS.APPOINTMENTS.DETAIL(id));
    return response.data;
  },
  
  checkInAppointment: async (id: number) => {
    const response = await apiClient.post(API_ENDPOINTS.APPOINTMENTS.CHECK_IN(id));
    return response.data;
  },
  
  completeAppointment: async (id: number, data?: { notes?: string }) => {
    const response = await apiClient.post(API_ENDPOINTS.APPOINTMENTS.COMPLETE(id), data);
    return response.data;
  },
  
  cancelAppointment: async (id: number, reason: string) => {
    const response = await apiClient.post(API_ENDPOINTS.APPOINTMENTS.CANCEL(id), { reason });
    return response.data;
  },
  
  // ========== CLIENTS ==========
  getClients: async (params?: any) => {
    const response = await apiClient.get(API_ENDPOINTS.CLIENTS.LIST, { params });
    return response.data;
  },
  
  searchClients: async (query: string) => {
    const response = await apiClient.get(API_ENDPOINTS.CLIENTS.SEARCH, { params: { q: query } });
    return response.data;
  },
  
  getClientDetail: async (id: number) => {
    const response = await apiClient.get(API_ENDPOINTS.CLIENTS.DETAIL(id));
    return response.data;
  },
  
  createClient: async (data: any) => {
    const response = await apiClient.post(API_ENDPOINTS.CLIENTS.CREATE, data);
    return response.data;
  },
  
  updateClient: async (id: number, data: any) => {
    const response = await apiClient.patch(API_ENDPOINTS.CLIENTS.UPDATE(id), data);
    return response.data;
  },
  
  // ========== FACTURATION ==========
  getInvoices: async (params?: any) => {
    const response = await apiClient.get(API_ENDPOINTS.BILLING.INVOICES, { params });
    return response.data;
  },
  
  getInvoiceDetail: async (id: number) => {
    const response = await apiClient.get(API_ENDPOINTS.BILLING.INVOICE_DETAIL(id));
    return response.data;
  },
  
  createPayment: async (data: { invoice_id: number; amount: number; method: string; reference?: string }) => {
    const response = await apiClient.post(API_ENDPOINTS.BILLING.CREATE_PAYMENT, data);
    return response.data;
  },
  
  getPayments: async (params?: any) => {
    const response = await apiClient.get(API_ENDPOINTS.BILLING.PAYMENTS, { params });
    return response.data;
  },
  
  getPaymentReceipt: async (id: number) => {
    const response = await apiClient.get(API_ENDPOINTS.BILLING.RECEIPT(id));
    return response.data;
  },
  
  // ========== COMPTEURS ==========
  getMeters: async (params?: any) => {
    const response = await apiClient.get(API_ENDPOINTS.METERS.LIST, { params });
    return response.data;
  },
  
  getMeterDetail: async (id: number) => {
    const response = await apiClient.get(API_ENDPOINTS.METERS.DETAIL(id));
    return response.data;
  },
  
  getMeterReadings: async (params?: any) => {
    const response = await apiClient.get(API_ENDPOINTS.METERS.READINGS, { params });
    return response.data;
  },
  
  createMeterReading: async (data: { meter_id: number; reading: number; date?: string; photo?: string }) => {
    const response = await apiClient.post(API_ENDPOINTS.METERS.CREATE_READING, data);
    return response.data;
  },
  
  // ========== SUPPORT ==========
  getTickets: async (params?: any) => {
    const response = await apiClient.get(API_ENDPOINTS.SUPPORT.TICKETS, { params });
    return response.data;
  },
  
  getTicketDetail: async (id: number) => {
    const response = await apiClient.get(API_ENDPOINTS.SUPPORT.TICKET_DETAIL(id));
    return response.data;
  },
  
  assignTicket: async (id: number, staffId?: number) => {
    const response = await apiClient.post(API_ENDPOINTS.SUPPORT.ASSIGN(id), { staff_id: staffId });
    return response.data;
  },
  
  respondToTicket: async (id: number, message: string) => {
    const response = await apiClient.post(API_ENDPOINTS.SUPPORT.RESPOND(id), { message });
    return response.data;
  },
  
  closeTicket: async (id: number, resolution?: string) => {
    const response = await apiClient.post(API_ENDPOINTS.SUPPORT.CLOSE(id), { resolution });
    return response.data;
  },
  
  // ========== AGENCES ==========
  getAgencies: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AGENCIES.LIST);
    return response.data;
  },
  
  getAgencyServices: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AGENCIES.SERVICES);
    return response.data;
  },
  
  getAgencyCounters: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AGENCIES.COUNTERS);
    return response.data;
  },
  
  // ========== STATISTIQUES ==========
  getDashboardStats: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.DASHBOARD);
    return response.data;
  },
  
  getQueueStats: async (params?: any) => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.QUEUE_STATS, { params });
    return response.data;
  },
  
  getPerformanceStats: async (params?: any) => {
    const response = await apiClient.get(API_ENDPOINTS.STATS.PERFORMANCE, { params });
    return response.data;
  },
};

export default staffApiService;
