"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { Bell, X } from "lucide-react";

export default function NotificationToast() {
  const { notifications, clearNotification, favoriteParks, getActiveCheckins, addNotification } = useStore();

  // Simule une notification quand un parc favori a de l'activité
  useEffect(() => {
    if (favoriteParks.length === 0) return;
    const interval = setInterval(() => {
      const parkId = favoriteParks[Math.floor(Math.random() * favoriteParks.length)];
      const count = getActiveCheckins(parkId).length;
      if (count > 0) {
        const { PACA_PARKS } = require("@/lib/parks-data");
        const park = PACA_PARKS.find((p: any) => p.id === parkId);
        if (park) {
          addNotification(`🐶 ${count} chien${count > 1 ? "s" : ""} au ${park.name} en ce moment !`, parkId);
        }
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [favoriteParks]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[2000] flex flex-col gap-2 max-w-xs">
      {notifications.slice(0, 3).map((n) => (
        <div key={n.id} className="bg-white border border-gray-200 rounded-2xl shadow-lg p-3 flex items-start gap-3 animate-in slide-in-from-right">
          <div className="w-8 h-8 bg-[#7C6EF5] rounded-xl flex items-center justify-center flex-shrink-0">
            <Bell size={14} className="text-white" />
          </div>
          <p className="text-sm text-gray-800 flex-1 leading-snug">{n.message}</p>
          <button onClick={() => clearNotification(n.id)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
