"use client";

import { useState, useEffect } from "react";
import { Park } from "@/lib/parks-data";
import { useStore } from "@/lib/store";
import { computeMatchScore, getMatchLabel } from "@/lib/dogmatch";
import { ParkReport } from "@/lib/types";
import { X, Heart, MapPin, Clock, Shield, AlertTriangle, Calendar, Send, ThumbsUp, Zap, Star, MessageSquare, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getActiveCheckins, getActiveStories, addStory, likeStory, getMyDog } from "@/lib/db";

const REPORT_TYPES: { type: ParkReport["type"]; label: string; emoji: string }[] = [
  { type: "parc_propre",    label: "Parc propre",      emoji: "✅" },
  { type: "portail_casse",  label: "Portail cassé",    emoji: "🔧" },
  { type: "terrain_boueux", label: "Terrain boueux",   emoji: "💧" },
  { type: "fontaine_panne", label: "Fontaine en panne",emoji: "🚿" },
  { type: "sol_glissant",   label: "Sol glissant",     emoji: "⚠️" },
  { type: "chien_excite",   label: "Chien très excité",emoji: "🐕" },
];

const TABS = [
  { id: "live",    label: "Live",     emoji: "🔴" },
  { id: "events",  label: "Events",   emoji: "📅" },
  { id: "stories", label: "Stories",  emoji: "📸" },
  { id: "reports", label: "Signaler", emoji: "⚠️" },
] as const;

type TabId = typeof TABS[number]["id"];

interface Props { park: Park; onClose: () => void; onCheckin: () => void; }

