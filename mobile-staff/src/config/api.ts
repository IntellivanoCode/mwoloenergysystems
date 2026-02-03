// API Configuration pour l'application Staff Mwolo Energy Systems
export const API_CONFIG = {
  // URL de base - modifier selon l'environnement
  // Utilise la variable d'env si définie, sinon dev/prod selon __DEV__
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || (
    __DEV__ 
      ? 'http://192.168.1.100:8000' // IP locale pour dev
      : 'https://mwolo-api.onrender.com' // Production Render
  ),
  
  // Timeout par défaut
  TIMEOUT: 30000,
  
  // Version de l'API
  API_VERSION: 'v1',
};

// Endpoints de l'API
export const API_ENDPOINTS = {
  // Authentification Staff
  AUTH: {
    LOGIN: '/api/accounts/staff/login/',
    LOGOUT: '/api/accounts/logout/',
    REFRESH: '/api/accounts/token/refresh/',
    PROFILE: '/api/accounts/staff/profile/',
    CHANGE_PASSWORD: '/api/accounts/change-password/',
  },
  
  // Gestion des files d'attente
  QUEUE: {
    STATUS: '/api/operations/queue/status/',
    TICKETS: '/api/operations/queue/tickets/',
    CALL_NEXT: '/api/operations/queue/call-next/',
    COMPLETE_TICKET: (id: number) => `/api/operations/queue/tickets/${id}/complete/`,
    CANCEL_TICKET: (id: number) => `/api/operations/queue/tickets/${id}/cancel/`,
    TRANSFER_TICKET: (id: number) => `/api/operations/queue/tickets/${id}/transfer/`,
  },
  
  // Rendez-vous
  APPOINTMENTS: {
    LIST: '/api/operations/appointments/',
    DETAIL: (id: number) => `/api/operations/appointments/${id}/`,
    TODAY: '/api/operations/appointments/today/',
    CHECK_IN: (id: number) => `/api/operations/appointments/${id}/check-in/`,
    COMPLETE: (id: number) => `/api/operations/appointments/${id}/complete/`,
    CANCEL: (id: number) => `/api/operations/appointments/${id}/cancel/`,
  },
  
  // Clients
  CLIENTS: {
    LIST: '/api/crm/clients/',
    DETAIL: (id: number) => `/api/crm/clients/${id}/`,
    SEARCH: '/api/crm/clients/search/',
    CREATE: '/api/crm/clients/',
    UPDATE: (id: number) => `/api/crm/clients/${id}/`,
  },
  
  // Facturation
  BILLING: {
    INVOICES: '/api/billing/invoices/',
    INVOICE_DETAIL: (id: number) => `/api/billing/invoices/${id}/`,
    PAYMENTS: '/api/billing/payments/',
    CREATE_PAYMENT: '/api/billing/payments/',
    RECEIPT: (id: number) => `/api/billing/payments/${id}/receipt/`,
  },
  
  // Compteurs
  METERS: {
    LIST: '/api/operations/meters/',
    DETAIL: (id: number) => `/api/operations/meters/${id}/`,
    READINGS: '/api/operations/meter-readings/',
    CREATE_READING: '/api/operations/meter-readings/',
  },
  
  // Tickets support
  SUPPORT: {
    TICKETS: '/api/support/tickets/',
    TICKET_DETAIL: (id: number) => `/api/support/tickets/${id}/`,
    ASSIGN: (id: number) => `/api/support/tickets/${id}/assign/`,
    RESPOND: (id: number) => `/api/support/tickets/${id}/respond/`,
    CLOSE: (id: number) => `/api/support/tickets/${id}/close/`,
  },
  
  // Agences
  AGENCIES: {
    LIST: '/api/agencies/',
    DETAIL: (id: number) => `/api/agencies/${id}/`,
    SERVICES: '/api/agencies/services/',
    COUNTERS: '/api/agencies/counters/',
  },
  
  // Statistiques
  STATS: {
    DASHBOARD: '/api/operations/stats/dashboard/',
    QUEUE_STATS: '/api/operations/stats/queue/',
    PERFORMANCE: '/api/operations/stats/performance/',
  },
};

export default API_CONFIG;
