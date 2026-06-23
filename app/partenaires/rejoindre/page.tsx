import { Metadata } from "next";
import SeoFooter from "@/components/SeoFooter";

export const metadata: Metadata = {
  title: "Devenir partenaire ParcAChien — Référencer votre vétérinaire ou animalerie",
  description:
    "Référencez votre cabinet vétérinaire, animalerie ou boutique pour chiens sur ParcAChien. Visibilité sur la carte interactive, l'appli mobile et les services Velox IA.",
  alternates: { canonical: "https://www.parcachien.com/partenaires/rejoindre" },
  openGraph: {
    title: "Devenir partenaire ParcAChien",
    description:
      "Rejoignez l'annuaire ParcAChien et bénéficiez des services Velox IA pour votre communication digitale.",
    siteName: "ParcAChien",
    locale: "fr_FR",
    type: "website",
    url: "https://www.parcachien.com/partenaires/rejoindre",
  },
};

const AVANTAGES = [
  {
    icon: "📍",
    title: "Fiche sur la carte interactive",
    desc: "Votre établissement apparaît sur la carte ParcAChien, consultée par des milliers de propriétaires de chiens en PACA chaque mois.",
  },
  {
    icon: "📱",
    title: "Visibilité appli mobile",
    desc: "Présence sur l'application iOS & Android ParcAChien. Vos clients vous trouvent directement depuis leur téléphone.",
  },
  {
    icon: "🚀",
    title: "Services Velox IA inclus",
    desc: "Site web professionnel, SEO local, fiche Google Business optimisée — tout ce qu'il faut pour être trouvé en ligne.",
  },
];

