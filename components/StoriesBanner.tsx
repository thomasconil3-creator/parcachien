"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { getActiveStories, addStory } from "@/lib/db";
import { PACA_PARKS } from "@/lib/parks-data";
import { X, MapPin, Camera, Send, Plus, Heart, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const supabase = createClient();
const EMOJIS = ["🐶", "🐕", "🦮", "🐩", "🏃", "🎾", "🌳", "🐾", "💛", "😎", "🥳", "❤️"];

interface Props { onParkSelect?: (parkId: string) => void; }

function timeLeft(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return "expiré";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h` : `${m}min`;
}

export default function StoriesBanner({ onParkSelect }: Props) {
  const [stories, setStories] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [dogName, setDogName] = useState("");

  // Viewer
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIdx, setViewerIdx] = useState(0);
  const [viewerProgress, setViewerProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Composer
  const [composerOpen, setComposerOpen] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [storyPark, setStoryPark] = useState("");
  const [storyEmoji, setStoryEmoji] = useState("🐾");
  const [storyPhoto, setStoryPhoto] = useState<string | null>(null);
  const [storyPhotoFile, setStoryPhotoFile] = useState<File | null>(null);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    load();
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const { data: dog } = await supabase.from("dogs").select("name").eq("user_id", uid).limit(1).single();
        if (dog) setDogName(dog.name);
      }
    });
    const ch = supabase.channel("stories-live").on("postgres_changes", { event: "*", schema: "public", table: "stories" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function load() {
    const data = await getActiveStories();
    setStories(data);
  }

  useEffect(() => {
    if (!viewerOpen) return;
    setViewerProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    progressRef.current = setInterval(() => {
      setViewerProgress(p => {
        if (p >= 100) {
          if (viewerIdx < stories.length - 1) { setViewerIdx(i => i + 1); return 0; }
          else { setViewerOpen(false); return 0; }
        }
        return p + 2;
      });
    }, 60);
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [viewerOpen, viewerIdx, stories.length]);

  const handleLike = async (story: any) => {
    await supabase.from("stories").update({ likes: story.likes + 1 }).eq("id", story.id);
    setStories(prev => prev.map(s => s.id === story.id ? { ...s, likes: s.likes + 1 } : s));
  };

  const handlePhotoSelect = (file: File) => {
    setStoryPhotoFile(file);
    const r = new FileReader();
    r.onload = e => setStoryPhoto(e.target?.result as string);
    r.readAsDataURL(file);
  };

  const handlePost = async () => {
    if (!userId || (!storyText.trim() && !storyPark)) return;
    setPosting(true);
    try {
      const park = PACA_PARKS.find(p => p.id === storyPark);
      await addStory(userId, {
        park_id: storyPark || "paca",
        park_name: park?.name || "PACA",
        dog_name: dogName || "Mon chien",
        emoji: storyEmoji,
        text: storyText || `${dogName} est là !`,
      });
      setStoryText(""); setStoryPark(""); setStoryEmoji("🐾"); setStoryPhoto(null); setStoryPhotoFile(null);
      setComposerOpen(false);
      await load();
    } catch (e) { console.error(e); }
    setPosting(false);
  };

  const current = stories[viewerIdx];

  return (
    <>
      {/* ── STRIP ── */}
      <div className="glass-dark border-b border-white/10 px-3 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide z-20 flex-shrink-0">
        {userId && (
          <button onClick={() => setComposerOpen(true)} className="flex-shrink-0 flex flex-col items-center gap-1.5 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform border-2 border-white/30">
              <Plus size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold text-gray-200 uppercase tracking-wider">Ma story</span>
          </button>
        )}
        {userId && stories.length > 0 && <div className="w-px h-10 bg-white/10 flex-shrink-0" />}
        {stories.map((story, idx) => (
          <button key={story.id} onClick={() => { setViewerIdx(idx); setViewerOpen(true); }} className="flex-shrink-0 flex flex-col items-center gap-1.5 group">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C6EF5] to-[#F59500] p-0.5 group-hover:scale-105 transition-transform shadow-md">
                <div className="w-full h-full rounded-[10px] bg-gray-800 flex items-center justify-center text-2xl">{story.emoji || "🐾"}</div>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full border border-gray-900">{timeLeft(story.expires_at)}</span>
            </div>
            <span className="text-[10px] font-bold text-gray-200 truncate max-w-[56px] uppercase tracking-wider">{story.dog_name}</span>
          </button>
        ))}
        {stories.length === 0 && userId && <p className="text-gray-400 text-xs px-2 italic">Poste la première story !</p>}
      </div>

      {/* ── VIEWER ── */}
      {viewerOpen && current && (
        <div className="fixed inset-0 z-[2000] bg-black flex flex-col" onClick={() => setViewerOpen(false)}>
          <div className="flex gap-1 px-3 pt-4 flex-shrink-0" onClick={e => e.stopPropagation()}>
            {stories.map((_, i) => (
              <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: i < viewerIdx ? "100%" : i === viewerIdx ? `${viewerProgress}%` : "0%", transition: i === viewerIdx ? "none" : undefined }} />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 py-3" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C6EF5] to-[#F59500] flex items-center justify-center text-xl">{current.emoji}</div>
              <div>
                <p className="text-white font-bold text-sm">{current.dog_name}</p>
                <div className="flex items-center gap-1 text-white/60 text-xs">
                  <MapPin size={10} /><span>{current.park_name}</span><span>·</span><span>{timeLeft(current.expires_at)} restant</span>
                </div>
              </div>
            </div>
            <button onClick={() => setViewerOpen(false)} className="text-white/80 hover:text-white p-1"><X size={22} /></button>
          </div>
          <div className="flex-1 flex items-center justify-center relative" onClick={e => e.stopPropagation()}>
            <div className="absolute left-0 top-0 bottom-0 w-1/3 z-10" onClick={() => { if (viewerIdx > 0) { setViewerIdx(i => i - 1); setViewerProgress(0); } }} />
            <div className="absolute right-0 top-0 bottom-0 w-1/3 z-10" onClick={() => { if (viewerIdx < stories.length - 1) { setViewerIdx(i => i + 1); setViewerProgress(0); } else setViewerOpen(false); }} />
            <div className="w-full max-w-sm mx-4">
              <div className="bg-gradient-to-br from-[#7C6EF5]/30 to-[#F59500]/30 rounded-3xl border border-white/10 p-8 text-center backdrop-blur-sm">
                <div className="text-7xl mb-5">{current.emoji}</div>
                {current.park_name && (
                  <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                    <MapPin size={12} /><span>{current.park_name}</span>
                  </div>
                )}
                <p className="text-white text-lg font-bold leading-relaxed">{current.text}</p>
              </div>
            </div>
            {viewerIdx > 0 && <button className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-20" onClick={() => { setViewerIdx(i => i - 1); setViewerProgress(0); }}><ChevronLeft size={28} /></button>}
            {viewerIdx < stories.length - 1 && <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-20" onClick={() => { setViewerIdx(i => i + 1); setViewerProgress(0); }}><ChevronRight size={28} /></button>}
          </div>
          <div className="px-5 py-5 flex items-center justify-between" onClick={e => e.stopPropagation()}>
            <button onClick={() => handleLike(current)} className="flex items-center gap-2 text-white/80 hover:text-red-400 transition-colors">
              <Heart size={22} /><span className="text-sm font-bold">{current.likes || 0}</span>
            </button>
            <button onClick={() => { onParkSelect?.(current.park_id); setViewerOpen(false); }} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors">
              <MapPin size={15} /> Voir sur la carte
            </button>
          </div>
        </div>
      )}

      {/* ── COMPOSER ── */}
      {composerOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#7C6EF5] to-[#F59500] p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-black text-base" style={{ fontFamily: "'Nunito', sans-serif" }}>Nouvelle Story 📸</p>
                <p className="text-white/70 text-xs">Visible 24h · {dogName || "Mon chien"}</p>
              </div>
              <button onClick={() => setComposerOpen(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Humeur</p>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map(e => (
                    <button key={e} onClick={() => setStoryEmoji(e)} className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${storyEmoji === e ? "bg-[#7C6EF5]/10 border-2 border-[#7C6EF5] scale-110" : "bg-gray-50 border border-gray-200 hover:scale-110"}`}>{e}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Photo (optionnel)</p>
                <div onClick={() => fileRef.current?.click()} className="h-20 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#7C6EF5] transition-colors overflow-hidden relative">
                  {storyPhoto ? <img src={storyPhoto} className="w-full h-full object-cover" alt="" /> : <div className="flex items-center gap-2 text-gray-400"><Camera size={18} /><span className="text-xs">Ajouter une photo</span></div>}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoSelect(f); }} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</p>
                <textarea value={storyText} onChange={e => setStoryText(e.target.value)} placeholder={`${dogName || "Mon chien"} est au parc ! 🐾`} rows={2} className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C6EF5] resize-none" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"><MapPin size={11} className="inline mr-1" />Taguer un parc</p>
                <select value={storyPark} onChange={e => setStoryPark(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C6EF5] bg-white text-gray-700">
                  <option value="">Choisir un parc...</option>
                  {PACA_PARKS.slice(0, 80).map(p => <option key={p.id} value={p.id}>{p.name} — {p.city}</option>)}
                </select>
              </div>
              <button onClick={handlePost} disabled={posting || (!storyText.trim() && !storyPark)} className="w-full py-3.5 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #7C6EF5, #F59500)" }}>
                {posting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                Publier ma story !
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
