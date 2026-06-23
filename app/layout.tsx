import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ParcAChien — Parcs à chiens en PACA",
  description: "Trouve les parcs à chiens près de chez toi en région PACA. Check-in live, compatibilité canine, communauté.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="h-full flex flex-col bg-[#FAF8F5]">{children}</body>
    </html>
  );
}
