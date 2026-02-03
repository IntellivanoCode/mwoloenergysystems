'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { apiCall, getAccessToken, clearTokens } from '@/lib/api';

interface ClientData {
  id: string;
  client_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  agency_name?: string;
  agency_code?: string;
  contract_type?: string;
  subscription_date?: string;
  status?: string;
  created_at?: string;
}

interface PasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export default function ProfilePage() {
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'contact' | 'security' | 'contract'>('info');
  
  // Contact form
  const [contactForm, setContactForm] = useState({
    phone: '',
    email: '',
  });
  const [savingContact, setSavingContact] = useState(false);
  
  // Password form
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);
  
  // Delete request
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [requestingDelete, setRequestingDelete] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      window.location.href = '/login';
      return;
    }

    const loadData = async () => {
      try {
        const clientRes = await apiCall<ClientData>('/crm/clients/me/');
        if (!clientRes.data) {
          setError('Impossible de retrouver votre profil client.');
          return;
        }

        setClient(clientRes.data);
        setContactForm({
          phone: clientRes.data.phone || '',
          email: clientRes.data.email || '',
        });
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement du profil.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContact(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiCall<ClientData>('/crm/clients/me/', {
        method: 'PATCH',
        body: JSON.stringify(contactForm),
      });

      if (response.data) {
        setClient(response.data);
        setSuccess('Informations de contact mises a jour avec succes.');
      }
    } catch (err) {
      setError('Erreur lors de la mise a jour des informations.');
    } finally {
      setSavingContact(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caracteres.');
      return;
    }

    setSavingPassword(true);
    setError('');
    setSuccess('');

    try {
      await apiCall('/accounts/change-password/', {
        method: 'POST',
        body: JSON.stringify({
          old_password: passwordForm.current_password,
          new_password: passwordForm.new_password,
        }),
      });

      setSuccess('Mot de passe modifie avec succes.');
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (err) {
      setError('Erreur lors du changement de mot de passe. Verifiez votre ancien mot de passe.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!deleteReason.trim()) {
      setError('Veuillez indiquer la raison de votre demande.');
      return;
    }

    setRequestingDelete(true);
    setError('');

    try {
      await apiCall('/support/tickets/', {
        method: 'POST',
        body: JSON.stringify({
          subject: 'Demande de suppression de compte',
          description: `Raison: ${deleteReason}`,
          category: 'account',
          priority: 'medium',
        }),
      });

      setSuccess('Votre demande de suppression a ete envoyee. Notre equipe vous contactera sous 48h.');
      setShowDeleteConfirm(false);
      setDeleteReason('');
    } catch (err) {
      setError('Erreur lors de l\'envoi de la demande.');
    } finally {
      setRequestingDelete(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-2 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour au tableau de bord
            </button>
            <h1 className="text-4xl font-bold text-gray-900">Mon Profil</h1>
            <p className="text-gray-600 mt-2">Gerez vos informations personnelles et parametres</p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-green-700">
              {success}
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {[
                  { id: 'info', label: 'Identite', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                  { id: 'contact', label: 'Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                  { id: 'security', label: 'Securite', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                  { id: 'contract', label: 'Contrat', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition ${
                      activeTab === tab.id
                        ? 'border-cyan-500 text-cyan-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              {/* Identity Tab */}
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Informations d'identite</h2>
                  <p className="text-sm text-gray-500 mb-6">Ces informations ne peuvent etre modifiees que par notre service client.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Code Client</p>
                      <p className="text-lg font-semibold text-gray-900">{client?.client_code || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Nom complet</p>
                      <p className="text-lg font-semibold text-gray-900">{client?.first_name} {client?.last_name}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Adresse</p>
                      <p className="text-lg font-semibold text-gray-900">{client?.address || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Ville</p>
                      <p className="text-lg font-semibold text-gray-900">{client?.city || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Agence</p>
                      <p className="text-lg font-semibold text-gray-900">{client?.agency_name || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Membre depuis</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {client?.created_at ? new Date(client.created_at).toLocaleDateString('fr-FR') : '-'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Besoin de modifier ces informations ?</strong><br/>
                      Pour changer d'adresse ou d'agence, veuillez contacter notre service client via un ticket de support.
                    </p>
                    <button 
                      onClick={() => window.location.href = '/support'}
                      className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Ouvrir un ticket →
                    </button>
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Informations de contact</h2>
                  
                  <form onSubmit={handleSaveContact} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telephone</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={savingContact}
                      className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium disabled:opacity-50"
                    >
                      {savingContact ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Changer le mot de passe</h2>
                    
                    <form onSubmit={handleChangePassword} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                        <input
                          type="password"
                          value={passwordForm.current_password}
                          onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                        <input
                          type="password"
                          value={passwordForm.new_password}
                          onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                          required
                          minLength={8}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 8 caracteres</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                        <input
                          type="password"
                          value={passwordForm.confirm_password}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 bg-white"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={savingPassword}
                        className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium disabled:opacity-50"
                      >
                        {savingPassword ? 'Modification...' : 'Modifier le mot de passe'}
                      </button>
                    </form>
                  </div>

                  <hr className="border-gray-200" />

                  <div>
                    <h2 className="text-xl font-bold text-red-600 mb-4">Zone dangereuse</h2>
                    <p className="text-gray-600 mb-4">
                      La suppression de votre compte est irreversible. Toutes vos donnees seront perdues.
                    </p>
                    
                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-medium"
                      >
                        Demander la suppression de mon compte
                      </button>
                    ) : (
                      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                        <h3 className="font-bold text-red-800 mb-4">Confirmer la demande de suppression</h3>
                        <textarea
                          value={deleteReason}
                          onChange={(e) => setDeleteReason(e.target.value)}
                          placeholder="Indiquez la raison de votre demande..."
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white mb-4"
                        />
                        <div className="flex gap-4">
                          <button
                            onClick={handleDeleteRequest}
                            disabled={requestingDelete}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
                          >
                            {requestingDelete ? 'Envoi...' : 'Confirmer la demande'}
                          </button>
                          <button
                            onClick={() => { setShowDeleteConfirm(false); setDeleteReason(''); }}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contract Tab */}
              {activeTab === 'contract' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Mon contrat</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Type de contrat</p>
                      <p className="text-lg font-semibold text-gray-900">{client?.contract_type || 'Standard'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Statut</p>
                      <p className="text-lg font-semibold text-green-600">{client?.status || 'Actif'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Date de souscription</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {client?.subscription_date ? new Date(client.subscription_date).toLocaleDateString('fr-FR') : '-'}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Agence</p>
                      <p className="text-lg font-semibold text-gray-900">{client?.agency_name || '-'}</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                    <p className="text-cyan-800 text-sm">
                      <strong>Questions sur votre contrat ?</strong><br/>
                      Contactez notre service client pour toute question relative a votre contrat ou pour demander une modification.
                    </p>
                    <button 
                      onClick={() => window.location.href = '/support'}
                      className="mt-3 text-cyan-600 hover:text-cyan-700 font-medium text-sm"
                    >
                      Contacter le support →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
