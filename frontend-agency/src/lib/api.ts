/**
 * Mwolo Energy Systems - API Library
 * Frontend Agency (Bornes, Tablettes, Écrans d'affichage)
 * 
 * API simplifiée pour les outils en agence - pas d'authentification utilisateur
 * Authentification par badge employé ou token agence
 */

// Production API URL - fallback si NEXT_PUBLIC_API_URL n'est pas défini
const PROD_API_URL = 'https://mwolo-api.onrender.com/api';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || PROD_API_URL;

const STORAGE_KEYS = {
  AGENCY_TOKEN: 'mwolo_agency_token',
  AGENCY_ID: 'mwolo_agency_id',
  COUNTER_ID: 'mwolo_counter_id',
  EMPLOYEE_BADGE: 'mwolo_employee_badge',
  ACCESS_TOKEN: 'mwolo_access_token',
  REFRESH_TOKEN: 'mwolo_refresh_token',
  USER: 'mwolo_user',
};

// ==================== AUTH ====================
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  post_name?: string;
  role: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export function setTokens(access: string, refresh: string, user: User) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  clearAgencyConfig();
}

export async function login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: 'AUTH_FAILED', message: errorData.detail || 'Identifiants incorrects' };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: 'NETWORK_ERROR', message: error instanceof Error ? error.message : 'Erreur réseau' };
  }
}

export async function loginWithBadge(badgeCode: string): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/hr/employees/badge_login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ badge_code: badgeCode }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: 'BADGE_INVALID', message: errorData.detail || 'Code badge invalide' };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: 'NETWORK_ERROR', message: error instanceof Error ? error.message : 'Erreur réseau' };
  }
}

export interface AgencyConfig {
  agency_id: string;
  agency_name: string;
  agency_code: string;
  counter_id?: string;
  counter_name?: string;
}

export interface QueueTicket {
  id: string;
  ticket_number: string;
  service_type: string;
  service_name: string;
  status: 'waiting' | 'called' | 'serving' | 'completed' | 'cancelled';
  client_name?: string;
  counter?: string;
  counter_name?: string;
  created_at: string;
  called_at?: string;
  position?: number;
}

// Configuration de l'agence
export function setAgencyConfig(config: AgencyConfig) {
  if (typeof window === 'undefined') return;
  if (config.agency_id) localStorage.setItem(STORAGE_KEYS.AGENCY_ID, config.agency_id);
  if (config.counter_id) localStorage.setItem(STORAGE_KEYS.COUNTER_ID, config.counter_id);
}

export function getAgencyId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.AGENCY_ID);
}

export function getCounterId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.COUNTER_ID);
}

export function setEmployeeBadge(badgeCode: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.EMPLOYEE_BADGE, badgeCode);
}

export function getEmployeeBadge(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.EMPLOYEE_BADGE);
}

export function clearAgencyConfig() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.AGENCY_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.AGENCY_ID);
  localStorage.removeItem(STORAGE_KEYS.COUNTER_ID);
  localStorage.removeItem(STORAGE_KEYS.EMPLOYEE_BADGE);
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const badge = getEmployeeBadge();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Authentification par badge si disponible
    if (badge) headers['X-Employee-Badge'] = badge;

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

// ==================== AGENCIES ====================
export async function getAgencies() {
  const response = await apiCall<any>('/agencies/?is_active=true');
  // Handle paginated response
  if (response.data) {
    const data = response.data;
    // If response is paginated (has results array)
    if (data.results && Array.isArray(data.results)) {
      return { data: data.results };
    }
    // If response is already an array
    if (Array.isArray(data)) {
      return { data };
    }
    // Return empty array if unexpected format
    return { data: [] };
  }
  return response;
}

export async function getAgency(id: string) {
  return apiCall(`/agencies/${id}/`);
}

export async function getAgencyServices(agencyId: string) {
  return apiCall(`/agencies/${agencyId}/services/`);
}

// ==================== QUEUE / FILE D'ATTENTE ====================
// API File d'attente se trouve dans /api/appointments/queue/

