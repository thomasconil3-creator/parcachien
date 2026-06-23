"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { ChevronLeft, Send, Search, CheckCircle } from "lucide-react";
import { Friend } from "@/lib/types";

const timeAgo = (ts: number) => {
  const d = Date.now() - ts;
  if (d < 60000) return "À l'instant";
  if (d < 3600000) return `${Math.round(d / 60000)}min`;
  if (d < 86400000) return `${Math.round(d / 3600000)}h`;
  return `${Math.round(d / 86400000)}j`;
};

export default function MessagesPage() {
  const { friends, chatMessages, myDog, sendMessage, acceptFriend } = useStore();
  const [activeChat, setActiveChat] = useState<Friend | null>(null);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");

  if (!myDog) return <div className="p-4 text-center mt-10">Veuillez créer votre profil.</div>;

  const handleSend = () => {
    if (!text.trim() || !activeChat) return;
    sendMessage(activeChat.id, text);
    setText("");
  };

  // Chat view
  if (activeChat) {
    const thread = chatMessages
      .filter((m) => (m.senderId === myDog.id && m.receiverId === activeChat.id) || (m.senderId === activeChat.id && m.receiverId === myDog.id))
      .sort((a, b) => a.timestamp - b.timestamp);

    return (
      <div className="flex flex-col h-full w-full bg-[#FAF8F5]">
        {/* Header */}
        <div className="glass border-b border-white/40 px-4 py-3 flex items-center gap-3 shadow-sm z-10 flex-shrink-0">
          <button onClick={() => setActiveChat(null)} className="p-2 -ml-2 rounded-full hover:bg-white/50 text-gray-600 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 overflow-hidden flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
            {activeChat.photo ? <img src={activeChat.photo} alt={activeChat.dogName} className="w-full h-full object-cover" /> : "🐶"}
          </div>
          <div>
            <p className="font-bold text-[#242019] text-sm">{activeChat.dogName}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">{activeChat.breed}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
          {thread.length === 0 && <p className="text-center text-sm text-gray-400 mt-10 font-medium">Envoyez votre premier message !</p>}
          {thread.map((msg) => {
            const isMe = msg.senderId === myDog.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}>
                {!isMe && (
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden shadow-sm">
                    {activeChat.photo ? <img src={activeChat.photo} className="w-full h-full object-cover" /> : null}
                  </div>
                )}
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm ${isMe ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-br-sm" : "glass border border-white/40 text-gray-800 rounded-bl-sm"}`}>
                  <p>{msg.text}</p>
                  <p className={`text-[9px] mt-1 text-right ${isMe ? "text-amber-100" : "text-gray-400"}`}>{timeAgo(msg.timestamp)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="glass border-t border-white/40 p-4 flex-shrink-0">
          <div className="flex items-end gap-2">
            <div className="flex-1 glass border border-white/40 rounded-3xl px-4 py-2 shadow-inner">
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Écrire un message..." rows={1} onKeyDown={(e) => { if(e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                className="w-full bg-transparent text-sm text-[#242019] resize-none focus:outline-none placeholder-gray-400 py-1" />
            </div>
            <button onClick={handleSend} disabled={!text.trim()}
              className="p-3 bg-gradient-to-r from-amber-400 to-amber-600 disabled:opacity-40 text-white rounded-full hover:shadow-lg transition-all shadow-md shadow-amber-500/20 flex-shrink-0">
              <Send size={18} className="transform translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Friends & Messages List
  const pending = friends.filter(f => f.status === "pending");
  const accepted = friends.filter(f => f.status === "accepted");

  return (
    <div className="flex flex-col h-full w-full bg-[#FAF8F5]">
      {/* Header */}
      <div className="glass border-b border-white/40 px-4 py-4 flex flex-col gap-4 flex-shrink-0 shadow-sm z-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-800 text-[#242019] text-lg tracking-tight">Messages</h2>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-amber-500 border-2 border-white shadow-sm flex items-center justify-center">
            {myDog.photo ? <img src={myDog.photo} className="w-full h-full object-cover" /> : <span className="text-white font-bold text-xs">🐶</span>}
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un ami..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-white/40 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white/60 placeholder-gray-400 text-gray-800 shadow-inner transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        
        {/* Demandes en attente */}
        {pending.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-[11px] uppercase tracking-wider font-bold text-gray-500 ml-1">Demandes d'amis ({pending.length})</h3>
            {pending.map(p => (
              <div key={p.id} className="glass rounded-2xl border border-white/40 p-3 shadow-sm flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm">
                    {p.photo ? <img src={p.photo} className="w-full h-full object-cover" /> : "🐶"}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{p.dogName}</p>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">{p.breed}</p>
                  </div>
                </div>
                <button onClick={() => acceptFriend(p.id)} className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white p-2 rounded-full shadow-md shadow-emerald-500/20 hover:scale-110 transition-transform">
                  <CheckCircle size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Amis & Conversations */}
        <div className="space-y-3">
          <h3 className="text-[11px] uppercase tracking-wider font-bold text-gray-500 ml-1">Conversations</h3>
          {accepted.filter(f => f.dogName.toLowerCase().includes(search.toLowerCase())).map(f => {
            // Find last message
            const msgs = chatMessages.filter(m => (m.senderId === f.id && m.receiverId === myDog.id) || (m.senderId === myDog.id && m.receiverId === f.id));
            const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
            const unread = msgs.filter(m => m.receiverId === myDog.id && !m.read).length;

            return (
              <button key={f.id} onClick={() => setActiveChat(f)} className="w-full text-left glass rounded-2xl border border-white/40 p-3 shadow-sm hover:shadow-md transition-all group flex items-center gap-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm">
                    {f.photo ? <img src={f.photo} className="w-full h-full object-cover" /> : "🐶"}
                  </div>
                  {unread > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                      {unread}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-bold text-sm text-gray-900 truncate">{f.dogName}</p>
                    {lastMsg && <span className="text-[10px] font-bold text-gray-400 flex-shrink-0">{timeAgo(lastMsg.timestamp)}</span>}
                  </div>
                  <p className={`text-xs truncate font-medium ${unread > 0 ? "text-gray-900 font-bold" : "text-gray-500"}`}>
                    {lastMsg ? (lastMsg.senderId === myDog.id ? `Vous: ${lastMsg.text}` : lastMsg.text) : "Dites bonjour ! 👋"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
