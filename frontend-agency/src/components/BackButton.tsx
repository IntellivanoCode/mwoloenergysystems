'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  className?: string;
  label?: string;
}

export default function BackButton({ className = '', label = 'Retour' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Vérifier si on peut revenir en arrière
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-200 ${className}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
