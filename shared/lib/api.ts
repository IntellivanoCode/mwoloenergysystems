/**
 * Mwolo Energy Systems - API Shared Library
 * Fichier partagé entre toutes les applications frontend
 * 
 * IMPORTANT: Ce fichier est copié dans chaque application.
 * Pour les modifications, éditez le fichier source dans /shared/lib/api.ts
 * puis copiez-le dans les 3 applications.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const STORAGE_KEYS = {
  ACCESS: 'mwolo_access_token',
  REFRESH: 'mwolo_refresh_token',
  USER: 'mwolo_user_data',
};

// Interface utilisateur
export interface UserData {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  post_name?: string;
  phone?: string;
  role: 'super_admin' | 'employe' | 'client';
  position?: string;
  agency?: string;
  agency_name?: string;
  agency_code?: string;
}

// Interface pour les réponses paginées Django REST Framework
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Helper pour extraire les données (paginées ou non)
function extractData<T>(data: T[] | PaginatedResponse<T>): T[] {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === 'object' && 'results' in data) {
    return data.results;
  }
  return [];
}

export function setTokens(access: string, refresh: string, user?: UserData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACCESS, access);
  localStorage.setItem(STORAGE_KEYS.REFRESH, refresh);
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.ACCESS);
  localStorage.removeItem(STORAGE_KEYS.REFRESH);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.ACCESS);
}

export function getRefreshToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.REFRESH);
}

export function getCurrentUser(): UserData | null {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userData) return null;
  try {
    return JSON.parse(userData) as UserData;
  } catch {
    return null;
  }
}

export function getUserRole(): string | null {
  const user = getCurrentUser();
  return user?.role || null;
}

export function hasRole(allowedRoles: string[]): boolean {
  const role = getUserRole();
  return role !== null && allowedRoles.includes(role);
}

export function isClient(): boolean {
  return getUserRole() === 'client';
}

export function isEmployee(): boolean {
  const role = getUserRole();
  return role !== null && role !== 'client';
}

export function isAdmin(): boolean {
  return hasRole(['super_admin']);
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAccessToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      headers,
      ...options,
    });

    if (!response.ok) {
      return {
        error: `HTTP ${response.status}`,
        message: `Erreur lors de la requête: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: 'Network Error',
      message: error instanceof Error ? error.message : 'Erreur réseau',
    };
  }
}

// ==================== AUTH ====================
export async function login(email: string, password: string) {
  return apiCall<{ access: string; refresh: string; user: UserData }>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(userData: Record<string, unknown>) {
  return apiCall('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function fetchCurrentUser() {
  return apiCall<UserData>('/auth/me/');
}

// ==================== CMS ====================
export async function getPages() {
  const response = await apiCall<unknown>('/cms/pages/');
  if (response.data) {
    response.data = extractData(response.data as unknown[]);
  }
  return response;
}

export async function getPage(slug: string) {
  return apiCall(`/cms/pages/${slug}/`);
}

export async function getBlogPosts() {
  const response = await apiCall<unknown>('/cms/blog/');
  if (response.data) {
    response.data = extractData(response.data as unknown[]);
  }
  return response;
}

export async function getBlogPost(slug: string) {
  return apiCall(`/cms/blog/${slug}/`);
}

export async function getServices() {
  const response = await apiCall<unknown>('/cms/services/');
  if (response.data) {
    response.data = extractData(response.data as unknown[]);
  }
  return response;
}

export async function getTestimonials() {
  const response = await apiCall<unknown>('/cms/testimonials/');
  if (response.data) {
    response.data = extractData(response.data as unknown[]);
  }
  return response;
}

export async function getGalleries() {
  const response = await apiCall<unknown>('/cms/galleries/');
  if (response.data) {
    response.data = extractData(response.data as unknown[]);
  }
  return response;
}

export async function getPartners() {
  const response = await apiCall<unknown>('/cms/partners/');
  if (response.data) {
    response.data = extractData(response.data as unknown[]);
  }
  return response;
}

// ==================== AGENCIES ====================
export async function getAgencies() {
  return apiCall('/agencies/?is_active=true');
}

export async function getAgency(id: string) {
  return apiCall(`/agencies/${id}/`);
}

// ==================== HR ====================
export async function getEmployees() {
  return apiCall('/hr/employees/');
}

export async function getEmployee(id: string) {
  return apiCall(`/hr/employees/${id}/`);
}

export async function getKeyStaff() {
  return apiCall('/hr/employees/key_staff/');
}

// ==================== CRM ====================
export async function getClients() {
  return apiCall('/crm/clients/');
}

export async function getClient(id: string) {
  return apiCall(`/crm/clients/${id}/`);
}

export async function createLead(leadData: Record<string, unknown>) {
  return apiCall('/cms/leads/', {
    method: 'POST',
    body: JSON.stringify(leadData),
  });
}

// ==================== BILLING ====================
export async function getInvoices() {
  return apiCall('/billing/invoices/');
}

export async function getInvoice(id: string) {
  return apiCall(`/billing/invoices/${id}/`);
}

export async function getPayments() {
  return apiCall('/billing/payments/');
}

// ==================== OPERATIONS ====================
export async function getQueueTickets(agencyId?: string) {
  const url = agencyId ? `/operations/queue/?agency=${agencyId}` : '/operations/queue/';
  return apiCall(url);
}

export async function createQueueTicket(data: { agency: string; service_type: string; client_name?: string }) {
  return apiCall('/operations/queue/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function callNextTicket(agencyId: string, counterId: string) {
  return apiCall('/operations/queue/call_next/', {
    method: 'POST',
    body: JSON.stringify({ agency: agencyId, counter: counterId }),
  });
}

export async function completeTicket(ticketId: string) {
  return apiCall(`/operations/queue/${ticketId}/complete/`, {
    method: 'POST',
  });
}

// ==================== APPOINTMENTS ====================
export async function getAppointments() {
  return apiCall('/operations/appointments/');
}

export async function createAppointment(data: Record<string, unknown>) {
  return apiCall('/operations/appointments/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAvailableSlots(agencyId: string, date: string) {
  return apiCall(`/operations/appointments/available_slots/?agency=${agencyId}&date=${date}`);
}