export default function ParkPanel({ park, onClose, onCheckin }: Props) {
  const { addReport, getActiveReports, getEvents, addEvent, favoriteParks, toggleFavorite } = useStore();

  const [tab, setTab] = useState<TabId>("live");
  const [weather, setWeather] = useState<{ temp: number; icon: string } | null>(null);
  const [newEvent, setNewEvent] = useState({ title: "", description: "", date: "", breed: "" });
  const [showEventForm, setShowEventForm] = useState(false);
  const [newStoryText, setNewStoryText] = useState("");
  const [reportSent, setReportSent] = useState<string | null>(null);

  const [checkins, setCheckins] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [myDog, setMyDog] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          setUserId(userData.user.id);
          const dog = await getMyDog(userData.user.id);
          setMyDog(dog);
        }

        const ci = await getActiveCheckins(park.id);
        setCheckins(ci.map((c: any) => ({
          id: c.id, parkId: c.park_id, parkName: c.park_name, city: c.city,
          dogId: c.dog_id, dog: { name: c.dog_name, breed: c.dog_breed, age: 24, weight: 'moyen', gender: 'male', sterilized: true },
          timestamp: new Date(c.created_at).getTime(),
          expiresAt: new Date(c.expires_at).getTime()
        })));

        const st = await getActiveStories();
        setStories(st.filter((s:any) => s.park_id === park.id).map((s:any) => ({
          id: s.id, parkId: s.park_id, parkName: s.park_name, dogName: s.dog_name,
          emoji: s.emoji, text: s.text, likes: s.likes,
          expiresAt: new Date(s.expires_at).getTime()
        })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [park.id]);

  const reports   = getActiveReports(park.id);
  const events    = getEvents(park.id);
  const isFav     = favoriteParks.includes(park.id);
  const myCheckin = myDog ? checkins.find((c) => c.dogId === myDog.id) : null;

  useEffect(() => {
    const opts = [{ temp: 26, icon: "☀️" }, { temp: 22, icon: "⛅" }, { temp: 19, icon: "🌤️" }, { temp: 17, icon: "🌧️" }];
    setWeather(opts[Math.floor(Math.random() * opts.length)]);
  }, [park.id]);

  const statusDot  = checkins.length === 0 ? "bg-gray-300" : checkins.length <= 2 ? "bg-emerald-400" : checkins.length <= 5 ? "bg-amber-400" : "bg-red-400";
  const statusText = checkins.length === 0 ? "Vide" : checkins.length <= 2 ? "Calme" : checkins.length <= 5 ? "Animé" : "Très fréquenté";

  const handleReport = (type: ParkReport["type"]) => {
    addReport(park.id, type);
    setReportSent(type);
    setTimeout(() => setReportSent(null), 2000);
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    addEvent({ ...newEvent, parkId: park.id, createdBy: "local-user" });
    setNewEvent({ title: "", description: "", date: "", breed: "" });
    setShowEventForm(false);
  };

  const handleAddStory = async () => {
    if (!newStoryText.trim() || !myDog || !userId) return;
    try {
      await addStory(userId, { park_id: park.id, park_name: park.name, dog_name: myDog.name, emoji: "📸", text: newStoryText });
      setNewStoryText("");
      const st = await getActiveStories();
      setStories(st.filter((s:any) => s.park_id === park.id).map((s:any) => ({
        id: s.id, parkId: s.park_id, parkName: s.park_name, dogName: s.dog_name,
        emoji: s.emoji, text: s.text, likes: s.likes,
        expiresAt: new Date(s.expires_at).getTime()
      })));
    } catch (e) {
      console.error(e);
    }
  };

  const elapsed = (ts: number) => {
    const m = Math.round((Date.now() - ts) / 60000);
    return m < 60 ? `${m}min` : `${Math.round(m / 60)}h`;
  };

  return (
    <div className="w-96 flex-shrink-0 flex flex-col overflow-hidden z-[400] bg-[#FAF8F5] border-l border-[#E2DDD5]" style={{ boxShadow: "-4px 0 24px rgba(36,32,25,0.06)" }}>

      {/* Header gradient */}
      <div className="bg-gradient-to-br from-[#F59500] to-[#FFAA2C] p-5 text-white flex-shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-3">
            <h2 className="font-display font-800 text-lg leading-tight">{park.name}</h2>
            <div className="flex items-center gap-1 mt-1 opacity-90">
              <MapPin size={12} />
              <span className="text-sm">{park.city} ({park.department})</span>
            </div>
            {park.rating && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={11} fill={park.rating! >= s ? "white" : "none"} className="text-white/80" />
                  ))}
                </div>
                <span className="text-xs font-bold">{park.rating}/5</span>
                {park.reviewCount && <span className="text-xs opacity-75">({park.reviewCount} avis)</span>}
              </div>
            )}
            {park.size && <span className="text-xs opacity-75 mt-0.5 block">📐 {park.size}</span>}
          </div>
          <div className="flex gap-2">
            <button onClick={() => toggleFavorite(park.id)} className={`p-2 rounded-2xl transition-all ${isFav ? "bg-red-400/80" : "bg-white/20 hover:bg-white/30"}`}>
              <Heart size={15} fill={isFav ? "white" : "none"} className="text-white" />
            </button>
            <button onClick={onClose} className="p-2 rounded-2xl bg-white/20 hover:bg-white/30">
              <X size={15} className="text-white" />
            </button>
          </div>
        </div>

        {/* Status row */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full">
            <span className={`w-2 h-2 rounded-full ${statusDot} ${checkins.length > 0 ? "animate-pulse" : ""}`} />
            <span className="text-xs font-semibold">{statusText}</span>
          </div>
          {weather && <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">{weather.icon} {weather.temp}°C</span>}
          {park.fenced && <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1"><Shield size={10} /> Clôturé</span>}
          {park.opening_hours && <span className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1"><Clock size={10} /> Horaires</span>}
          {park.features?.map((f) => (
            <span key={f} className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1"><Zap size={10} /> {f}</span>
          ))}
        </div>

        {/* Check-in */}
        <button
          onClick={onCheckin}
          disabled={!!myCheckin}
          className={`mt-4 w-full py-2.5 rounded-2xl font-semibold text-sm transition-all ${myCheckin ? "bg-white/20 text-white/60 cursor-default" : "bg-white text-amber-600 hover:bg-amber-50 shadow-sm"}`}
        >
          {myCheckin ? "✅ Tu es déjà là !" : "🐾 Je suis là — Check-in"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-[#E2DDD5] flex-shrink-0">
        {TABS.map(({ id, label, emoji }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-3 text-xs font-semibold transition-all border-b-2 ${tab === id ? "border-amber-500 text-amber-600 bg-amber-50/50" : "border-transparent text-[#7D7269] hover:text-[#242019]"}`}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">

        {/* WARNING */}
        {park.warning && (
          <div className="mb-3 bg-red-50 border border-red-200 rounded-2xl p-3 flex items-start gap-2">
            <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 font-medium">{park.warning}</p>
          </div>
        )}

        {/* REVIEWS */}
        {park.reviews && park.reviews.length > 0 && tab === "live" && (
          <div className="mb-3 bg-white rounded-2xl border border-[#E2DDD5] p-3">
            <p className="text-xs font-semibold text-[#7D7269] mb-2 flex items-center gap-1"><MessageSquare size={11} /> Avis de la communauté</p>
            <div className="space-y-2">
              {park.reviews.slice(0, 3).map((r, i) => (
                <p key={i} className="text-xs text-[#242019] leading-relaxed border-l-2 border-amber-300 pl-2 italic">"{r}"</p>
              ))}
            </div>
          </div>
        )}

        {/* LIVE */}
        {tab === "live" && (
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-amber-500" /></div>
            ) : checkins.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">🐾</span>
                </div>
                <p className="text-sm font-semibold text-[#242019]">Aucun chien présent</p>
                <p className="text-xs text-[#7D7269] mt-1">Sois le premier à check-in !</p>
              </div>
            ) : (
              checkins.map((ci) => {
                const score = myDog ? computeMatchScore(myDog, ci.dog) : 0;
                const match = getMatchLabel(score);
                return (
                  <div key={ci.id} className="bg-white rounded-2xl border border-[#E2DDD5] p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                          {myDog && ci.dogId === myDog.id && myDog.photo
                            ? <img src={myDog.photo} alt={myDog.name} className="w-full h-full object-cover" />
                            : <span className="text-sm">🐶</span>}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#242019]">{ci.dog.name}</p>
                          <p className="text-xs text-[#7D7269]">{ci.dog.breed}</p>
                        </div>
                      </div>
                      {myDog && ci.dogId !== myDog.id && (
                        <div className="text-right">
                          <p className={`text-xs font-bold ${match.color}`}>{match.emoji} {score}%</p>
                          <p className={`text-[10px] ${match.color}`}>{match.label}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 text-xs text-[#7D7269]">
                      <span className="bg-[#F2EFE9] px-2 py-0.5 rounded-full">{ci.dog.age < 12 ? `${ci.dog.age}m` : `${Math.floor(ci.dog.age / 12)}ans`}</span>
                      <span className="bg-[#F2EFE9] px-2 py-0.5 rounded-full">{ci.dog.weight}</span>
                      <span className="bg-[#F2EFE9] px-2 py-0.5 rounded-full">{ci.dog.gender === "male" ? "♂️" : "♀️"}</span>
                      {ci.dog.sterilized && <span className="bg-[#F2EFE9] px-2 py-0.5 rounded-full">✂️</span>}
                    </div>
                    <p className="text-xs text-[#7D7269] mt-1.5">⏱ Il y a {elapsed(ci.timestamp)}</p>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* EVENTS */}
        {tab === "events" && (
          <div className="space-y-3">
            {events.length === 0 && !showEventForm && (
              <div className="text-center py-8">
                <span className="text-3xl">📅</span>
                <p className="text-sm text-[#7D7269] mt-2">Aucun événement prévu.</p>
              </div>
            )}
            {events.map((evt) => (
              <div key={evt.id} className="bg-white rounded-2xl border border-[#E2DDD5] p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-amber-500" />
                  <span className="font-semibold text-sm text-[#242019]">{evt.title}</span>
                </div>
                <p className="text-xs text-[#7D7269] mb-1">{evt.description}</p>
                <p className="text-xs text-amber-600 font-medium">
                  {new Date(evt.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                  {evt.breed && ` · 🐕 ${evt.breed}`}
                </p>
              </div>
            ))}
            {showEventForm ? (
              <div className="bg-white rounded-2xl border border-[#E2DDD5] p-3 space-y-2">
                {[
                  { ph: "Titre *", k: "title" as const },
                  { ph: "Description", k: "description" as const },
                  { ph: "Race ciblée (optionnel)", k: "breed" as const },
                ].map(({ ph, k }) => (
                  <input key={k} placeholder={ph} value={newEvent[k]}
                    onChange={(e) => setNewEvent((n) => ({ ...n, [k]: e.target.value }))}
                    className="w-full border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400" />
                ))}
                <input type="date" value={newEvent.date} onChange={(e) => setNewEvent((n) => ({ ...n, date: e.target.value }))}
                  className="w-full border border-[#E2DDD5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400" />
                <div className="flex gap-2">
                  <button onClick={handleAddEvent} className="flex-1 bg-amber-500 text-white text-xs py-2 rounded-xl font-semibold">Publier</button>
                  <button onClick={() => setShowEventForm(false)} className="flex-1 border border-[#E2DDD5] text-[#7D7269] text-xs py-2 rounded-xl">Annuler</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowEventForm(true)}
                className="w-full border-2 border-dashed border-amber-300 text-amber-600 text-xs py-3 rounded-2xl hover:bg-amber-50 transition-colors font-semibold">
                + Créer un événement
              </button>
            )}
          </div>
        )}

        {/* STORIES */}
        {tab === "stories" && (
          <div className="space-y-3">
            {stories.length === 0 && (
              <div className="text-center py-8">
                <span className="text-3xl">📸</span>
                <p className="text-sm text-[#7D7269] mt-2">Aucune story pour ce parc.</p>
              </div>
            )}
            {stories.map((story) => {
              const h = Math.max(0, Math.round((story.expiresAt - Date.now()) / 3600000));
              return (
                <div key={story.id} className="bg-white rounded-2xl border border-[#E2DDD5] p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-[#242019]">{story.emoji} {story.dogName}</span>
                    <span className="text-xs text-[#7D7269]">expire dans {h}h</span>
                  </div>
                  <p className="text-sm text-[#242019] leading-relaxed mb-2">{story.text}</p>
                  <button onClick={async () => {
                    await likeStory(story.id, story.likes);
                    setStories(stories.map(s => s.id === story.id ? { ...s, likes: s.likes + 1 } : s));
                  }} className="flex items-center gap-1 text-xs text-pink-500 hover:text-pink-600 transition-colors">
                    <ThumbsUp size={12} /> {story.likes}
                  </button>
                </div>
              );
            })}
            <div className="bg-white rounded-2xl border border-[#E2DDD5] p-3">
              <textarea placeholder="Partage un moment ici..." value={newStoryText} onChange={(e) => setNewStoryText(e.target.value)}
                rows={2} className="w-full text-xs resize-none focus:outline-none text-[#242019] placeholder-[#7D7269]" />
              <div className="flex justify-end mt-2">
                <button onClick={handleAddStory} disabled={!newStoryText.trim()}
                  className="flex items-center gap-1 bg-amber-500 disabled:opacity-40 text-white text-xs px-3 py-1.5 rounded-xl font-semibold">
                  <Send size={11} /> Publier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REPORTS */}
        {tab === "reports" && (
          <div className="space-y-3">
            {reports.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
                <p className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1"><AlertTriangle size={12} /> Signalements actifs</p>
                {reports.map((r) => {
                  const rt = REPORT_TYPES.find((t) => t.type === r.type);
                  return <p key={r.id} className="text-xs text-amber-600">{rt?.emoji} {rt?.label}</p>;
                })}
              </div>
            )}
            <p className="text-xs font-semibold text-[#7D7269]">Signaler une situation :</p>
            <div className="grid grid-cols-2 gap-2">
              {REPORT_TYPES.map(({ type, label, emoji }) => (
                <button key={type} onClick={() => handleReport(type)}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-semibold border transition-all text-left ${reportSent === type ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-[#E2DDD5] hover:border-amber-400 hover:bg-amber-50 text-[#242019]"}`}
                >
                  {emoji} {reportSent === type ? "Envoyé !" : label}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#7D7269] mt-1">Signalements anonymes · expirent après 24h.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#E2DDD5] px-4 py-2 bg-white flex justify-between text-xs text-[#7D7269] flex-shrink-0">
        <span>🐾 {checkins.length} présent{checkins.length > 1 ? "s" : ""}</span>
        <span>📅 {events.length}</span>
        <span>📸 {stories.length}</span>
        <span>⚠️ {reports.length}</span>
      </div>
    </div>
  );
}
