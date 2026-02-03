'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirection automatique vers le portail client
export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/client-portal');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-lg">Redirection vers le portail client...</p>
      </div>
    </div>
  );
}
