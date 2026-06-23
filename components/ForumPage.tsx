"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { ForumCategory, ForumThread } from "@/lib/types";
import { MessageSquare, ThumbsUp, Eye, ChevronLeft, Pin, Plus, Send } from "lucide-react";

const CATEGORIES: { value: ForumCategory; label: string; emoji: string; active: string; inactive: string }[] = [
  { value: "général",      label: "Général",     emoji: "💬", active: "bg-[#242019] text-white",     inactive: "bg-[#F2EFE9] text-[#7D7269]" },
  { value: "santé",        label: "Santé",        emoji: "🏥", active: "bg-red-500 text-white",       inactive: "bg-red-50 text-red-600" },
  { value: "education",    label: "Éducation",    emoji: "🎓", active: "bg-blue-500 text-white",      inactive: "bg-blue-50 text-blue-600" },
  { value: "bonsplans",    label: "Bons plans",   emoji: "⭐", active: "bg-amber-500 text-white",     inactive: "bg-amber-50 text-amber-700" },
  { value: "perdutrouvé",  label: "Perdu/Trouvé", emoji: "🔍", active: "bg-orange-500 text-white",    inactive: "bg-orange-50 text-orange-600" },
  { value: "événements",   label: "Événements",   emoji: "🎉", active: "bg-purple-500 text-white",    inactive: "bg-purple-50 text-purple-600" },
  { value: "races",        label: "Races",        emoji: "🐕", active: "bg-emerald-500 text-white",   inactive: "bg-emerald-50 text-emerald-700" },
];

const timeAgo = (ts: number) => {
  const d = Date.now() - ts;
  if (d < 60000) return "À l'instant";
  if (d < 3600000) return `${Math.round(d / 60000)}min`;
  if (d < 86400000) return `${Math.round(d / 3600000)}h`;
  return `${Math.round(d / 86400000)}j`;
};

