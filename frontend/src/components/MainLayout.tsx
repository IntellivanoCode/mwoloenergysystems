'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'À propos', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Agences', href: '/agencies' },
  { name: 'Rendez-vous', href: '/appointments' },
  { name: 'Actualités', href: '/news' },
  { name: 'Carrières', href: '/careers' },
  { name: 'Contact', href: '/contact' },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
