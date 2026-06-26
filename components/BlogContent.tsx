"use client";

import { useState, useMemo } from "react";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  categoryColor: string;
  image: string;
}

export default function BlogContent({ articles }: { articles: Article[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const categories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category));
    return ["Tous", ...Array.from(cats)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "Tous" || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#7C6EF5] text-white border-[#7C6EF5] shadow-md shadow-purple-500/20"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-[#7C6EF5]/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#7C6EF5]/50 focus:border-[#7C6EF5] transition-all"
          />
          <span className="absolute left-3.5 top-3 text-neutral-400 dark:text-neutral-500 text-sm">
            🔍
          </span>
        </div>
      </div>

      {/* Grid Layout */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => (
            <a
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group flex flex-col bg-white dark:bg-neutral-900/60 rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80 hover:border-amber-400 dark:hover:border-amber-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-amber-500/5 cursor-pointer no-underline"
            >
              {/* Image Container */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span
                  className={`absolute top-4 left-4 text-xs font-extrabold px-3 py-1 rounded-full shadow-sm ${article.categoryColor}`}
                >
                  {article.category}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 block mb-2">
                    {article.date} · ⏱️ {article.readTime}
                  </span>
                  <h3
                    className="text-lg font-extrabold text-neutral-800 dark:text-neutral-100 mb-2 leading-snug group-hover:text-[#7C6EF5] transition-colors"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    {article.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-xs font-bold text-[#7C6EF5]">
                  <span>Lire l'article</span>
                  <span className="transform transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-neutral-900/40 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
          <span className="text-4xl block mb-2">🐾</span>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">
            Aucun article ne correspond à votre recherche.
          </p>
        </div>
      )}
    </div>
  );
}