export default function ForumPage() {
  const { forumThreads, addForumThread, addForumReply, likeForumReply, myDog } = useStore();
  const [activeCategory, setActiveCategory] = useState<ForumCategory | "all">("all");
  const [openThread, setOpenThread] = useState<ForumThread | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newThread, setNewThread] = useState<{ title: string; body: string; category: ForumCategory; authorDogName: string; authorBreed: string }>({ title: "", body: "", category: "général", authorDogName: "", authorBreed: "" });

  const filtered = forumThreads
    .filter((t) => activeCategory === "all" || t.category === activeCategory)
    .sort((a, b) => { if (a.pinned && !b.pinned) return -1; if (!a.pinned && b.pinned) return 1; return b.timestamp - a.timestamp; });

  const getCat = (cat: ForumCategory) => CATEGORIES.find((c) => c.value === cat) ?? CATEGORIES[0];

  const handleReply = () => {
    if (!replyText.trim() || !openThread) return;
    addForumReply(openThread.id, replyText);
    setReplyText("");
  };

  const handleNewThread = () => {
    if (!newThread.title.trim() || !newThread.body.trim()) return;
    addForumThread(newThread);
    setNewThread({ title: "", body: "", category: "général", authorDogName: "", authorBreed: "" });
    setShowNew(false);
  };

  // ── Thread detail view ──
  if (openThread) {
    const live = forumThreads.find((t) => t.id === openThread.id) ?? openThread;
    const cat = getCat(live.category);
    return (
      <div className="flex flex-col h-full w-full bg-[#FAF8F5]">
        <div className="bg-white border-b border-[#E2DDD5] px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setOpenThread(null)} className="p-2 rounded-2xl hover:bg-[#F2EFE9] text-[#7D7269] transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-[#242019] truncate">{live.title}</p>
            <p className="text-xs text-[#7D7269]">{live.replies.length} réponse{live.replies.length > 1 ? "s" : ""} · <Eye size={10} className="inline" /> {live.views}</p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${cat.inactive}`}>{cat.emoji} {cat.label}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* OP */}
          <div className="bg-white rounded-3xl border border-[#E2DDD5] p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-300 to-amber-500 rounded-2xl flex items-center justify-center text-base shadow-sm">🐶</div>
              <div>
                <p className="text-sm font-semibold text-[#242019]">{live.authorDogName}</p>
                <p className="text-xs text-[#7D7269]">{live.authorBreed} · {timeAgo(live.timestamp)}</p>
              </div>
            </div>
            <p className="text-sm text-[#242019] leading-relaxed">{live.body}</p>
          </div>

          {live.replies.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-[#E2DDD5] p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#F2EFE9] rounded-xl flex items-center justify-center text-sm">🐾</div>
                  <div>
                    <p className="text-xs font-semibold text-[#242019]">{r.authorDogName}</p>
                    <p className="text-xs text-[#7D7269]">{timeAgo(r.timestamp)}</p>
                  </div>
                </div>
                <button onClick={() => likeForumReply(live.id, r.id)}
                  className="flex items-center gap-1 text-xs text-[#7D7269] hover:text-amber-500 transition-colors font-medium">
                  <ThumbsUp size={12} /> {r.likes}
                </button>
              </div>
              <p className="text-sm text-[#242019] leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border-t border-[#E2DDD5] p-4 flex-shrink-0">
          <div className="flex gap-2 items-end">
            <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center text-sm flex-shrink-0">🐶</div>
            <div className="flex-1 bg-[#FAF8F5] border border-[#E2DDD5] rounded-2xl px-3 py-2">
              <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Écrire une réponse..." rows={2}
                className="w-full bg-transparent text-sm text-[#242019] resize-none focus:outline-none placeholder-[#7D7269]" />
            </div>
            <button onClick={handleReply} disabled={!replyText.trim()}
              className="p-2.5 bg-amber-500 disabled:opacity-40 text-white rounded-2xl hover:bg-amber-600 transition-colors shadow-sm">
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Thread list view ──
  return (
    <div className="flex flex-col h-full w-full bg-[#FAF8F5]">
      <div className="glass border-b border-white/40 px-4 py-4 flex items-center justify-between flex-shrink-0 shadow-sm z-10">
        <div>
          <h2 className="font-display font-800 text-[#242019] text-lg tracking-tight">Forum</h2>
          <p className="text-[11px] uppercase tracking-wider font-bold text-amber-600">{filtered.length} sujets</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs px-4 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all">
          <Plus size={15} /> Nouveau
        </button>
      </div>

      {/* Category pills */}
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

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto py-6 px-4 space-y-4">
          {filtered.map((thread) => {
            const cat = getCat(thread.category);
            return (
              <button key={thread.id} onClick={() => setOpenThread(thread)}
                className="w-full text-left glass rounded-3xl border border-white/40 p-5 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 group-hover:from-amber-100 group-hover:to-amber-200 transition-colors shadow-inner">🐶</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {thread.pinned && <Pin size={12} className="text-amber-500 flex-shrink-0 drop-shadow-sm" />}
                      <span className={`text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold border ${cat.inactive.replace('bg-', 'bg-').replace('text-', 'text-').replace(' ', ' border-')}`}>{cat.emoji} {cat.label}</span>
                    </div>
                    <p className="text-base font-bold text-[#242019] leading-snug mb-1.5 group-hover:text-amber-600 transition-colors">{thread.title}</p>
                    <p className="text-sm text-[#7D7269] line-clamp-2 leading-relaxed font-medium">{thread.body}</p>
                    <div className="flex items-center gap-4 mt-3 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                      <span className="text-amber-600">{thread.authorDogName}</span>
                      <span>{timeAgo(thread.timestamp)}</span>
                      <span className="flex items-center gap-1.5"><MessageSquare size={12} /> {thread.replies.length}</span>
                      <span className="flex items-center gap-1.5"><Eye size={12} /> {thread.views}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* New thread modal */}
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
              <button onClick={handleNewThread} disabled={!newThread.title.trim() || !newThread.body.trim()}
                className="w-full bg-amber-500 disabled:opacity-40 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-amber-600 transition-colors shadow-sm shadow-amber-200">
                Publier le sujet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
