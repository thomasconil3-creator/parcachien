import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PARTNER_CITIES,
  PARTNERS,
  getVetsByCity,
  getBoutiquesByCity,
  Partner,
} from "@/lib/partners-data";
import SeoFooter from "@/components/SeoFooter";

export async function generateStaticParams() {
  return PARTNER_CITIES.map(({ slug }) => ({ ville: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ville: string }>;
}): Promise<Metadata> {
  const { ville } = await params;
  const cityData = PARTNER_CITIES.find((c) => c.slug === ville);
  if (!cityData) return {};
  const city = cityData.city;

  return {
    title: `Vétérinaire chien ${city} + Animalerie ${city} | ParcAChien`,
    description: `Trouvez un vétérinaire ou une animalerie pour votre chien à ${city}. Annuaire complet avec horaires, adresses et spécialités.`,
    keywords: [
      `vétérinaire chien ${city}`,
      `animalerie ${city}`,
      `croquettes chien ${city}`,
      `cabinet vétérinaire ${city}`,
      `urgences vétérinaires ${city}`,
      `magasin animaux ${city}`,
    ].join(", "),
    alternates: {
      canonical: `https://www.parcachien.com/partenaires/${ville}`,
    },
    openGraph: {
      title: `Vétérinaire chien ${city} + Animalerie ${city} | ParcAChien`,
      description: `Annuaire vétérinaires et animaleries pour chiens à ${city}.`,
      siteName: "ParcAChien",
      locale: "fr_FR",
      type: "website",
      url: `https://www.parcachien.com/partenaires/${ville}`,
    },
  };
}

function buildJsonLd(vets: Partner[], boutiques: Partner[], city: string, slug: string) {
  const items = [...vets, ...boutiques].map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type":
        p.category === "veterinaire" ? "VeterinaryCare" : "PetStore",
      name: p.name,
      description: p.description,
      address: {
        "@type": "PostalAddress",
        streetAddress: p.address,
        addressLocality: p.city,
        postalCode: p.postalCode,
        addressCountry: "FR",
      },
      ...(p.phone ? { telephone: p.phone } : {}),
      ...(p.website ? { url: p.website } : {}),
      ...(p.hours ? { openingHours: p.hours } : {}),
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Vétérinaires et animaleries pour chiens à ${city}`,
    url: `https://www.parcachien.com/partenaires/${slug}`,
    numberOfItems: items.length,
    itemListElement: items,
  };
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div
      style={{
        background: "#fff",
        border: partner.premium ? "2px solid #7C6EF5" : "1px solid #e8e4f0",
        borderRadius: 14,
        padding: "20px 22px",
        boxShadow: partner.premium
          ? "0 4px 16px rgba(124,110,245,0.12)"
          : "0 2px 6px rgba(0,0,0,0.05)",
        position: "relative",
      }}
    >
      {partner.premium && (
        <span
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "#7C6EF5",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 20,
          }}
        >
          Partenaire
        </span>
      )}
      <p
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: "#1a1a2e",
          margin: "0 0 6px 0",
          paddingRight: partner.premium ? 100 : 0,
        }}
      >
        {partner.name}
      </p>
      {partner.specialite && (
        <span
          style={{
            display: "inline-block",
            background: "#f0eeff",
            color: "#7C6EF5",
            fontSize: 12,
            fontWeight: 600,
            padding: "2px 10px",
            borderRadius: 6,
            marginBottom: 10,
          }}
        >
          {partner.specialite}
        </span>
      )}
      <p style={{ fontSize: 14, color: "#555", margin: "0 0 12px 0", lineHeight: 1.5 }}>
        {partner.description}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
          📍 {partner.address}, {partner.postalCode} {partner.city}
        </p>
        {partner.hours && (
          <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
            🕐 {partner.hours}
          </p>
        )}
        {partner.phone && (
          <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
            📞{" "}
            <a
              href={`tel:${partner.phone.replace(/\s/g, "")}`}
              style={{ color: "#7C6EF5", textDecoration: "none", fontWeight: 600 }}
            >
              {partner.phone}
            </a>
          </p>
        )}
        {partner.website && (
          <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
            🌐{" "}
            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#7C6EF5", textDecoration: "none" }}
            >
              {partner.website.replace(/^https?:\/\//, "")}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default async function VillePage({
  params,
}: {
  params: Promise<{ ville: string }>;
}) {
  const { ville } = await params;
  const cityData = PARTNER_CITIES.find((c) => c.slug === ville);
  if (!cityData) notFound();

  const city = cityData.city;
  const vets = getVetsByCity(ville);
  const boutiques = getBoutiquesByCity(ville);
  const otherCities = PARTNER_CITIES.filter((c) => c.slug !== ville);
  const jsonLd = buildJsonLd(vets, boutiques, city, ville);

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
          <a
            href="/partenaires"
            style={{ color: "#7C6EF5", textDecoration: "none" }}
          >
            Partenaires
          </a>
          {" › "}
          {city}
        </nav>

        <h1
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: "#1a1a2e",
            marginBottom: 8,
          }}
        >
          Vétérinaires & animaleries pour chiens à {city}
        </h1>
        <p style={{ color: "#555", fontSize: 15, marginBottom: 40 }}>
          {vets.length} vétérinaire{vets.length > 1 ? "s" : ""} et{" "}
          {boutiques.length} animalerie{boutiques.length > 1 ? "s" : ""}{" "}
          référencé{boutiques.length > 1 ? "s" : ""} à {city} par ParcAChien.
        </p>

        {/* Vétérinaires */}
        {vets.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#1a1a2e",
                marginBottom: 20,
                paddingBottom: 10,
                borderBottom: "2px solid #f0eeff",
              }}
            >
              🏥 Vétérinaires à {city}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {vets.map((vet) => (
                <PartnerCard key={vet.id} partner={vet} />
              ))}
            </div>
          </section>
        )}

        {/* Boutiques */}
        {boutiques.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#1a1a2e",
                marginBottom: 20,
                paddingBottom: 10,
                borderBottom: "2px solid #fff3e0",
              }}
            >
              🛒 Animaleries & magasins à {city}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {boutiques.map((shop) => (
                <PartnerCard key={shop.id} partner={shop} />
              ))}
            </div>
          </section>
        )}

        {/* CTA rejoindre */}
        <div
          style={{
            background: "#f0eeff",
            border: "1px solid #d6ccff",
            borderRadius: 16,
            padding: "32px 28px",
            marginBottom: 48,
          }}
        >
          <p
            style={{
              fontSize: 19,
              fontWeight: 800,
              color: "#1a1a2e",
              marginBottom: 10,
            }}
          >
            Le prochain sur la carte, c'est vous ?
          </p>
          <p style={{ fontSize: 14, color: "#555", marginBottom: 20, lineHeight: 1.6 }}>
            Votre cabinet vétérinaire ou animalerie n'est pas encore listé ?
            Rejoignez ParcAChien et soyez visible sur notre carte interactive,
            notre appli mobile et notre site — et bénéficiez des services Velox
            IA pour votre communication digitale.
          </p>
          <a
            href="/partenaires/rejoindre"
            style={{
              display: "inline-block",
              background: "#7C6EF5",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              padding: "12px 28px",
              borderRadius: 10,
              textDecoration: "none",
            }}
          >
            Être référencé maintenant →
          </a>
        </div>

        {/* Autres villes */}
        <section>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#7C6EF5",
              marginBottom: 14,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Autres villes PACA
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {otherCities.map(({ city: c, slug }) => (
              <a
                key={slug}
                href={`/partenaires/${slug}`}
                style={{
                  display: "inline-block",
                  background: "#fff",
                  border: "1px solid #e8e4f0",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 14,
                  color: "#1a1a2e",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {c}
              </a>
            ))}
          </div>
        </section>
      </main>
      <SeoFooter />
    </>
  );
}
