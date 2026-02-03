import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portail Employé | Mwolo Energy Systems",
  description: "Espace employé Mwolo Energy - Gestion RH, pointage, planning et outils internes.",
  robots: "noindex, nofollow", // Ne pas indexer le portail employé
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 text-white`}>
        {children}
      </body>
    </html>
  );
}
