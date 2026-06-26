"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trophy, Crown, Heart, Camera, Upload, Star, Timer, Users, ChevronRight, Loader2, X, Sparkles } from "lucide-react";

const supabase = createClient();

function timeLeft(end: string) {
  const diff = new Date(end).getTime() - Date.now();
  if (diff <= 0) return "Terminé";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}j ${h}h`;
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
}

const DEMO_ENTRIES = [
  { id: "d1", dog_name: "Luna", dog_breed: "Golden Retriever", photo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80", vote_count: 142, user_id: "demo1" },
  { id: "d2", dog_name: "Rocky", dog_breed: "Labrador", photo: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80", vote_count: 98, user_id: "demo2" },
  { id: "d3", dog_name: "Bella", dog_breed: "Berger Australien", photo: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&q=80", vote_count: 87, user_id: "demo3" },
  { id: "d4", dog_name: "Max", dog_breed: "Border Collie", photo: "https://images.unsplash.com/photo-1581888227599-779811939961?w=400&q=80", vote_count: 65, user_id: "demo4" },
  { id: "d5", dog_name: "Nala", dog_breed: "Husky", photo: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&q=80", vote_count: 54, user_id: "demo5" },
  { id: "d6", dog_name: "Charlie", dog_breed: "Beagle", photo: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=400&q=80", vote_count: 43, user_id: "demo6" },
];

const DEMO_CONTEST = {
  id: "demo",
  title: "🏆 Election du Plus Beau Chien — Juin 2026",
  description: "Votez pour votre coup de coeur ! Le gagnant sera mis à la une de ParcAChien tout le mois de juillet.",
  end_date: new Date(Date.now() + 5 * 86400000 + 3 * 3600000).toISOString(),
  active: true,
};

export default function ConcoursPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [dogName, setDogName] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [dogPhoto, setDogPhoto] = useState("");
  const [contest, setContest] = useState<any>(DEMO_CONTEST);
  const [entries, setEntries] = useState<any[]>(DEMO_ENTRIES);
  const [myVote, setMyVote] = useState<string | null>(null);
  const [showParticipe, setShowParticipe] = useState(false);
  const [voting, setVoting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tick, setTick] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (!uid) return;

      const { data: dog } = await supabase.from("dogs").select("name,breed,photo").eq("user_id", uid).limit(1).single();
      if (dog) { setDogName(dog.name); setDogBreed(dog.breed); if (dog.photo) setDogPhoto(dog.photo); }

      // Charger le concours actif
      const { data: activeContest } = await supabase.from("contests").select("*").eq("active", true).order("created_at", { ascending: false }).limit(1).single();
      if (activeContest) {
        setContest(activeContest);
        const { data: contestEntries } = await supabase.from("contest_entries").select("*").eq("contest_id", activeContest.id).order("vote_count", { ascending: false });
        if (contestEntries && contestEntries.length > 0) setEntries(contestEntries);

        const { data: myVoteData } = await supabase.from("contest_votes").select("entry_id").eq("contest_id", activeContest.id).eq("voter_id", uid).single();
        if (myVoteData) setMyVote(myVoteData.entry_id);
      }
    });
  }, []);

  const handleVote = async (entryId: string) => {
    if (!userId || myVote || voting || contest.id === "demo") return;
    setVoting(entryId);
    try {
      await supabase.from("contest_votes").insert({ contest_id: contest.id, voter_id: userId, entry_id: entryId });
      await supabase.from("contest_entries").update({ vote_count: entries.find(e => e.id === entryId)!.vote_count + 1 }).eq("id", entryId);
      setMyVote(entryId);
      setEntries(prev => prev.map(e => e.id === entryId ? { ...e, vote_count: e.vote_count + 1 } : e).sort((a, b) => b.vote_count - a.vote_count));
    } catch (e) { console.error(e); }
    setVoting(null);
  };

  const handleDemoVote = (entryId: string) => {
    if (myVote || voting) return;
    setVoting(entryId);
    setTimeout(() => {
      setMyVote(entryId);
      setEntries(prev => prev.map(e => e.id === entryId ? { ...e, vote_count: e.vote_count + 1 } : e).sort((a, b) => b.vote_count - a.vote_count));
      setVoting(null);
    }, 600);
  };

  const handlePhotoUpload = async (file: File) => {
    if (!userId) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `contest/${userId}_${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("dog-photos").upload(path, file, { upsert: true });
      if (!error) {
        const { data } = supabase.storage.from("dog-photos").getPublicUrl(path);
        setDogPhoto(data.publicUrl);
      }
    } catch (e) { console.error(e); }
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!userId || !dogPhoto || !dogName || contest.id === "demo") return;
    setUploading(true);
    try {
      await supabase.from("contest_entries").insert({
        contest_id: contest.id, user_id: userId,
        dog_name: dogName, dog_breed: dogBreed, photo: dogPhoto, vote_count: 0,
      });
      setSubmitted(true);
      setShowParticipe(false);
    } catch (e) { console.error(e); }
    setUploading(false);
  };

  const sorted = [...entries].sort((a, b) => b.vote_count - a.vote_count);
  const total = sorted.reduce((s, e) => s + e.vote_count, 0);
  const podium = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const MEDALS = ["🥇", "🥈", "🥉"];
  const MEDAL_COLORS = [
    "from-amber-400 to-amber-600 shadow-amber-300",
    "from-gray-300 to-gray-500 shadow-gray-300",
    "from-orange-400 to-orange-600 shadow-orange-300",
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5]">

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#7C6EF5] via-[#9B8BF7] to-[#F59500] px-5 pt-6 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {["🐾","🐾","🐾","🐾","🐾","🐾","🐾","🐾","🐾","🐾","🐾","🐾"].map((p,i) => (
            <span key={i} className="absolute text-4xl" style={{ left: `${(i*17)%95}%`, top: `${(i*23)%80}%`, transform: `rotate(${i*30}deg)` }}>{p}</span>
          ))}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Concours Live</span>
            <span className="flex items-center gap-1 bg-red-500/80 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Live
            </span>
          </div>
          <h1 className="text-2xl font-black text-white leading-tight mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {contest.title}
          </h1>
          <p className="text-white/80 text-sm leading-relaxed mb-4">{contest.description}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-3 py-2">
              <Timer size={14} className="text-white" />
              <span className="text-white font-bold text-sm">{timeLeft(contest.end_date)}</span>
              <span className="text-white/60 text-xs">restant</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-3 py-2">
              <Users size={14} className="text-white" />
              <span className="text-white font-bold text-sm">{sorted.length}</span>
              <span className="text-white/60 text-xs">participants</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-3 py-2">
              <Heart size={14} className="text-white" />
              <span className="text-white font-bold text-sm">{total}</span>
              <span className="text-white/60 text-xs">votes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-10 pb-8">

        {/* Podium */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-5 mb-5">
          <h2 className="text-base font-black text-gray-800 flex items-center gap-2 mb-4" style={{ fontFamily: "'Nunito', sans-serif" }}>
            <Crown size={18} className="text-amber-500" /> Podium actuel
          </h2>
          <div className="flex items-end justify-center gap-3">
            {/* 2ème */}
            {podium[1] && (
              <div className="flex flex-col items-center flex-1">
                <div className={`w-16 h-16 rounded-2xl overflow-hidden border-4 bg-gradient-to-br ${MEDAL_COLORS[1]} p-0.5 shadow-lg`}>
                  <img src={podium[1].photo} alt={podium[1].dog_name} className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-lg">🥈</div>
                  <p className="text-xs font-bold text-gray-800 truncate max-w-[70px]">{podium[1].dog_name}</p>
                  <p className="text-[10px] text-gray-500">{podium[1].vote_count} votes</p>
                </div>
                <div className="w-full bg-gray-200 rounded-t-lg mt-2" style={{ height: 50 }} />
              </div>
            )}
            {/* 1er */}
            {podium[0] && (
              <div className="flex flex-col items-center flex-1">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-2xl overflow-hidden border-4 bg-gradient-to-br ${MEDAL_COLORS[0]} p-0.5 shadow-xl`}>
                    <img src={podium[0].photo} alt={podium[0].dog_name} className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <span className="absolute -top-3 -right-2 text-2xl">👑</span>
                </div>
                <div className="mt-2 text-center">
                  <div className="text-lg">🥇</div>
                  <p className="text-sm font-black text-gray-800 truncate max-w-[80px]">{podium[0].dog_name}</p>
                  <p className="text-[10px] text-amber-600 font-bold">{podium[0].vote_count} votes</p>
                </div>
                <div className="w-full bg-amber-400 rounded-t-lg mt-2" style={{ height: 70 }} />
              </div>
            )}
            {/* 3ème */}
            {podium[2] && (
              <div className="flex flex-col items-center flex-1">
                <div className={`w-16 h-16 rounded-2xl overflow-hidden border-4 bg-gradient-to-br ${MEDAL_COLORS[2]} p-0.5 shadow-lg`}>
                  <img src={podium[2].photo} alt={podium[2].dog_name} className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-lg">🥉</div>
                  <p className="text-xs font-bold text-gray-800 truncate max-w-[70px]">{podium[2].dog_name}</p>
                  <p className="text-[10px] text-gray-500">{podium[2].vote_count} votes</p>
                </div>
                <div className="w-full bg-orange-300 rounded-t-lg mt-2" style={{ height: 35 }} />
              </div>
            )}
          </div>
        </div>

        {/* CTA participer */}
        {!submitted && (
          <button
            onClick={() => userId ? setShowParticipe(true) : window.location.href = "/login"}
            className="w-full mb-5 py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-3 shadow-xl transition-transform active:scale-95"
            style={{ background: "linear-gradient(135deg, #7C6EF5, #F59500)" }}
          >
            <Sparkles size={20} />
            {userId ? "Inscrire mon chien au concours !" : "Se connecter pour participer"}
          </button>
        )}
        {submitted && (
          <div className="w-full mb-5 py-4 rounded-2xl bg-green-50 border border-green-200 text-center text-green-700 font-bold text-sm">
            ✅ Ton chien est inscrit ! Les votes arrivent...
          </div>
        )}

        {/* Grille de votes */}
        <h2 className="text-base font-black text-gray-800 flex items-center gap-2 mb-3" style={{ fontFamily: "'Nunito', sans-serif" }}>
          <Heart size={16} className="text-red-500" /> Vote pour ton favori
          {!userId && <span className="text-xs font-normal text-gray-400 ml-auto">Connecte-toi pour voter</span>}
          {myVote && <span className="text-xs font-normal text-green-600 ml-auto flex items-center gap-1"><Star size={12} />Vote envoyé !</span>}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {sorted.map((entry, i) => {
            const isVoted = myVote === entry.id;
            const isWinner = i === 0;
            const pct = total > 0 ? Math.round((entry.vote_count / total) * 100) : 0;
            return (
              <div
                key={entry.id}
                className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${isVoted ? "border-[#7C6EF5] shadow-lg shadow-purple-200" : isWinner ? "border-amber-400 shadow-md" : "border-gray-100"}`}
              >
                {/* Photo */}
                <div className="relative h-40 overflow-hidden">
                  <img src={entry.photo} alt={entry.dog_name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {i < 3 && (
                    <div className="absolute top-2 left-2 text-xl">{MEDALS[i]}</div>
                  )}
                  {isVoted && (
                    <div className="absolute top-2 right-2 bg-[#7C6EF5] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Ton vote ✓</div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white font-black text-sm leading-none">{entry.dog_name}</p>
                    <p className="text-white/70 text-[10px]">{entry.dog_breed}</p>
                  </div>
                </div>

                {/* Stats + vote */}
                <div className="p-2.5 bg-white">
                  {/* Barre de progression */}
                  <div className="h-1.5 bg-gray-100 rounded-full mb-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: isVoted ? "#7C6EF5" : "linear-gradient(to right, #F59500, #FFAA2C)" }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-semibold">{entry.vote_count} votes · {pct}%</span>
                    <button
                      onClick={() => contest.id === "demo" ? handleDemoVote(entry.id) : handleVote(entry.id)}
                      disabled={!!myVote || !!voting}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        isVoted
                          ? "bg-[#7C6EF5] text-white"
                          : myVote
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-50 text-red-500 hover:bg-red-100 active:scale-95"
                      }`}
                    >
                      {voting === entry.id ? <Loader2 size={12} className="animate-spin" /> : <Heart size={12} fill={isVoted ? "white" : "none"} />}
                      {isVoted ? "Voté" : "Voter"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Classement complet si > 4 */}
        {rest.length > 0 && (
          <div className="mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 pt-3 pb-2">Classement complet</p>
            {rest.map((entry, i) => (
              <div key={entry.id} className="flex items-center gap-3 px-4 py-2.5 border-t border-gray-50">
                <span className="text-sm font-bold text-gray-400 w-5">{i + 4}</span>
                <img src={entry.photo} alt={entry.dog_name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{entry.dog_name}</p>
                  <p className="text-[10px] text-gray-500">{entry.dog_breed}</p>
                </div>
                <span className="text-xs font-bold text-gray-500">{entry.vote_count} votes</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal participation */}
      {showParticipe && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-gray-800 text-lg" style={{ fontFamily: "'Nunito', sans-serif" }}>🏆 Inscrire mon chien</h3>
              <button onClick={() => setShowParticipe(false)} className="p-1.5 hover:bg-gray-100 rounded-xl"><X size={18} /></button>
            </div>

            {/* Photo */}
            <div className="mb-4">
              <div
                onClick={() => fileRef.current?.click()}
                className="w-full h-44 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#7C6EF5] transition-colors relative"
              >
                {dogPhoto ? (
                  <img src={dogPhoto} alt="Photo" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera size={32} className="text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">Photo de {dogName || "ton chien"}</p>
                    <p className="text-xs text-gray-300 mt-1">Clique pour choisir</p>
                  </>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 size={28} className="text-white animate-spin" />
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }} />
            </div>

            <div className="mb-3">
              <input
                type="text"
                value={dogName}
                onChange={e => setDogName(e.target.value)}
                placeholder="Nom du chien"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C6EF5]"
              />
            </div>
            <div className="mb-5">
              <input
                type="text"
                value={dogBreed}
                onChange={e => setDogBreed(e.target.value)}
                placeholder="Race"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C6EF5]"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!dogPhoto || !dogName || uploading}
              className="w-full py-3.5 rounded-2xl font-black text-white text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #7C6EF5, #F59500)" }}
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Trophy size={18} />}
              Participer au concours !
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
