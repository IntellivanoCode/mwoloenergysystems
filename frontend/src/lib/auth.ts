// Gestion de l'authentification - Système simplifié avec 3 rôles
// La différenciation des accès se fait par le POSTE (position) dans Employee

import { getAccessToken, clearTokens, apiCall } from './api';

// 3 Rôles principaux uniquement
export type UserRole = 'super_admin' | 'employe' | 'client';

// Types de postes pour les employés (détermine les accès aux dashboards)
export type EmployeePosition = 
  | 'directeur_general' | 'directeur_adjoint' | 'directeur_agence'
  | 'manager' | 'chef_departement' | 'superviseur'
  | 'responsable_rh' | 'assistant_rh'
  | 'responsable_comptable' | 'comptable' | 'caissier'
  | 'responsable_commercial' | 'agent_commercial' | 'conseiller_client'
  | 'responsable_operations' | 'technicien' | 'installateur'
  | 'responsable_support' | 'agent_guichet' | 'agent_support'
  | 'responsable_it' | 'developpeur' | 'administrateur_systeme'
  | 'stagiaire' | 'autre';

// Types de départements
export type Department = 
  | 'direction' | 'rh' | 'comptabilite' | 'commercial' 
  | 'operations' | 'support' | 'it' | 'logistique' | 'autre';

// Types de dashboards disponibles
export type DashboardType = 
  | 'admin' | 'employee' | 'rh' | 'comptabilite' 
  | 'commercial' | 'operations' | 'support' | 'it' | 'client';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  post_name?: string;
  role: UserRole;
  phone?: string;
  photo?: string;
  agency?: {
    id: string;
    name: string;
    code: string;
  };
  // Infos employé (si rôle = employe)
  employee_number?: string;
  position?: EmployeePosition;
  position_display?: string;
  department?: Department;
  department_display?: string;
  accessible_dashboards?: DashboardType[];
  can_manage_queue?: boolean;
}

// Mapping des rôles vers les portails
export const ROLE_PORTAL_MAP: Record<UserRole, string> = {
  super_admin: '/portal',
  employe: '/portal',
  client: '/client-portal',
};

// Labels des rôles
export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Administrateur',
  employe: 'Employé',
  client: 'Client',
};

// Couleurs des rôles
export const ROLE_COLORS: Record<UserRole, { bg: string; text: string; border: string }> = {
  super_admin: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-500' },
  employe: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-500' },
  client: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-500' },
};

// Configuration des dashboards par type
export const DASHBOARD_CONFIG: Record<DashboardType, {
  name: string;
  icon: string;
  color: string;
  href: string;
  description: string;
}> = {
  admin: {
    name: 'Administration',
    icon: '🛡️',
    color: 'from-red-500 to-red-600',
    href: '/admin-dashboard',
    description: 'Gestion globale du système',
  },
  employee: {
    name: 'Mon Espace',
    icon: '👤',
    color: 'from-cyan-500 to-cyan-600',
    href: '/employee-dashboard',
    description: 'Profil, congés, pointage',
  },
  rh: {
    name: 'Ressources Humaines',
    icon: '👥',
    color: 'from-blue-500 to-blue-600',
    href: '/rh-dashboard',
    description: 'Gestion du personnel',
  },
  comptabilite: {
    name: 'Comptabilité',
    icon: '📊',
    color: 'from-green-500 to-green-600',
    href: '/comptable-dashboard',
    description: 'Finances et facturation',
  },
  commercial: {
    name: 'Commercial',
    icon: '💼',
    color: 'from-yellow-500 to-yellow-600',
    href: '/commercial-dashboard',
    description: 'Clients et ventes',
  },
  operations: {
    name: 'Opérations',
    icon: '⚙️',
    color: 'from-orange-500 to-orange-600',
    href: '/operations-dashboard',
    description: 'Interventions et terrain',
  },
  support: {
    name: 'Support & Guichet',
    icon: '🎫',
    color: 'from-indigo-500 to-indigo-600',
    href: '/support-dashboard',
    description: 'Accueil et file d\'attente',
  },
  it: {
    name: 'Informatique',
    icon: '💻',
    color: 'from-slate-500 to-slate-600',
    href: '/it-dashboard',
    description: 'Systèmes et développement',
  },
  client: {
    name: 'Espace Client',
    icon: '🏠',
    color: 'from-teal-500 to-teal-600',
    href: '/client-portal',
    description: 'Factures et services',
  },
};

// Récupérer l'utilisateur courant depuis l'API
export async function getCurrentUser(): Promise<User | null> {
  const token = getAccessToken();
  if (!token) return null;

  const response = await apiCall<User>('/auth/me/');
  if (response.data) {
    return response.data;
  }
  return null;
}

// Vérifier si l'utilisateur est connecté
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// Rediriger vers le bon portail selon le rôle
export function getDashboardUrl(role: UserRole): string {
  return ROLE_PORTAL_MAP[role] || '/portal';
}

// Obtenir les dashboards accessibles pour un utilisateur
export function getAccessibleDashboards(user: User): DashboardType[] {
  if (user.role === 'super_admin') {
    return ['admin', 'employee', 'rh', 'comptabilite', 'commercial', 'operations', 'support', 'it'];
  }
  if (user.role === 'client') {
    return ['client'];
  }
  // Pour les employés, utiliser la liste fournie par le backend
  return user.accessible_dashboards || ['employee'];
}

// Déconnexion
export function logout(): void {
  clearTokens();
  window.location.href = '/';
}

// Formater le nom complet
export function getFullName(user: User): string {
  const parts = [user.first_name, user.post_name, user.last_name].filter(Boolean);
  return parts.join(' ');
}

// Vérifier si l'utilisateur peut accéder à un dashboard spécifique
export function canAccessDashboard(user: User, dashboard: DashboardType): boolean {
  const accessible = getAccessibleDashboards(user);
  return accessible.includes(dashboard);
}

// Vérifier si l'utilisateur peut gérer les files d'attente
export function canManageQueue(user: User): boolean {
  if (user.role === 'super_admin') return true;
  return user.can_manage_queue || false;
}

// Obtenir le label du poste
export function getPositionLabel(position: EmployeePosition | undefined): string {
  if (!position) return 'Non défini';
  const labels: Record<EmployeePosition, string> = {
    directeur_general: 'Directeur Général',
    directeur_adjoint: 'Directeur Adjoint',
    directeur_agence: 'Directeur d\'Agence',
    manager: 'Manager',
    chef_departement: 'Chef de Département',
    superviseur: 'Superviseur',
    responsable_rh: 'Responsable RH',
    assistant_rh: 'Assistant RH',
    responsable_comptable: 'Responsable Comptable',
    comptable: 'Comptable',
    caissier: 'Caissier',
    responsable_commercial: 'Responsable Commercial',
    agent_commercial: 'Agent Commercial',
    conseiller_client: 'Conseiller Client',
    responsable_operations: 'Responsable Opérations',
    technicien: 'Technicien',
    installateur: 'Installateur',
    responsable_support: 'Responsable Support',
    agent_guichet: 'Agent de Guichet',
    agent_support: 'Agent Support',
    responsable_it: 'Responsable IT',
    developpeur: 'Développeur',
    administrateur_systeme: 'Administrateur Système',
    stagiaire: 'Stagiaire',
    autre: 'Autre',
  };
  return labels[position] || position;
}
