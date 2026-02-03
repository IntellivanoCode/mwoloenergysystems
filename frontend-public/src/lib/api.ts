/**
 * Mwolo Energy Systems - API Library
 * Frontend Public + Client
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const STORAGE_KEYS = {
  ACCESS: 'mwolo_access_token',
  REFRESH: 'mwolo_refresh_token',
  USER: 'mwolo_user_data',
};

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

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

function extractData<T>(data: T[] | PaginatedResponse<T>): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && 'results' in data) return data.results;
  return [];
}

export function setTokens(access: string, refresh: string, user?: UserData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACCESS, access);
  localStorage.setItem(STORAGE_KEYS.REFRESH, refresh);
  if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
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

export function isClient(): boolean {
  return getUserRole() === 'client';
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

    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, { headers, ...options });

    if (!response.ok) {
      return { error: `HTTP ${response.status}`, message: `Erreur: ${response.statusText}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: 'Network Error', message: error instanceof Error ? error.message : 'Erreur réseau' };
  }
}

// Auth
export async function login(email: string, password: string) {
  return apiCall<{ access: string; refresh: string; user: UserData }>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(userData: Record<string, unknown>) {
  return apiCall('/auth/register/', { method: 'POST', body: JSON.stringify(userData) });
}

export async function fetchCurrentUser() {
  return apiCall<UserData>('/auth/me/');
}

// CMS
export async function getServices() {
  const response = await apiCall<unknown>('/cms/services/');
  if (response.data) response.data = extractData(response.data as unknown[]);
  return response;
}

export async function getTestimonials() {
  const response = await apiCall<unknown>('/cms/testimonials/');
  if (response.data) response.data = extractData(response.data as unknown[]);
  return response;
}

export async function getBlogPosts() {
  const response = await apiCall<unknown>('/cms/blog/');
  if (response.data) response.data = extractData(response.data as unknown[]);
  return response;
}

export async function getPartners() {
  const response = await apiCall<unknown>('/cms/partners/');
  if (response.data) response.data = extractData(response.data as unknown[]);
  return response;
}

// Agencies
export async function getAgencies() {
  return apiCall('/agencies/?is_active=true');
}

// HR - Key staff pour la page équipe
export async function getKeyStaff() {
  return apiCall('/hr/employees/key_staff/');
}

// CRM - Leads
export async function createLead(leadData: Record<string, unknown>) {
  return apiCall('/cms/leads/', { method: 'POST', body: JSON.stringify(leadData) });
}

// Client - Factures
export async function getInvoices() {
  return apiCall('/billing/invoices/');
}

export async function getPayments() {
  return apiCall('/billing/payments/');
}

// Appointments
export async function getAppointments() {
  return apiCall('/operations/appointments/');
}

export async function createAppointment(data: Record<string, unknown>) {
  return apiCall('/operations/appointments/', { method: 'POST', body: JSON.stringify(data) });
}

export async function getAvailableSlots(agencyId: string, date: string) {
  return apiCall(`/operations/appointments/available_slots/?agency=${agencyId}&date=${date}`);
}