export default function RejoindrePartenairesPaeg() {
  return (
    <>
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
          Devenir partenaire
        </nav>

        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#1a1a2e",
            marginBottom: 10,
          }}
        >
          🐾 Faites partie de ParcAChien
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "#555",
            lineHeight: 1.7,
            marginBottom: 48,
            maxWidth: 680,
          }}
        >
          ParcAChien est LA référence des propriétaires de chiens en PACA :
          carte interactive, communauté, check-in en temps réel, 308+ espaces
          canins. Rejoignez notre annuaire et soyez visible là où vos clients
          cherchent.
        </p>

        {/* Avantages */}
        <section style={{ marginBottom: 52 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#1a1a2e",
              marginBottom: 24,
            }}
          >
            Ce que vous obtenez
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            {AVANTAGES.map(({ icon, title, desc }) => (
              <div
                key={title}
                style={{
                  background: "#f8f7ff",
                  border: "1px solid #e0d9ff",
                  borderRadius: 14,
                  padding: "24px 22px",
                }}
              >
                <p style={{ fontSize: 28, margin: "0 0 10px 0" }}>{icon}</p>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#1a1a2e",
                    margin: "0 0 8px 0",
                  }}
                >
                  {title}
                </p>
                <p style={{ fontSize: 14, color: "#666", margin: 0, lineHeight: 1.6 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Formulaire */}
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#1a1a2e",
              marginBottom: 24,
            }}
          >
            Envoyer votre demande
          </h2>
          <div
            style={{
              background: "#f8f7ff",
              border: "1px solid #e0d9ff",
              borderRadius: 16,
              padding: "36px 32px",
            }}
          >
            <form
              action="mailto:contact@parcachien.com"
              method="GET"
              encType="text/plain"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              {/* Nom établissement — pleine largeur */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  htmlFor="nom"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#555",
                    marginBottom: 6,
                  }}
                >
                  Nom de votre établissement *
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  required
                  placeholder="Ex : Clinique Vétérinaire du Prado"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #e0d9ff",
                    borderRadius: 8,
                    fontSize: 14,
                    color: "#1a1a2e",
                    background: "#fff",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Type */}
              <div>
                <label
                  htmlFor="type"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#555",
                    marginBottom: 6,
                  }}
                >
                  Type d'établissement *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #e0d9ff",
                    borderRadius: 8,
                    fontSize: 14,
                    color: "#1a1a2e",
                    background: "#fff",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Sélectionner...</option>
                  <option value="veterinaire">Vétérinaire</option>
                  <option value="animalerie">Animalerie</option>
                  <option value="toiletteur">Toiletteur</option>
                  <option value="pension">Pension</option>
                  <option value="educateur">Éducateur canin</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              {/* Ville */}
              <div>
                <label
                  htmlFor="ville"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#555",
                    marginBottom: 6,
                  }}
                >
                  Ville *
                </label>
                <input
                  id="ville"
                  name="ville"
                  type="text"
                  required
                  placeholder="Ex : Marseille"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #e0d9ff",
                    borderRadius: 8,
                    fontSize: 14,
                    color: "#1a1a2e",
                    background: "#fff",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Adresse — pleine largeur */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  htmlFor="adresse"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#555",
                    marginBottom: 6,
                  }}
                >
                  Adresse *
                </label>
                <input
                  id="adresse"
                  name="adresse"
                  type="text"
                  required
                  placeholder="Ex : 245 Avenue du Prado, 13008 Marseille"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #e0d9ff",
                    borderRadius: 8,
                    fontSize: 14,
                    color: "#1a1a2e",
                    background: "#fff",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Téléphone */}
              <div>
                <label
                  htmlFor="telephone"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#555",
                    marginBottom: 6,
                  }}
                >
                  Téléphone *
                </label>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  required
                  placeholder="04 91 XX XX XX"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #e0d9ff",
                    borderRadius: 8,
                    fontSize: 14,
                    color: "#1a1a2e",
                    background: "#fff",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#555",
                    marginBottom: 6,
                  }}
                >
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="contact@votrecabinet.fr"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #e0d9ff",
                    borderRadius: 8,
                    fontSize: 14,
                    color: "#1a1a2e",
                    background: "#fff",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Site web — pleine largeur */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  htmlFor="site"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#555",
                    marginBottom: 6,
                  }}
                >
                  Site web{" "}
                  <span style={{ fontWeight: 400, color: "#aaa" }}>
                    (optionnel)
                  </span>
                </label>
                <input
                  id="site"
                  name="site"
                  type="url"
                  placeholder="https://www.votresite.fr"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #e0d9ff",
                    borderRadius: 8,
                    fontSize: 14,
                    color: "#1a1a2e",
                    background: "#fff",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Message — pleine largeur */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  htmlFor="message"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#555",
                    marginBottom: 6,
                  }}
                >
                  Message libre{" "}
                  <span style={{ fontWeight: 400, color: "#aaa" }}>
                    (optionnel)
                  </span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Décrivez votre activité, vos spécialités, vos horaires..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #e0d9ff",
                    borderRadius: 8,
                    fontSize: 14,
                    color: "#1a1a2e",
                    background: "#fff",
                    boxSizing: "border-box",
                    resize: "vertical",
                    fontFamily: "system-ui, sans-serif",
                  }}
                />
              </div>

              {/* Bouton — pleine largeur */}
              <div style={{ gridColumn: "1 / -1" }}>
                <button
                  type="submit"
                  style={{
                    background: "#7C6EF5",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "14px 32px",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Envoyer ma demande
                </button>
                <p
                  style={{
                    fontSize: 12,
                    color: "#aaa",
                    marginTop: 10,
                    textAlign: "center",
                  }}
                >
                  Votre demande sera traitée sous 48h par l'équipe ParcAChien.
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* Déjà client Velox IA */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e8e4f0",
            borderRadius: 14,
            padding: "24px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1a1a2e",
                margin: "0 0 4px 0",
              }}
            >
              Déjà client Velox IA ?
            </p>
            <p style={{ fontSize: 14, color: "#666", margin: 0 }}>
              Votre référencement ParcAChien est inclus dans votre abonnement.
              Contactez-nous pour l'activer.
            </p>
          </div>
          <a
            href="https://velox-ia.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "#f0eeff",
              color: "#7C6EF5",
              fontWeight: 700,
              fontSize: 14,
              padding: "10px 22px",
              borderRadius: 8,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            velox-ia.com →
          </a>
        </div>
      </main>
      <SeoFooter />
    </>
  );
}
