import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mwolo Energy | Agence",
  description: "Outils agence Mwolo Energy - Borne ticket, moniteur file d'attente, guichet agent.",
  robots: "noindex, nofollow",
  icons: {
    icon: "/favicon.ico",
  },
};

// Viewport séparé pour Next.js 14+
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${geistSans.variable} antialiased bg-slate-900 text-white overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
