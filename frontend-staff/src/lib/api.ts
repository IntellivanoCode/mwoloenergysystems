/**
 * Mwolo Energy Systems - API Library
 * Frontend Staff (Employés & Administrateurs)
 */

// Production API URL - fallback si NEXT_PUBLIC_API_URL n'est pas défini
const PROD_API_URL = 'https://mwolo-api.onrender.com/api';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || PROD_API_URL;

const STORAGE_KEYS = {
  ACCESS: 'mwolo_staff_access_token',
  REFRESH: 'mwolo_staff_refresh_token',
  USER: 'mwolo_staff_user_data',
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

export function isEmployee(): boolean {
  const role = getUserRole();
  return role !== null && role !== 'client';
}

export function isAdmin(): boolean {
  return getUserRole() === 'super_admin';
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

export async function fetchCurrentUser() {
  return apiCall<UserData>('/auth/me/');
}

// HR - Employés
export async function getEmployees() {
  return apiCall('/hr/employees/');
}

export async function getEmployee(id: string) {
  return apiCall(`/hr/employees/${id}/`);
}

export async function getMyProfile() {
  return apiCall('/hr/employees/me/');
}

export async function getMySchedule() {
  return apiCall('/hr/schedules/my_schedule/');
}

export async function getMyPayslips() {
  return apiCall('/hr/payslips/');
}

// Pointage / Attendance
export async function clockIn() {
  return apiCall('/hr/attendance/clock_in/', { method: 'POST' });
}

export async function clockOut() {
  return apiCall('/hr/attendance/clock_out/', { method: 'POST' });
}

export async function getMyAttendance() {
  return apiCall('/hr/attendance/my_attendance/');
}

// Agencies
export async function getAgencies() {
  return apiCall('/agencies/');
}

export async function getAgency(id: string) {
  return apiCall(`/agencies/${id}/`);
}

// CRM - Clients
export async function getClients() {
  return apiCall('/crm/clients/');
}

export async function getClient(id: string) {
  return apiCall(`/crm/clients/${id}/`);
}

// Billing
export async function getInvoices() {
  return apiCall('/billing/invoices/');
}

export async function getPayments() {
  return apiCall('/billing/payments/');
}

// Queue Management
export async function getQueueTickets(agencyId?: string) {
  const url = agencyId ? `/operations/queue/?agency=${agencyId}` : '/operations/queue/';
  return apiCall(url);
}

export async function callNextTicket(agencyId: string, counterId: string) {
  return apiCall('/operations/queue/call_next/', {
    method: 'POST',
    body: JSON.stringify({ agency: agencyId, counter: counterId }),
  });
}

export async function completeTicket(ticketId: string) {
  return apiCall(`/operations/queue/${ticketId}/complete/`, { method: 'POST' });
}

// Appointments
export async function getAppointments(agencyId?: string) {
  const url = agencyId ? `/operations/appointments/?agency=${agencyId}` : '/operations/appointments/';
  return apiCall(url);
}

export async function createWalkInAppointment(data: Record<string, unknown>) {
  return apiCall('/operations/appointments/', { method: 'POST', body: JSON.stringify(data) });
}

// Dashboard stats
export async function getDashboardStats() {
  return apiCall('/core/dashboard/');
}

export async function getAgencyStats(agencyId: string) {
  return apiCall(`/agencies/${agencyId}/stats/`);
}
// Alias for compatibility
export { apiCall as apiRequest };