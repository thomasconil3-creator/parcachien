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
      {/* Barre de recherche */}
      <div style={{ position: "relative", marginBottom: 32 }}>
        <Search
          size={18}
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--neutral-500)" }}
        />
        <input
          type="text"
          placeholder={tr.search}
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px 14px 44px",
            borderRadius: 16,
            border: "2px solid var(--neutral-200)",
            background: "var(--neutral-100)",
            color: "var(--neutral-800)",
            fontSize: 15,
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
          onFocus={e => (e.target.style.borderColor = "#7C6EF5")}
          onBlur={e => (e.target.style.borderColor = "var(--neutral-200)")}
        />
      </div>

      {/* Résultats */}
      {filtered.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--neutral-500)", padding: "40px 0" }}>
          {tr.noResult} "{query}"
        </p>
      ) : (
        Object.entries(byDept)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([dept, deptCities]) => (
            <section key={dept} style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#7C6EF5", marginBottom: 16, paddingBottom: 8, borderBottom: "2px solid var(--neutral-200)" }}>
                {deptCities[0].deptName}
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--neutral-500)", marginLeft: 10 }}>
                  ({deptCities.reduce((s, c) => s + c.count, 0)} {lang === "fr" ? "parcs" : "parks"})
                </span>
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                {deptCities
                  .sort((a, b) => b.count - a.count)
                  .map(({ city, count }) => (
                    <a
                      key={city}
                      href={`/parcs/${cityToSlug(city)}`}
                      style={{
                        display: "block",
                        background: "var(--neutral-100)",
                        border: "1px solid var(--neutral-200)",
                        borderRadius: 12,
                        padding: "14px 18px",
                        textDecoration: "none",
                        color: "var(--neutral-800)",
                        boxShadow: "0 2px 6px rgba(124,110,245,0.06)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(124,110,245,0.15)";
                        (e.currentTarget as HTMLElement).style.borderColor = "#7C6EF5";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 6px rgba(124,110,245,0.06)";
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--neutral-200)";
                      }}
                    >
                      <strong style={{ fontSize: 15, display: "block", marginBottom: 4 }}>{city}</strong>
                      <span style={{ fontSize: 12, color: "#7C6EF5", fontWeight: 600 }}>
                        {count} {count > 1 ? tr.parksPlural : tr.parks}
                      </span>
                    </a>
                  ))}
              </div>
            </section>
          ))
      )}

      <div style={{ marginTop: 48, textAlign: "center" }}>
        <a
          href="/"
          style={{
            display: "inline-block",
            background: "#7C6EF5",
            color: "#fff",
            padding: "14px 32px",
            borderRadius: 50,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
          }}
        >
          🗺️ {tr.viewMap}
        </a>
      </div>
    </div>
  );
}
