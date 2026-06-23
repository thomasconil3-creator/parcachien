import { Metadata } from "next";
import { PARTNER_CITIES, PARTNERS } from "@/lib/partners-data";
import SeoFooter from "@/components/SeoFooter";

export const metadata: Metadata = {
  title: "Vétérinaires et animaleries pour chiens en PACA | ParcAChien",
  description:
    "Trouvez un vétérinaire ou une animalerie pour votre chien en PACA : Marseille, Nice, Toulon, Aix-en-Provence, Avignon, Cannes. Annuaire de partenaires ParcAChien.",
  keywords: [
    "vétérinaire chien PACA",
    "animalerie chien",
    "croquettes chien",
    "magasin chien Marseille",
    "vétérinaire Marseille",
    "vétérinaire Nice",
    "animalerie Toulon",
    "pet store PACA",
  ].join(", "),
  alternates: { canonical: "https://www.parcachien.com/partenaires" },
  openGraph: {
    title: "Vétérinaires et animaleries pour chiens en PACA | ParcAChien",
    description:
      "Annuaire des vétérinaires et animaleries pour chiens en région PACA.",
    siteName: "ParcAChien",
    locale: "fr_FR",
    type: "website",
    url: "https://www.parcachien.com/partenaires",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Vétérinaires et animaleries pour chiens en PACA",
  description:
    "Annuaire des vétérinaires et animaleries partenaires de ParcAChien en région PACA.",
  url: "https://www.parcachien.com/partenaires",
  publisher: {
    "@type": "Organization",
    name: "ParcAChien",
    url: "https://www.parcachien.com",
  },
};

export default function PartenairesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main
        style={{
          fontFamily: "system-ui, sans-serif",
          maxWidth: 900,
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* Breadcrumb */}
        <nav style={{ marginBottom: 24, fontSize: 13, color: "#888" }}>
          <a href="/" style={{ color: "#7C6EF5", textDecoration: "none" }}>
            ParcAChien
          </a>
          {" › "}
          Partenaires
        </nav>

        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#1a1a2e",
            marginBottom: 8,
          }}
        >
          🏥 Vétérinaires & animaleries pour chiens en PACA
        </h1>
        <p style={{ color: "#555", fontSize: 16, marginBottom: 40 }}>
          Retrouvez les vétérinaires et boutiques animaleries de confiance pour
          votre chien dans toute la région PACA. Sélectionnez votre ville pour
          accéder à l'annuaire local.
        </p>

        {/* City grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
            marginBottom: 64,
          }}
        >
          {PARTNER_CITIES.map(({ city, slug }) => {
            const vets = PARTNERS.filter(
              (p) => p.citySlug === slug && p.category === "veterinaire"
            ).length;
            const boutiques = PARTNERS.filter(
              (p) => p.citySlug === slug && p.category === "boutique"
            ).length;

            return (
              <a
                key={slug}
                href={`/partenaires/${slug}`}
                style={{
                  display: "block",
                  background: "#fff",
                  border: "1px solid #e8e4f0",
                  borderRadius: 14,
                  padding: "22px 24px",
                  textDecoration: "none",
                  color: "#1a1a2e",
                  boxShadow: "0 2px 8px rgba(124,110,245,0.07)",
                  transition: "box-shadow 0.2s",
                }}
              >
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    margin: "0 0 12px 0",
                  }}
                >
                  {city}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 14,
                      color: "#555",
                    }}
                  >
                    <span
                      style={{
                        background: "#f0eeff",
                        color: "#7C6EF5",
                        borderRadius: 6,
                        padding: "2px 8px",
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      {vets}
                    </span>
                    vétérinaire{vets > 1 ? "s" : ""}
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 14,
                      color: "#555",
                    }}
                  >
                    <span
                      style={{
                        background: "#fff3e0",
                        color: "#e67e22",
                        borderRadius: 6,
                        padding: "2px 8px",
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      {boutiques}
                    </span>
                    animalerie{boutiques > 1 ? "s" : ""}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "#7C6EF5",
                    fontWeight: 600,
                    marginTop: 14,
                    marginBottom: 0,
                  }}
                >
                  Voir l'annuaire →
                </p>
              </a>
            );
          })}
        </div>

        {/* CTA Devenir partenaire */}
        <div
          style={{
            background: "linear-gradient(135deg, #7C6EF5 0%, #5a4fd4 100%)",
            borderRadius: 18,
            padding: "40px 36px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#fff",
              marginBottom: 10,
            }}
          >
            🏥 Votre établissement n'est pas listé ?
          </p>
          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.85)",
              marginBottom: 28,
            }}
          >
            Rejoignez l'annuaire ParcAChien gratuitement et soyez visible sur
            notre carte interactive et notre application mobile.
          </p>
          <a
            href="/partenaires/rejoindre"
            style={{
              display: "inline-block",
              background: "#fff",
              color: "#7C6EF5",
              fontWeight: 700,
              fontSize: 16,
              padding: "14px 32px",
              borderRadius: 10,
              textDecoration: "none",
            }}
          >
            Être référencé gratuitement →
          </a>
        </div>
      </main>
      <SeoFooter />
    </>
  );
}
