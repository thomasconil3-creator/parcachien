"use client";

import { Park } from "@/lib/parks-data";
import { MapPin, Clock, Shield, Zap, Navigation } from "lucide-react";

interface ParkCardProps {
  park: Park;
  checkinCount?: number;
  onCheckin?: (e: React.MouseEvent) => void;
  distance?: number;
}

const STATUS = [
  { max: 0,  label: "Vide",          dot: "bg-gray-300",   badge: "bg-gray-100 text-gray-500" },
  { max: 2,  label: "Calme",         dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700" },
  { max: 5,  label: "Animé",         dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700" },
  { max: 999,label: "Très fréquenté",dot: "bg-red-400",     badge: "bg-red-50 text-red-600" },
];

function getStatus(count: number) {
  return STATUS.find((s) => count <= s.max) ?? STATUS[STATUS.length - 1];
}

export default function ParkCard({ park, checkinCount = 0, onCheckin, distance }: ParkCardProps) {
  const status = getStatus(checkinCount);

  return (
    <div className="glass rounded-3xl overflow-hidden card-hover group relative">
      {/* Subtle background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Color header band */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-amber-600 opacity-80" />

      <div className="p-5 relative z-10">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-700 text-[#242019] text-sm leading-tight line-clamp-2">{park.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={11} className="text-[#7D7269] flex-shrink-0" />
              <span className="text-xs text-[#7D7269] truncate">{park.city}</span>
              {distance !== undefined && (
                <span className="flex items-center gap-0.5 text-xs text-amber-600 font-semibold ml-1">
                  <Navigation size={9} />
                  {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
                </span>
              )}
            </div>
          </div>

          {/* Status badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${status.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${checkinCount > 0 ? "animate-pulse" : ""}`} />
            {status.label}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4 mt-2">
          {park.fenced && (
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider bg-white/50 border border-white/60 text-[#7D7269] px-2 py-0.5 rounded-full font-bold shadow-sm">
              <Shield size={10} /> Clôturé
            </span>
          )}
          {park.opening_hours && (
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider bg-white/50 border border-white/60 text-[#7D7269] px-2 py-0.5 rounded-full font-bold shadow-sm">
              <Clock size={10} /> Horaires
            </span>
          )}
          {park.features?.slice(0, 2).map((f) => (
            <span key={f} className="flex items-center gap-1 text-[10px] uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-700 px-2 py-0.5 rounded-full font-bold shadow-sm">
              <Zap size={10} /> {f}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-200/50">
          <span className="text-[11px] font-semibold text-[#7D7269] uppercase tracking-wide">
            {checkinCount > 0
              ? `🐶 ${checkinCount} chien${checkinCount > 1 ? "s" : ""}`
              : "Aucun chien"}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onCheckin?.(e); }}
            className="text-xs bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white px-4 py-2 rounded-full font-bold transition-all shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/40 hover:-translate-y-0.5"
          >
            Je suis là !
          </button>
        </div>
      </div>
    </div>
  );
}
