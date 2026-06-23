import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable — ParcAChien",
};

export default function NotFound() {
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAF8F5",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 72, marginBottom: 16 }}>🐾</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>
        Oups, cette page s'est sauvée !
      </h1>
      <p style={{ fontSize: 16, color: "#777", marginBottom: 32, maxWidth: 400 }}>
        La page que tu cherches n'existe pas ou a été déplacée. Retourne explorer les parcs !
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href="/"
          style={{
            background: "#7C6EF5",
            color: "#fff",
            padding: "12px 28px",
            borderRadius: 50,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          🗺️ Carte des parcs
        </a>
        <a
          href="/parcs"
          style={{
            background: "#fff",
            color: "#7C6EF5",
            border: "2px solid #7C6EF5",
            padding: "12px 28px",
            borderRadius: 50,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          Tous les parcs
        </a>
      </div>
    </main>
  );
}
