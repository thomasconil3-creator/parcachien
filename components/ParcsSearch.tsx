"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cityToSlug } from "@/lib/utils";
import { useLang } from "./LangToggle";

interface CityData {
  city: string;
  count: number;
  dept: string;
  deptName: string;
}

const t = {
  fr: {
    search: "Rechercher une ville...",
    noResult: "Aucune ville trouvée pour",
    parks: "parc",
    parksPlural: "parcs",
    total: "espaces canins recensés",
    viewMap: "Voir la carte interactive",
  },
  en: {
    search: "Search a city...",
    noResult: "No city found for",
    parks: "park",
    parksPlural: "parks",
    total: "dog parks listed",
    viewMap: "View interactive map",
  },
};

export default function ParcsSearch({ cities, totalParks }: { cities: CityData[]; totalParks: number }) {
  const [query, setQuery] = useState("");
  const { lang } = useLang();
  const tr = t[lang];

  const filtered = cities.filter(
    c => c.city.toLowerCase().includes(query.toLowerCase()) || c.deptName.toLowerCase().includes(query.toLowerCase())
  );

  // Regrouper par département
  const byDept = filtered.reduce<Record<string, CityData[]>>((acc, c) => {
    if (!acc[c.dept]) acc[c.dept] = [];
    acc[c.dept].push(c);
    return acc;
  }, {});

  return (
    <div>
      {/* Search Input */}
      <div className="relative mb-10 max-w-xl">
        <span className="absolute left-4 top-3.5 text-neutral-400 dark:text-neutral-500">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder={tr.search}
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border text-sm sm:text-base bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#7C6EF5]/50 focus:border-[#7C6EF5] transition-all shadow-sm"
        />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-neutral-900/40 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
          <span className="text-3xl block mb-2">🔍</span>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">
            {tr.noResult} "{query}"
          </p>
        </div>
      ) : (
        Object.entries(byDept)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([dept, deptCities]) => (
            <section key={dept} className="mb-10">
              <h2
                className="text-lg sm:text-xl font-extrabold text-[#7C6EF5] dark:text-[#a89cf7] mb-6 pb-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                <span>{deptCities[0].deptName}</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                  {deptCities.reduce((s, c) => s + c.count, 0)} {deptCities.reduce((s, c) => s + c.count, 0) > 1 ? tr.parksPlural : tr.parks}
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {deptCities
                  .sort((a, b) => b.count - a.count)
                  .map(({ city, count }) => (
                    <a
                      key={city}
                      href={`/parcs/${cityToSlug(city)}`}
                      className="group block p-5 bg-white dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl hover:border-[#7C6EF5] dark:hover:border-[#7C6EF5] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-purple-500/5 no-underline"
                    >
                      <strong className="text-base text-neutral-800 dark:text-neutral-100 group-hover:text-[#7C6EF5] transition-colors block mb-1">
                        {city}
                      </strong>
                      <span className="text-xs font-bold text-[#F59500] dark:text-amber-400">
                        {count} {count > 1 ? tr.parksPlural : tr.parks}
                      </span>
                    </a>
                  ))}
              </div>
            </section>
          ))
      )}

      {/* Bottom CTA */}
      <div className="mt-14 text-center">
        <a
          href="/"
          className="inline-block bg-[#7C6EF5] text-white font-extrabold px-8 py-3.5 rounded-2xl no-underline text-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all hover:scale-105"
        >
          🗺️ {tr.viewMap}
        </a>
      </div>
    </div>
  );
}