// Helper pour extraire les données d'une réponse paginée ou directe
function extractResults<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.results && Array.isArray(data.results)) return data.results;
  return [];
}

// Pour la BORNE TICKET - Créer un nouveau ticket
export async function createQueueTicket(data: { 
  agency: string; 
  service_type: string; 
  client_name?: string;
  appointment_id?: string;
}) {
  return apiCall<QueueTicket>('/appointments/queue/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Pour le MONITEUR - Récupérer les tickets en attente
export async function getWaitingTickets(agencyId: string) {
  const result = await apiCall<any>(`/appointments/queue/?agency=${agencyId}&status=waiting,called`);
  if (result.data) {
    return { data: extractResults<QueueTicket>(result.data) };
  }
  return { data: [] as QueueTicket[], error: result.error };
}

// Pour le MONITEUR - Récupérer le ticket en cours d'appel
export async function getCalledTickets(agencyId: string) {
  const result = await apiCall<any>(`/appointments/queue/?agency=${agencyId}&status=called`);
  if (result.data) {
    return { data: extractResults<QueueTicket>(result.data) };
  }
  return { data: [] as QueueTicket[], error: result.error };
}

// Pour le GUICHET - Appeler le prochain client
export async function callNextTicket(agencyId: string, counterId: string) {
  return apiCall<QueueTicket>('/appointments/queue/call_next/', {
    method: 'POST',
    body: JSON.stringify({ agency: agencyId, counter: counterId }),
  });
}

// Pour le GUICHET - Marquer un ticket comme terminé
export async function completeTicket(ticketId: string) {
  return apiCall(`/appointments/queue/${ticketId}/complete/`, { method: 'POST' });
}

// Pour le GUICHET - Rappeler un ticket (client absent)
export async function recallTicket(ticketId: string) {
  return apiCall(`/appointments/queue/${ticketId}/recall/`, { method: 'POST' });
}

// Pour le GUICHET - Transférer à un autre guichet
export async function transferTicket(ticketId: string, newCounterId: string) {
  return apiCall(`/appointments/queue/${ticketId}/transfer/`, {
    method: 'POST',
    body: JSON.stringify({ counter: newCounterId }),
  });
}

// ==================== APPOINTMENTS / RDV ====================

// Pour la prise de RDV sur place
export async function getTodayAppointments(agencyId: string) {
  const today = new Date().toISOString().split('T')[0];
  return apiCall(`/operations/appointments/?agency=${agencyId}&date=${today}`);
}

export async function getAvailableSlots(agencyId: string, date: string) {
  return apiCall(`/operations/appointments/available_slots/?agency=${agencyId}&date=${date}`);
}

export async function createWalkInAppointment(data: {
  agency: string;
  service_type: string;
  client_name: string;
  client_phone?: string;
  date: string;
  time_slot: string;
}) {
  return apiCall('/operations/appointments/', {
    method: 'POST',
    body: JSON.stringify({ ...data, is_walk_in: true }),
  });
}

// Convertir un RDV en ticket de file d'attente
export async function checkInAppointment(appointmentId: string) {
  return apiCall<QueueTicket>(`/operations/appointments/${appointmentId}/check_in/`, {
    method: 'POST',
  });
}

// ==================== EMPLOYEE BADGE AUTH ====================

// Valider un badge employé (pour activer les outils)
export async function validateBadge(badgeCode: string) {
  return apiCall<{ valid: boolean; employee_name: string; agency_id: string }>('/hr/employees/validate_badge/', {
    method: 'POST',
    body: JSON.stringify({ badge_code: badgeCode }),
  });
}

// ==================== STATS ====================

// Stats temps réel pour le moniteur
export async function getQueueStats(agencyId: string) {
  return apiCall<{
    waiting_count: number;
    average_wait_time: number;
    serving_count: number;
    completed_today: number;
  }>(`/appointments/queue/stats/?agency=${agencyId}`);
}
/ /   B u i l d :   2 0 2 6 - 0 2 - 0 4   0 1 : 4 0 : 1 8  
 