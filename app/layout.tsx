import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ParcAChien — Parcs à chiens en PACA",
  description: "Trouve les parcs à chiens près de chez toi en région PACA. Check-in live, compatibilité canine, communauté.",
  openGraph: {
    title: "ParcAChien — Parcs à chiens en PACA",
    description: "308+ parcs à chiens en PACA. Carte interactive, check-in live et communauté de propriétaires.",
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
    title: "ParcAChien — Parcs à chiens en PACA",
    description: "308+ parcs à chiens en PACA. Carte interactive, check-in live.",
    images: ["https://www.parcachien.com/uguette.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="h-full flex flex-col bg-[#FAF8F5]">{children}</body>
    </html>
  );
}
