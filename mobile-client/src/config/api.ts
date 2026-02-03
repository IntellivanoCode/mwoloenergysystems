// Configuration API
// Environnement de développement vs production
const DEV_API_URL = 'http://192.168.1.100:8000'; // IP locale ou émulateur
const PROD_API_URL = 'https://mwolo-api.onrender.com'; // Render Production

// Utilise l'URL de prod si la variable d'env est définie, sinon dev
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || (__DEV__ ? DEV_API_URL : PROD_API_URL);

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/accounts/login/',
  REGISTER: '/api/accounts/register/',
  LOGOUT: '/api/accounts/logout/',
  PROFILE: '/api/accounts/profile/',
  
  // Client
  CLIENT_INFO: '/api/crm/clients/me/',
  
  // Factures
  INVOICES: '/api/billing/invoices/',
  INVOICE_DETAIL: (id: number) => `/api/billing/invoices/${id}/`,
  
  // Paiements
  PAYMENTS: '/api/billing/payments/',
  INITIATE_PAYMENT: '/api/billing/payments/initiate/',
  
  // Consommation
  CONSUMPTION: '/api/billing/consumption/',
  
  // Support
  TICKETS: '/api/support/tickets/',
  CREATE_TICKET: '/api/support/tickets/',
  
  // Agences
  AGENCIES: '/api/agencies/',
  AGENCY_DETAIL: (id: number) => `/api/agencies/${id}/`,
  
  // RDV
  APPOINTMENTS: '/api/appointments/',
  CREATE_APPOINTMENT: '/api/appointments/',
  
  // Queue
  QUEUE_STATUS: '/api/appointments/queue/',
};
