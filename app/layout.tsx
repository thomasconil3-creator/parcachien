import type { Metadata } from "next";
import "./globals.css";
import InstallPWA from "@/components/InstallPWA";
import { ThemeProvider } from "next-themes";
import { LangProvider } from "@/components/LangToggle";

export const metadata: Metadata = {
  title: "ParcAChien — Parcs à chiens en PACA | Espaces canins Marseille, Nice, Toulon",
  description: "Trouvez les parcs à chiens près de chez vous en PACA : Marseille (tous arrondissements), Nice, Toulon, Aix-en-Provence, Avignon. 308+ espaces canins, jardin canin, aire canine, chien sans laisse. Carte interactive, check-in live, communauté.",
  keywords: [
    "parc à chien",
    "parc à chien près de moi",
    "espace canin",
    "jardin canin",
    "aire canine",
    "parc canin",
    "chien sans laisse",
    "promener son chien",
    "parc à chien PACA",
    "parc à chien Marseille",
    "parc à chien Nice",
    "parc à chien Toulon",
    "parc à chien Aix-en-Provence",
    "espace canin Marseille",
    "parc à chien 13008",
    "parc à chien 13006",
    "parc chien marseille arrondissement",
    "parc pour chien",
    "sortie chien",
    "caniparc",
  ],
  openGraph: {
    title: "ParcAChien — Parcs à chiens en PACA | Espaces canins Marseille, Nice, Toulon",
    description: "308+ parcs à chiens en PACA. Marseille, Nice, Toulon, Aix. Carte interactive, check-in live et communauté de propriétaires.",
    siteName: "ParcAChien",
    locale: "fr_FR",
    type: "website",
    url: "https://www.parcachien.com",
    images: [
      {
        url: "https://www.parcachien.com/uguette.jpg",
        width: 1200,
        height: 630,
        alt: "ParcAChien — Parcs à chiens en PACA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ParcAChien — Parcs à chiens PACA | Marseille, Nice, Toulon",
    description: "308+ espaces canins en PACA. Carte interactive, check-in live, arrondissements Marseille.",
    images: ["https://www.parcachien.com/uguette.jpg"],
  },
  alternates: {
    canonical: "https://www.parcachien.com",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LangProvider>
            {children}
            <InstallPWA />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
