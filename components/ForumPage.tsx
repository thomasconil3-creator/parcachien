"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getForumThreads, addForumThread, addForumReply, likeForumReply } from "@/lib/db";
import { ForumCategory } from "@/lib/types";
import { MessageSquare, ThumbsUp, Eye, ChevronLeft, Pin, Plus, Send, Loader2 } from "lucide-react";

const CATEGORIES: { value: ForumCategory; label: string; emoji: string; active: string; inactive: string }[] = [
  { value: "général",      label: "Général",     emoji: "💬", active: "bg-[#242019] text-white",     inactive: "bg-[#F2EFE9] text-[#7D7269]" },
  { value: "santé",        label: "Santé",        emoji: "🏥", active: "bg-red-500 text-white",       inactive: "bg-red-50 text-red-600" },
  { value: "education",    label: "Éducation",    emoji: "🎓", active: "bg-blue-500 text-white",      inactive: "bg-blue-50 text-blue-600" },
  { value: "bonsplans",    label: "Bons plans",   emoji: "⭐", active: "bg-amber-500 text-white",     inactive: "bg-amber-50 text-amber-700" },
  { value: "perdutrouvé",  label: "Perdu/Trouvé", emoji: "🔍", active: "bg-orange-500 text-white",    inactive: "bg-orange-50 text-orange-600" },
  { value: "événements",   label: "Événements",   emoji: "🎉", active: "bg-purple-500 text-white",    inactive: "bg-purple-50 text-purple-600" },
  { value: "races",        label: "Races",        emoji: "🐕", active: "bg-emerald-500 text-white",   inactive: "bg-emerald-50 text-emerald-700" },
];

const timeAgo = (iso: string) => {
  const d = Date.now() - new Date(iso).getTime();
  if (d < 60000) return "À l'instant";
  if (d < 3600000) return `${Math.round(d / 60000)}min`;
  if (d < 86400000) return `${Math.round(d / 3600000)}h`;
  return `${Math.round(d / 86400000)}j`;
};

