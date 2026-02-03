const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const STORAGE_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  USER: 'user_data',
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
  role: 'admin' | 'manager' | 'accountant' | 'hr' | 'commercial' | 'technician' | 'employee' | 'client';
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
  return hasRole(['admin', 'manager']);
}

export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAccessToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
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

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Auth endpoints
export async function login(email: string, password: string) {
  return apiCall('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(userData: any) {
  return apiCall('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function fetchCurrentUser() {
  return apiCall('/auth/me/');
}

// CMS endpoints - Dynamique (avec gestion pagination)
export async function getPages() {
  const response = await apiCall<any>('/cms/pages/');
  if (response.data) {
    response.data = extractData(response.data);
  }
  return response;
}

export async function getPage(slug: string) {
  return apiCall(`/cms/pages/${slug}/`);
}

export async function getBlogPosts() {
  const response = await apiCall<any>('/cms/blog/');
  if (response.data) {
    response.data = extractData(response.data);
  }
  return response;
}

export async function getBlogPost(slug: string) {
  return apiCall(`/cms/blog/${slug}/`);
}

export async function getServices() {
  const response = await apiCall<any>('/cms/services/');
  if (response.data) {
    response.data = extractData(response.data);
  }
  return response;
}

export async function getTestimonials() {
  const response = await apiCall<any>('/cms/testimonials/');
  if (response.data) {
    response.data = extractData(response.data);
  }
  return response;
}

export async function getGalleries() {
  const response = await apiCall<any>('/cms/galleries/');
  if (response.data) {
    response.data = extractData(response.data);
  }
  return response;
}

// Agencies endpoints
export async function getAgencies() {
  return apiCall('/agencies/?is_active=true');
}

// HR endpoints - Employés
export async function getEmployees() {
  return apiCall('/hr/employees/');
}

export async function getEmployee(id: string) {
  return apiCall(`/hr/employees/${id}/`);
}

// CRM endpoints
export async function getClients(token?: string) {
  return apiCall('/crm/clients/', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function createLead(leadData: any) {
  return apiCall('/cms/leads/', {
    method: 'POST',
    body: JSON.stringify(leadData),
  });
}

// Partners endpoints
export async function getPartners() {
  const response = await apiCall<any>('/cms/partners/');
  if (response.data) {
    response.data = extractData(response.data);
  }
  return response;
}
