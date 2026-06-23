"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { PACA_PARKS, Park } from "@/lib/parks-data";
import ParkCard from "@/components/ParkCard";
import ParkPanel from "@/components/ParkPanel";
import DogProfileModal from "@/components/DogProfileModal";
import StatsDrawer from "@/components/StatsDrawer";
import StoriesBanner from "@/components/StoriesBanner";
import NotificationToast from "@/components/NotificationToast";
import FeedPage from "@/components/FeedPage";
import ForumPage from "@/components/ForumPage";
import MessagesPage from "@/components/MessagesPage";
import { useStore } from "@/lib/store";
import { Search, MapIcon, List, PawPrint, User, Navigation, Newspaper, MessageSquare, SlidersHorizontal, MessageCircle, BookOpen } from "lucide-react";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const DEPARTMENTS: Record<string, string> = {
  "": "Tous",
  "13": "Bouches-du-Rhône",
  "83": "Var",
  "06": "Alpes-Maritimes",
  "84": "Vaucluse",
  "04": "Alpes-de-H-P",
  "05": "Hautes-Alpes",
};

const NAV_TABS = [
  { id: "map" as const, icon: MapIcon, label: "Explorer" },
  { id: "feed" as const, icon: Newspaper, label: "Fil actu" },
  { id: "messages" as const, icon: MessageCircle, label: "Messages" },
  { id: "forum" as const, icon: MessageSquare, label: "Forum" },
];

