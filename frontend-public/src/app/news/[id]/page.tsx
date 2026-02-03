'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface NewsArticle {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  image?: string;
  published_date: string;
  category?: string;
  author?: string;
}

// Articles par défaut pour fallback
const defaultArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Nouvelle infrastructure de distribution inaugurée',
    excerpt: 'Mwolo Energy Systems investit dans la modernisation de son réseau de distribution électrique.',
    content: `Dans le cadre de notre programme d'amélioration continue, nous avons inauguré une nouvelle infrastructure de distribution électrique dans la région de Kinshasa.

Ce projet représente un investissement majeur de 2,5 millions de dollars visant à améliorer la qualité et la fiabilité de l'approvisionnement électrique pour plus de 50 000 foyers.

Les principales caractéristiques de cette nouvelle infrastructure comprennent :
• Des transformateurs de dernière génération avec une efficacité améliorée de 15%
• Un système de surveillance en temps réel pour détecter et résoudre rapidement les pannes
• Des câbles souterrains résistants aux intempéries
• Une capacité accrue pour répondre à la demande croissante

"Cette infrastructure marque une nouvelle étape dans notre engagement envers nos clients", déclare le Directeur Technique de Mwolo Energy Systems. "Nous continuons à investir dans la modernisation de notre réseau pour offrir un service de qualité."

Les travaux ont été réalisés en partenariat avec des entreprises locales, créant plus de 200 emplois temporaires pendant la phase de construction.`,
    published_date: '2026-01-28',
    category: 'Infrastructure',
    author: 'Service Communication'
  },
  {
    id: '2',
    title: 'Conseils pour réduire votre consommation énergétique',
    excerpt: 'Découvrez nos astuces pratiques pour diminuer votre facture d\'électricité.',
    content: `La réduction de la consommation énergétique est un enjeu majeur tant pour votre portefeuille que pour l'environnement. Voici nos conseils pratiques pour optimiser votre consommation.

**1. Éclairage efficace**
Remplacez vos ampoules traditionnelles par des LED. Elles consomment jusqu'à 80% moins d'énergie et durent 25 fois plus longtemps.

**2. Appareils en veille**
Débranchez vos appareils électroniques lorsqu'ils ne sont pas utilisés. La veille peut représenter jusqu'à 10% de votre facture d'électricité.

**3. Climatisation intelligente**
Réglez votre climatiseur à 24-26°C plutôt qu'à des températures très basses. Chaque degré en moins augmente la consommation de 7%.

**4. Électroménager économe**
Privilégiez les appareils de classe énergétique A++ ou A+++. Ils consomment jusqu'à 50% moins que les modèles standards.

**5. Heures creuses**
Utilisez vos appareils gourmands en énergie (lave-linge, lave-vaisselle) pendant les heures creuses si disponibles dans votre forfait.

**6. Isolation**
Une bonne isolation réduit les besoins en climatisation et chauffage. Vérifiez l'étanchéité de vos portes et fenêtres.

En appliquant ces conseils, vous pouvez réduire votre consommation de 20 à 30% et faire des économies significatives sur votre facture mensuelle.`,
    published_date: '2026-01-25',
    category: 'Conseils',
    author: 'Service Client'
  },
  {
    id: '3',
    title: 'Ouverture de notre nouvelle agence à Goma',
    excerpt: 'Pour mieux vous servir, une nouvelle agence ouvre ses portes dans le quartier commercial.',
    content: `Nous sommes heureux de vous annoncer l'ouverture de notre nouvelle agence à Goma, située au cœur du quartier commercial de la ville.

**Adresse:** Avenue du Commerce, n°245, Goma

**Horaires d'ouverture:**
- Lundi à Vendredi : 8h00 - 17h00
- Samedi : 8h00 - 13h00

**Services disponibles:**
• Souscription de nouveaux abonnements
• Paiement des factures
• Demandes de raccordement
• Réclamations et assistance technique
• Conseils personnalisés en efficacité énergétique

Cette nouvelle agence a été conçue pour offrir un espace moderne et confortable avec un temps d'attente réduit grâce à notre système de gestion de files d'attente.

Notre équipe de 15 conseillers formés est prête à vous accueillir et répondre à toutes vos questions.

"L'ouverture de cette agence témoigne de notre volonté de nous rapprocher de nos clients dans l'Est du pays", souligne le Directeur Commercial.

Venez découvrir notre nouvelle agence et profitez de nos offres de lancement !`,
    published_date: '2026-01-20',
    category: 'Agences',
    author: 'Direction Commerciale'
  },
  {
    id: '4',
    title: 'Programme d\'énergie solaire communautaire',
    excerpt: 'Mwolo Energy lance un programme innovant d\'énergie solaire pour les zones rurales.',
    content: `L'accès à l'énergie propre est un droit fondamental. C'est pourquoi Mwolo Energy Systems lance un ambitieux programme d'énergie solaire communautaire destiné aux zones rurales.

**Objectifs du programme:**
• Fournir un accès à l'électricité à 100 villages d'ici 2027
• Installer 500 kits solaires communautaires
• Former 200 techniciens locaux pour la maintenance
• Créer des microréseaux intelligents

**Comment ça fonctionne ?**
Chaque village participant reçoit une installation solaire dimensionnée selon ses besoins. Un comité local est formé pour gérer la distribution et la maintenance. Les ménages contribuent une participation symbolique mensuelle.

**Impact attendu:**
- 50 000 personnes bénéficiaires
- Réduction de 15 000 tonnes de CO2 par an
- Amélioration des services de santé et d'éducation
- Développement économique local

**Partenariats:**
Ce programme est réalisé en partenariat avec :
• Le Ministère de l'Énergie
• La Banque Mondiale
• Des ONG locales et internationales

Les premiers villages pilotes seront équipés dès le mois de mars. Si vous souhaitez que votre communauté bénéficie de ce programme, contactez-nous.

Ensemble, construisons un avenir énergétique durable pour tous !`,
    published_date: '2026-01-15',
    category: 'Énergie Verte',
    author: 'Direction Développement Durable'
  }
];

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const articleId = params.id as string;

    // Essayer de charger depuis l'API
    fetch(`http://127.0.0.1:8000/api/cms/articles/${articleId}/`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setArticle(data);
        setLoading(false);
        // Charger articles liés
        fetch('http://127.0.0.1:8000/api/cms/articles/')
          .then(res => res.json())
          .then(all => {
            const list = Array.isArray(all) ? all : all.results || [];
            setRelatedArticles(list.filter((a: NewsArticle) => a.id !== articleId).slice(0, 3));
          })
          .catch(() => {});
      })
      .catch(() => {
        // Fallback sur les articles par défaut
        const found = defaultArticles.find(a => a.id === articleId);
        if (found) {
          setArticle(found);
          setRelatedArticles(defaultArticles.filter(a => a.id !== articleId).slice(0, 3));
        }
        setLoading(false);
      });
  }, [params.id]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      'Infrastructure': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Conseils': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Agences': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Énergie Verte': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'default': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    };
    return colors[category || ''] || colors.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Header />
        <main className="pt-20">
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Article non trouvé</h1>
            <p className="text-gray-400 mb-8">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
            <Link href="/news" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour aux actualités
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/news" className="hover:text-white transition-colors">Actualités</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-orange-400 truncate max-w-[200px]">{article.title}</span>
          </nav>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <header className="mb-10">
            {article.category && (
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(article.category)} mb-4`}>
                {article.category}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(article.published_date)}</span>
              </div>
              {article.author && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{article.author}</span>
                </div>
              )}
            </div>
          </header>

          {/* Featured Image Placeholder */}
          <div className="h-64 md:h-96 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-2xl mb-10 flex items-center justify-center border border-slate-700">
            <svg className="w-24 h-24 text-orange-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed space-y-6">
              {article.content.split('\n\n').map((paragraph, index) => {
                // Check if it's a heading (starts with **)
                if (paragraph.startsWith('**') && paragraph.includes('**')) {
                  const heading = paragraph.replace(/\*\*/g, '');
                  return (
                    <h3 key={index} className="text-xl font-bold text-white mt-8 mb-4">
                      {heading}
                    </h3>
                  );
                }
                // Check if it's a list
                if (paragraph.includes('•') || paragraph.includes('- ')) {
                  const items = paragraph.split('\n').filter(Boolean);
                  return (
                    <ul key={index} className="space-y-2 my-4">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>{item.replace(/^[•\-]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={index}>{paragraph}</p>
                );
              })}
            </div>
          </div>

          {/* Share Buttons */}
          <div className="mt-12 pt-8 border-t border-slate-700">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-gray-400 font-medium">Partager cet article :</span>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-lg flex items-center justify-center text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-white transition-colors"
                  title="Copier le lien"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <Link href="/news" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour aux actualités
            </Link>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 pb-20">
            <h2 className="text-2xl font-bold text-white mb-8">Articles similaires</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link 
                  key={related.id} 
                  href={`/news/${related.id}`}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all group"
                >
                  <div className="h-32 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-2">{formatDate(related.published_date)}</p>
                    <h3 className="text-white font-semibold group-hover:text-orange-400 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
