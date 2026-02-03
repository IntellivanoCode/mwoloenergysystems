'use client';

import { useState, useEffect } from 'react';
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

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/cms/articles/')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.results || [];
        setArticles(list);
        setLoading(false);
      })
      .catch(() => {
        // Default articles if API fails
        setArticles([
          {
            id: '1',
            title: 'Nouvelle infrastructure de distribution inaugurée',
            excerpt: 'Mwolo Energy Systems investit dans la modernisation de son réseau de distribution électrique.',
            content: 'Dans le cadre de notre programme d\'amélioration continue, nous avons inauguré...',
            published_date: '2026-01-28',
            category: 'Infrastructure'
          },
          {
            id: '2',
            title: 'Conseils pour réduire votre consommation énergétique',
            excerpt: 'Découvrez nos astuces pratiques pour diminuer votre facture d\'électricité.',
            content: 'La réduction de la consommation énergétique est un enjeu majeur...',
            published_date: '2026-01-25',
            category: 'Conseils'
          },
          {
            id: '3',
            title: 'Ouverture de notre nouvelle agence à Goma',
            excerpt: 'Pour mieux vous servir, une nouvelle agence ouvre ses portes dans le quartier commercial.',
            content: 'Nous sommes heureux de vous annoncer l\'ouverture...',
            published_date: '2026-01-20',
            category: 'Agences'
          },
          {
            id: '4',
            title: 'Programme d\'énergie solaire communautaire',
            excerpt: 'Mwolo Energy lance un programme innovant d\'énergie solaire pour les zones rurales.',
            content: 'L\'accès à l\'énergie propre est un droit fondamental...',
            published_date: '2026-01-15',
            category: 'Énergie Verte'
          },
        ]);
        setLoading(false);
      });
  }, []);

  const categories = ['all', ...new Set(articles.map(a => a.category).filter(Boolean))];
  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      'Infrastructure': 'bg-blue-500/20 text-blue-400',
      'Conseils': 'bg-green-500/20 text-green-400',
      'Agences': 'bg-purple-500/20 text-purple-400',
      'Énergie Verte': 'bg-emerald-500/20 text-emerald-400',
      'default': 'bg-cyan-500/20 text-cyan-400'
    };
    return colors[category || ''] || colors.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl mb-8 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">Actualités</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Restez informé des dernières nouvelles de Mwolo Energy Systems, 
              nos projets, conseils et événements.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        {categories.length > 2 && (
          <section className="px-4 pb-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 justify-center flex-wrap">
                <span className="text-gray-400">Catégorie :</span>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat || 'all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === cat 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                    }`}
                  >
                    {cat === 'all' ? 'Toutes' : cat}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Articles Grid */}
        <section className="py-8 px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-20 bg-slate-800/30 rounded-2xl">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="text-gray-400 text-lg">Aucun article disponible dans cette catégorie</p>
              </div>
            ) : (
              <>
                {/* Featured Article */}
                {filteredArticles.length > 0 && (
                  <div className="mb-12">
                    <article className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-2xl overflow-hidden group hover:border-orange-500/50 transition-all">
                      <div className="md:flex">
                        <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-orange-600/20 to-red-600/20 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-24 h-24 text-orange-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(filteredArticles[0].category)}`}>
                              {filteredArticles[0].category || 'Actualité'}
                            </span>
                          </div>
                        </div>
                        <div className="md:w-1/2 p-8">
                          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(filteredArticles[0].published_date)}
                          </div>
                          <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                            {filteredArticles[0].title}
                          </h2>
                          <p className="text-gray-400 leading-relaxed mb-6">
                            {filteredArticles[0].excerpt || filteredArticles[0].content.substring(0, 200)}...
                          </p>
                          <Link href={`/news/${filteredArticles[0].id}`} 
                                className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium transition-colors">
                            Lire l'article complet
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </article>
                  </div>
                )}

                {/* Other Articles */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.slice(1).map((article) => (
                    <article key={article.id} 
                             className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all group">
                      <div className="h-40 bg-gradient-to-br from-slate-700 to-slate-800 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                        {article.category && (
                          <div className="absolute top-3 left-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getCategoryColor(article.category)}`}>
                              {article.category}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(article.published_date)}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                          {article.excerpt || article.content.substring(0, 120)}...
                        </p>
                        <Link href={`/news/${article.id}`} 
                              className="text-orange-400 hover:text-orange-300 text-sm font-medium inline-flex items-center gap-1">
                          Lire plus
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 px-4 bg-slate-800/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Restez informé</h2>
            <p className="text-gray-400 mb-8">Inscrivez-vous à notre newsletter pour recevoir nos actualités</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none"
              />
              <button type="submit" className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                S'inscrire
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
