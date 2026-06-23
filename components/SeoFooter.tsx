const CITIES = [
  { label: "Marseille", slug: "marseille" },
  { label: "Nice", slug: "nice" },
  { label: "Toulon", slug: "toulon" },
  { label: "Aix-en-Provence", slug: "aix-en-provence" },
  { label: "Avignon", slug: "avignon" },
  { label: "Cannes", slug: "cannes" },
  { label: "Martigues", slug: "martigues" },
  { label: "Cagnes-sur-Mer", slug: "cagnes-sur-mer" },
];

export default function SeoFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid #e8e4f0",
        marginTop: 64,
        paddingTop: 40,
        paddingBottom: 40,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#7C6EF5", marginBottom: 14 }}>
              Parcs par ville
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {CITIES.map(({ label, slug }) => (
                <li key={slug} style={{ marginBottom: 8 }}>
                  <a href={`/parcs/${slug}`} style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>
                    🐾 Parcs à chiens à {label}
                  </a>
                </li>
              ))}
              <li style={{ marginTop: 10 }}>
                <a href="/parcs" style={{ fontSize: 13, color: "#7C6EF5", fontWeight: 600, textDecoration: "none" }}>
                  Voir tous les parcs →
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#7C6EF5", marginBottom: 14 }}>
              Blog
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 8 }}>
                <a href="/blog/top-10-parcs-chiens-marseille-2026" style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>
                  Top 10 parcs à Marseille
                </a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="/blog/preparer-premiere-visite-parc-canin" style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>
                  Préparer la première visite
                </a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="/blog/velox-ia-agence-derriere-parcachien" style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>
                  Velox IA & ParcAChien
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#7C6EF5", marginBottom: 14 }}>
              ParcAChien
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 8 }}>
                <a href="/" style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>🗺️ Carte interactive</a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="/blog" style={{ fontSize: 14, color: "#555", textDecoration: "none" }}>📝 Blog</a>
              </li>
            </ul>
            <p style={{ fontSize: 12, color: "#bbb", marginTop: 20 }}>
              © 2026 ParcAChien · Velox IA<br />
              contact@parcachien.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
