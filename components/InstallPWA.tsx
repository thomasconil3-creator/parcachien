"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Écoute l'événement d'installation PWA
    const handler = (e: any) => {
      e.preventDefault(); // Empêche l'affichage automatique de la bannière sur certains navigateurs
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // Affiche la vraie popup d'installation du navigateur
    
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white p-4 rounded-2xl shadow-2xl border border-amber-100 z-50 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5">
      <div className="flex-1">
        <h3 className="font-bold text-[#242019] text-sm">Installer l'Application</h3>
        <p className="text-xs text-gray-500 mt-0.5">Accès rapide depuis l'écran d'accueil</p>
      </div>
      <button 
        onClick={handleInstallClick}
        className="bg-amber-400 hover:bg-amber-500 text-white p-2.5 rounded-xl shadow-sm transition-colors"
        aria-label="Installer ParcAChien"
      >
        <Download size={18} />
      </button>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute -top-2 -right-2 bg-gray-100 text-gray-500 rounded-full p-1 hover:bg-gray-200"
        aria-label="Fermer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  );
}
