'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAccessToken, getCurrentUser, apiRequest } from '@/lib/api';

// Icônes SVG
const Icons = {
  users: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  search: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  plus: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  edit: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  badge: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
    </svg>
  ),
  back: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
};

interface Employee {
  id: string;
  user: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  employee_id: string;
  badge_number: string;
  department: string;
  position: string;
  agency?: {
    id: string;
    name: string;
  };
  phone: string;
  status: 'active' | 'on_leave' | 'inactive';
  hire_date: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({ total: 0, active: 0, onLeave: 0, inactive: 0 });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    const result = await apiRequest('/hr/employees/');
    if (result.data) {
      const data = result.data.results || result.data;
      setEmployees(Array.isArray(data) ? data : []);
      
      // Calculer les stats
      const emps = Array.isArray(data) ? data : [];
      setStats({
        total: emps.length,
        active: emps.filter((e: Employee) => e.status === 'active').length,
        onLeave: emps.filter((e: Employee) => e.status === 'on_leave').length,
        inactive: emps.filter((e: Employee) => e.status === 'inactive').length,
      });
    }
    setLoading(false);
  };

  // Filtrage des employés
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      (emp.user.first_name + ' ' + emp.user.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = filterDept === 'all' || emp.department === filterDept;
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Obtenir les départements uniques
  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'on_leave': return 'bg-amber-500/20 text-amber-400';
      case 'inactive': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'on_leave': return 'En congé';
      case 'inactive': return 'Inactif';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-xl transition">
                {Icons.back}
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Gestion des employés</h1>
                <p className="text-slate-400 text-sm">Gérez le personnel</p>
              </div>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition">
              {Icons.plus}
              <span>Ajouter employé</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-slate-400 text-sm">Total employés</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-green-500/10 rounded-2xl p-4 border border-green-500/20">
            <p className="text-green-400 text-sm">Actifs</p>
            <p className="text-3xl font-bold text-green-400">{stats.active}</p>
          </div>
          <div className="bg-amber-500/10 rounded-2xl p-4 border border-amber-500/20">
            <p className="text-amber-400 text-sm">En congé</p>
            <p className="text-3xl font-bold text-amber-400">{stats.onLeave}</p>
          </div>
          <div className="bg-red-500/10 rounded-2xl p-4 border border-red-500/20">
            <p className="text-red-400 text-sm">Inactifs</p>
            <p className="text-3xl font-bold text-red-400">{stats.inactive}</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                {Icons.search}
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, ID ou email..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            
            {/* Filtre département */}
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">Tous les départements</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            {/* Filtre statut */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="on_leave">En congé</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
        </div>

        {/* Liste des employés */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-12 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              {Icons.users}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucun employé trouvé</h3>
            <p className="text-slate-400">Modifiez vos filtres ou ajoutez un nouvel employé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className="bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-white/20 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                      {emp.user.first_name?.charAt(0)}{emp.user.last_name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {emp.user.first_name} {emp.user.last_name}
                      </h3>
                      <p className="text-cyan-400 text-sm">{emp.position}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(emp.status)}`}>
                    {getStatusLabel(emp.status)}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ID Employé</span>
                    <span className="text-white font-mono">{emp.employee_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Département</span>
                    <span className="text-white">{emp.department}</span>
                  </div>
                  {emp.agency && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Agence</span>
                      <span className="text-white">{emp.agency.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email</span>
                    <span className="text-white truncate max-w-[150px]">{emp.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Badge</span>
                    <span className="text-amber-400 font-mono">{emp.badge_number || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition text-sm">
                    {Icons.edit}
                    <span>Modifier</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-xl transition text-sm">
                    {Icons.badge}
                    <span>Badge</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