export default function ForumPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [dogName, setDogName] = useState("Anonyme");
  const [dogBreed, setDogBreed] = useState("");
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ForumCategory | "all">("all");
  const [openThread, setOpenThread] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newThread, setNewThread] = useState({ title: "", body: "", category: "général" as ForumCategory });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const { data: dog } = await supabase.from("dogs").select("name,breed").eq("user_id", uid).limit(1).single();
        if (dog) { setDogName(dog.name); setDogBreed(dog.breed); }
      }
      const t = await getForumThreads();
      setThreads(t);
      setLoading(false);
    });
  }, []);

  const refresh = async () => {
    const t = await getForumThreads();
    setThreads(t);
    if (openThread) {
      const updated = t.find((th: any) => th.id === openThread.id);
      if (updated) setOpenThread(updated);
    }
  };

  const getCat = (cat: ForumCategory) => CATEGORIES.find((c) => c.value === cat) ?? CATEGORIES[0];

  const filtered = threads
    .filter((t) => activeCategory === "all" || t.category === activeCategory)
    .sort((a: any, b: any) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const handleReply = async () => {
    if (!replyText.trim() || !openThread || !userId) return;
    setSubmitting(true);
    await addForumReply(openThread.id, userId, dogName, replyText);
    setReplyText("");
    await refresh();
    setSubmitting(false);
  };

  const handleNewThread = async () => {
    if (!newThread.title.trim() || !newThread.body.trim() || !userId) return;
    setSubmitting(true);
    await addForumThread(userId, {
      ...newThread,
      author_dog_name: dogName,
      author_breed: dogBreed,
    });
    setNewThread({ title: "", body: "", category: "général" });
    setShowNew(false);
    await refresh();
    setSubmitting(false);
  };

  if (loading) return (
    <div className="flex flex-col h-full w-full items-center justify-center bg-[#FAF8F5]">
      <Loader2 size={24} className="animate-spin text-amber-500" />
    </div>
  );

  // ── Thread detail view ──
  if (openThread) {
    const cat = getCat(openThread.category);
    const replies = openThread.forum_replies ?? [];
    return (
      <div className="flex flex-col h-full w-full bg-[#FAF8F5]">
        <div className="bg-white border-b border-[#E2DDD5] px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setOpenThread(null)} className="p-2 rounded-2xl hover:bg-[#F2EFE9] text-[#7D7269] transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-[#242019] truncate">{openThread.title}</p>
            <p className="text-xs text-[#7D7269]">{replies.length} réponse{replies.length > 1 ? "s" : ""} · <Eye size={10} className="inline" /> {openThread.views}</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${cat.inactive}`}>{cat.emoji} {cat.label}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="bg-white rounded-3xl border border-[#E2DDD5] p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-300 to-amber-500 rounded-2xl flex items-center justify-center text-base shadow-sm">🐶</div>
              <div>
                <p className="text-sm font-semibold text-[#242019]">{openThread.author_dog_name}</p>
                <p className="text-xs text-[#7D7269]">{openThread.author_breed} · {timeAgo(openThread.created_at)}</p>
              </div>
            </div>
            <p className="text-sm text-[#242019] leading-relaxed">{openThread.body}</p>
          </div>

          {replies.map((r: any) => (
            <div key={r.id} className="bg-white rounded-2xl border border-[#E2DDD5] p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#F2EFE9] rounded-xl flex items-center justify-center text-sm">🐾</div>
                  <div>
                    <p className="text-xs font-semibold text-[#242019]">{r.author_dog_name}</p>
                    <p className="text-xs text-[#7D7269]">{timeAgo(r.created_at)}</p>
                  </div>
                </div>
                <button onClick={async () => { await likeForumReply(r.id, r.likes); await refresh(); }}
                  className="flex items-center gap-1 text-xs text-[#7D7269] hover:text-amber-500 transition-colors font-medium">
                  <ThumbsUp size={12} /> {r.likes}
                </button>
              </div>
              <p className="text-sm text-[#242019] leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>

        {userId && (
          <div className="bg-white border-t border-[#E2DDD5] p-4 flex-shrink-0">
            <div className="flex gap-2 items-end">
              <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center text-sm flex-shrink-0">🐶</div>
              <div className="flex-1 bg-[#FAF8F5] border border-[#E2DDD5] rounded-2xl px-3 py-2">
                <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Écrire une réponse..." rows={2}
                  className="w-full bg-transparent text-sm text-[#242019] resize-none focus:outline-none placeholder-[#7D7269]" />
              </div>
              <button onClick={handleReply} disabled={!replyText.trim() || submitting}
                className="p-2.5 bg-amber-500 disabled:opacity-40 text-white rounded-2xl hover:bg-amber-600 transition-colors shadow-sm">
                {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Thread list view ──
  return (
    <div className="flex flex-col h-full w-full bg-[#FAF8F5]">
      <div className="glass border-b border-white/40 px-4 py-4 flex items-center justify-between flex-shrink-0 shadow-sm z-10">
        <div>
          <h2 className="font-display font-800 text-[#242019] text-lg tracking-tight">Forum</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[11px] uppercase tracking-wider font-bold text-amber-600">{filtered.length} sujets</p>
            <a href="https://www.reddit.com/r/chiens/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-[#FF4500] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .883.175 1.188.465 1.2-.843 2.83-1.4 4.615-1.48l.86-4.008a.326.326 0 0 1 .387-.246l3.14.661a1.248 1.248 0 0 1 1.038-.902zm-9.176 9.47c-.895 0-1.62.724-1.62 1.62 0 .894.725 1.62 1.62 1.62.894 0 1.62-.726 1.62-1.62 0-.896-.726-1.62-1.62-1.62zm8.332 0c-.894 0-1.62.724-1.62 1.62 0 .894.726 1.62 1.62 1.62.895 0 1.62-.726 1.62-1.62 0-.896-.725-1.62-1.62-1.62zm-4.166 3.864c-1.393 0-2.434-.418-2.5-.443-.16-.06-.24-.234-.18-.395.06-.16.234-.24.395-.18.02.008.92.38 2.285.38 1.385 0 2.29-.378 2.31-.387.16-.063.336.015.4.175.062.16-.016.335-.175.397-.07.026-1.12.453-2.535.453z"/></svg>
              Partenaire r/chiens
            </a>
          </div>
        </div>
        {userId && (
          <button onClick={() => setShowNew(true)}
            className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs px-4 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all">
            <Plus size={15} /> Nouveau
          </button>
        )}
      </div>

      <div className="glass-dark border-b border-white/10 px-4 py-3 flex-shrink-0 shadow-sm">
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-0.5">
          <button onClick={() => setActiveCategory("all")}
            className={`flex-shrink-0 text-[11px] uppercase tracking-wider px-4 py-2 rounded-full font-bold transition-all ${activeCategory === "all" ? "bg-white text-gray-900 shadow-md" : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"}`}>
            Tous
          </button>
          {CATEGORIES.map((cat) => (
            <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
              className={`flex-shrink-0 text-[11px] uppercase tracking-wider px-4 py-2 rounded-full font-bold transition-all ${activeCategory === cat.value ? "bg-amber-500 text-white shadow-md shadow-amber-500/30" : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"}`}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto py-6 px-4 space-y-4">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">Aucun sujet pour l'instant. Sois le premier !</p>
            </div>
          )}
          {filtered.map((thread: any) => {
            const cat = getCat(thread.category);
            const replies = thread.forum_replies ?? [];
            return (
              <button key={thread.id} onClick={() => setOpenThread(thread)}
                className="w-full text-left glass rounded-3xl border border-white/40 p-5 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 group-hover:from-amber-100 group-hover:to-amber-200 transition-colors shadow-inner">🐶</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {thread.pinned && <Pin size={12} className="text-amber-500 flex-shrink-0 drop-shadow-sm" />}
                      <span className={`text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold ${cat.inactive}`}>{cat.emoji} {cat.label}</span>
                    </div>
                    <p className="text-base font-bold text-[#242019] leading-snug mb-1.5 group-hover:text-amber-600 transition-colors">{thread.title}</p>
                    <p className="text-sm text-[#7D7269] line-clamp-2 leading-relaxed font-medium">{thread.body}</p>
                    <div className="flex items-center gap-4 mt-3 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                      <span className="text-amber-600">{thread.author_dog_name}</span>
                      <span>{timeAgo(thread.created_at)}</span>
                      <span className="flex items-center gap-1.5"><MessageSquare size={12} /> {replies.length}</span>
                      <span className="flex items-center gap-1.5"><Eye size={12} /> {thread.views}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/60 z-[1000] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl">
            <div className="p-4 border-b border-[#E2DDD5] flex items-center justify-between">
              <h3 className="font-display font-800 text-[#242019]">Nouveau sujet</h3>
              <button onClick={() => setShowNew(false)} className="text-[#7D7269] text-xl">×</button>
            </div>
            <div className="p-4 space-y-3">
              <select value={newThread.category} onChange={(e) => setNewThread((n) => ({ ...n, category: e.target.value as ForumCategory }))}
                className="w-full border border-[#E2DDD5] rounded-2xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-[#FAF8F5] text-[#242019]">
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
              </select>
              <input type="text" placeholder="Titre du sujet *" value={newThread.title}
                onChange={(e) => setNewThread((n) => ({ ...n, title: e.target.value }))}
                className="w-full border border-[#E2DDD5] rounded-2xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-[#242019] placeholder-[#7D7269]" />
              <textarea placeholder="Décris ton sujet..." value={newThread.body}
                onChange={(e) => setNewThread((n) => ({ ...n, body: e.target.value }))}
                rows={5}
                className="w-full border border-[#E2DDD5] rounded-2xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none text-[#242019] placeholder-[#7D7269]" />
              <button onClick={handleNewThread} disabled={!newThread.title.trim() || !newThread.body.trim() || submitting}
                className="w-full bg-amber-500 disabled:opacity-40 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-amber-600 transition-colors shadow-sm shadow-amber-200 flex items-center justify-center gap-2">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                Publier le sujet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
