"use client";

import { useStore } from "@/lib/store";
import { ALL_BADGES } from "@/lib/types";
import { X, TrendingUp, MapPin, PawPrint } from "lucide-react";
import { PACA_PARKS } from "@/lib/parks-data";

interface Props {
  onClose: () => void;
  onEditDog: () => void;
}

export default function StatsDrawer({ onClose, onEditDog }: Props) {
  const { myDog, stats, favoriteParks, getActiveCheckins } = useStore();

  const uniqueParks = new Set(stats.history.map((h) => h.parkId)).size;
  const favParks = PACA_PARKS.filter((p) => favoriteParks.includes(p.id));

  return (
    <div className="fixed inset-0 bg-black/40 z-[900] flex justify-end">
      <div className="bg-white w-80 h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="bg-gradient-to-br from-[#F59500] to-[#FFAA2C] p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Mon profil</h2>
            <button onClick={onClose} className="p-1 bg-white/20 rounded-full"><X size={16} className="text-white" /></button>
          </div>
          {myDog ? (
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl overflow-hidden mb-3 flex-shrink-0">
                {myDog.photo
                  ? <img src={myDog.photo} alt={myDog.name} className="w-full h-full object-cover" />
                  : <span className="w-full h-full flex items-center justify-center text-3xl">🐶</span>}
              </div>
              <p className="font-bold text-xl">{myDog.name}</p>
              <p className="text-sm opacity-90">{myDog.breed} · {myDog.age < 12 ? `${myDog.age} mois` : `${Math.floor(myDog.age / 12)} ans`} · {myDog.gender === "male" ? "♂️" : "♀️"}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {myDog.character.map((t) => (
                  <span key={t} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <button onClick={onEditDog} className="mt-3 w-full bg-white/20 hover:bg-white/30 text-white text-xs py-2 rounded-xl font-medium transition-colors">
                ✏️ Modifier le profil
              </button>
            </div>
          ) : (
            <button onClick={onEditDog} className="w-full bg-white text-amber-500 py-2 rounded-xl font-semibold text-sm">
              + Créer le profil de mon chien
            </button>
          )}
        </div>

        <div className="p-4 space-y-4">
          {/* Stats */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <TrendingUp size={12} /> Statistiques
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Check-ins", value: stats.totalCheckins, emoji: "🐾" },
                { label: "Parcs visités", value: uniqueParks, emoji: "🗺️" },
                { label: "Favoris", value: favoriteParks.length, emoji: "❤️" },
              ].map(({ label, value, emoji }) => (
                <div key={label} className="bg-purple-50 rounded-xl p-2.5 text-center">
                  <p className="text-lg">{emoji}</p>
                  <p className="font-bold text-amber-500 text-lg">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Badges</p>
            <div className="space-y-2">
              {ALL_BADGES.map((badge) => {
                const unlocked = stats.badges.find((b) => b.id === badge.id);
                return (
                  <div key={badge.id} className={`flex items-center gap-3 p-2 rounded-xl ${unlocked ? "bg-amber-50 border border-amber-100" : "bg-gray-50 opacity-50"}`}>
                    <span className="text-xl w-8 text-center">{badge.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{badge.name}</p>
                      <p className="text-xs text-gray-500">{badge.description}</p>
                    </div>
                    {unlocked && <span className="ml-auto text-green-500 text-xs">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Favoris */}
          {favParks.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                <MapPin size={12} /> Parcs favoris
              </p>
              <div className="space-y-1.5">
                {favParks.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                    <span className="text-red-400">❤️</span>
                    <div>
                      <p className="text-xs font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.city}</p>
                    </div>
                    <span className="ml-auto text-xs text-green-600">
                      {getActiveCheckins(p.id).length} 🐶
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historique */}
          {stats.history.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Dernières visites</p>
              <div className="space-y-1.5">
                {stats.history.slice(0, 5).map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-600 py-1 border-b border-gray-50">
                    <PawPrint size={10} className="text-amber-500" />
                    <span className="flex-1 font-medium">{h.parkName}</span>
                    <span className="text-gray-400">{new Date(h.date).toLocaleDateString("fr-FR")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