export default function Home() {
  const [section, setSection] = useState<"map" | "feed" | "messages" | "forum">("map");
  const [view, setView] = useState<"map" | "list">("map");
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPark, setSelectedPark] = useState<Park | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyOnly, setNearbyOnly] = useState(false);

  const { myDog, addCheckin, getActiveCheckins, checkins, stats } = useStore();
  const totalCheckins = checkins.filter((c) => c.expiresAt > Date.now()).length;

  const getDistance = useCallback((lat: number, lng: number) => {
    if (!userLocation) return Infinity;
    const R = 6371;
    const dLat = ((lat - userLocation.lat) * Math.PI) / 180;
    const dLng = ((lng - userLocation.lng) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((userLocation.lat * Math.PI) / 180) * Math.cos((lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }, [userLocation]);

  const filteredParks = useMemo(() => {
    let parks = PACA_PARKS.filter((p) => {
      const q = search.toLowerCase();
      const match = p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
      const matchDept = dept === "" || p.department === dept;
      return match && matchDept;
    });
    if (nearbyOnly && userLocation) {
      parks = parks.filter((p) => getDistance(p.lat, p.lng) <= 10);
      parks.sort((a, b) => getDistance(a.lat, a.lng) - getDistance(b.lat, b.lng));
    }
    return parks;
  }, [search, dept, nearbyOnly, userLocation, getDistance]);

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setNearbyOnly(true);
    });
  };

  const handleCheckin = (park: Park) => addCheckin(park.id, park.name, park.city);

  const handleParkFromStory = (parkId: string) => {
    const park = PACA_PARKS.find((p) => p.id === parkId);
    if (park) { setSelectedPark(park); setSection("map"); }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#FAF8F5]">

      {/* ── HEADER ── */}
      <header className="relative z-[500] glass border-b-0 px-4 py-3 flex items-center gap-3 shadow-sm">

        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-[#F59500] to-[#FFAA2C] rounded-2xl flex items-center justify-center shadow-sm shadow-amber-200">
            <PawPrint size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <span className="font-display font-800 text-[#242019] text-lg tracking-tight">ParcAChien</span>
            <span className="ml-1.5 text-[10px] font-semibold text-[#F59500] bg-amber-50 px-1.5 py-0.5 rounded-full hidden sm:inline">PACA</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Ville ou nom du parc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-white/40 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white/60 placeholder-gray-400 text-gray-800 shadow-inner backdrop-blur-md transition-all"
          />
        </div>

        {/* Geo */}
        <button
          onClick={handleGeolocate}
          title="Près de moi"
          className={`p-2.5 rounded-2xl border transition-all ${nearbyOnly ? "bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-200" : "border-[#E2DDD5] text-[#7D7269] hover:border-amber-400 hover:text-amber-500"}`}
        >
          <Navigation size={15} />
        </button>

        {/* Filters toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2.5 rounded-2xl border transition-all ${showFilters ? "bg-amber-500 border-amber-500 text-white" : "border-[#E2DDD5] text-[#7D7269] hover:border-amber-400"}`}
        >
          <SlidersHorizontal size={15} />
        </button>

        {/* Map/List toggle */}
        <div className="flex bg-[#F2EFE9] rounded-2xl p-1">
          {([{ v: "map", Icon: MapIcon, label: "Carte" }, { v: "list", Icon: List, label: "Liste" }] as const).map(({ v, Icon, label }) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${view === v ? "bg-white shadow-sm text-amber-600" : "text-[#7D7269]"}`}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* Blog link */}
        <a
          href="/blog"
          title="Blog"
          className="p-2.5 rounded-2xl border border-[#E2DDD5] text-[#7D7269] hover:border-amber-400 hover:text-amber-500 transition-all hidden sm:flex items-center"
        >
          <BookOpen size={15} />
        </a>

        {/* Parcs link */}
        <a
          href="/parcs"
          title="Tous les parcs"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-2xl border border-[#E2DDD5] text-[#7D7269] hover:border-amber-400 hover:text-amber-500 transition-all"
        >
          <PawPrint size={13} /> Parcs
        </a>

        {/* Profile button */}
        <button
          onClick={() => setShowStats(true)}
          className="relative p-2.5 rounded-2xl border border-[#E2DDD5] hover:border-amber-400 text-[#7D7269] hover:text-amber-500 transition-all"
        >
          <User size={15} />
          {stats.badges.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold shadow-sm">
              {stats.badges.length}
            </span>
          )}
        </button>
      </header>

      {/* ── FILTER BAR (collapsible) ── */}
      {showFilters && (
        <div className="relative z-[499] glass-dark border-b border-white/10 px-4 py-2.5 flex gap-2 overflow-x-auto scrollbar-hide shadow-md">
          {Object.entries(DEPARTMENTS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setDept(key)}
              className={`flex-shrink-0 text-xs font-bold px-4 py-1.5 rounded-full transition-all tracking-wide ${dept === key ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/20" : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── STATS RIBBON ── */}
      <div className="relative z-[498] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-100 px-4 py-1.5 flex items-center gap-4 text-[11px] font-medium tracking-wide border-b border-gray-700/50">
        <span className="flex items-center gap-1.5"><MapIcon size={12} className="text-amber-400"/> <strong>{filteredParks.length}</strong> parcs {nearbyOnly ? "à 10km" : "en PACA"}</span>
        <span className="flex items-center gap-1.5"><PawPrint size={12} className="text-emerald-400"/> <strong>{totalCheckins}</strong> chien{totalCheckins > 1 ? "s" : ""} en live</span>
        {myDog && <span className="hidden sm:flex items-center gap-1.5 text-amber-100 font-bold ml-4"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> {myDog.name}</span>}
        <span className="ml-auto opacity-50 font-mono text-[9px]">OSM</span>
      </div>

      {/* ── STORIES ── */}
      <StoriesBanner onParkSelect={handleParkFromStory} />

      {/* ── MAIN ── */}
      <main className="flex-1 min-h-0 overflow-hidden flex">
        {section === "feed" && <FeedPage />}
        {section === "forum" && <ForumPage />}
        {section === "messages" && <MessagesPage />}
        {section === "map" && (
          view === "map" ? (
            <div className="flex flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 relative min-h-0">
                <Map parks={filteredParks} onParkSelect={setSelectedPark} checkins={checkins} />
              </div>
              {selectedPark && (
                <ParkPanel
                  park={selectedPark}
                  onClose={() => setSelectedPark(null)}
                  onCheckin={() => handleCheckin(selectedPark)}
                />
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
                {filteredParks.map((park) => {
                  const dist = userLocation ? getDistance(park.lat, park.lng) : null;
                  return (
                    <div key={park.id} onClick={() => { setSelectedPark(park); setView("map"); }} className="cursor-pointer">
                      <ParkCard
                        park={park}
                        checkinCount={getActiveCheckins(park.id).length}
                        onCheckin={() => handleCheckin(park)}
                        distance={dist !== null && dist !== Infinity ? dist : undefined}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
      </main>

      {/* ── BOTTOM NAV ── */}
      <nav className="relative z-[500] glass border-t border-white/40 flex pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        {NAV_TABS.map(({ id, icon: Icon, label }, i) => {
          const isCenter = i === 0; // "Explorer" est le plus important
          const active = section === id;
          return (
            <button
              key={id}
              onClick={() => setSection(id)}
              className="flex-1 py-3 flex flex-col items-center gap-1 transition-all group"
            >
              <div className={`p-2 rounded-2xl transition-all duration-300 ${active ? (isCenter ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30 scale-110" : "bg-amber-100/50 text-amber-600 scale-110") : "text-gray-400 group-hover:text-gray-600 group-hover:scale-105"}`}>
                <Icon size={isCenter ? 22 : 20} strokeWidth={active ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${active ? "text-amber-600" : "text-gray-400"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── MODALS ── */}
      {showProfile && <DogProfileModal onClose={() => setShowProfile(false)} />}
      {showStats && <StatsDrawer onClose={() => setShowStats(false)} onEditDog={() => { setShowStats(false); setShowProfile(true); }} />}
      <NotificationToast />
    </div>
  );
}
