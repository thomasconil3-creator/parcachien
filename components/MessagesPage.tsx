"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getMessages, sendMessage, getConversations } from "@/lib/db";
import { ChevronLeft, Send, Search, Loader2 } from "lucide-react";

const timeAgo = (iso: string) => {
  const d = Date.now() - new Date(iso).getTime();
  if (d < 60000) return "À l'instant";
  if (d < 3600000) return `${Math.round(d / 60000)}min`;
  if (d < 86400000) return `${Math.round(d / 3600000)}h`;
  return `${Math.round(d / 86400000)}j`;
};

export default function MessagesPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [dogName, setDogName] = useState("Moi");
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [activeDogName, setActiveDogName] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!userId || !activeUserId) return;
    const channel = supabase
      .channel(`messages-${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`
      }, (payload) => {
        // Verify it's from the active chat
        if (payload.new.sender_id === activeUserId || payload.new.receiver_id === activeUserId) {
          setMessages(prev => [...prev, payload.new as any]);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId, activeUserId]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const { data: dog } = await supabase.from("dogs").select("name").eq("user_id", uid).limit(1).single();
        if (dog) setDogName(dog.name);
        const convos = await getConversations(uid);
        // Grouper par interlocuteur
        const byPeer: Record<string, any> = {};
        for (const m of convos) {
          const peerId = m.sender_id === uid ? m.receiver_id : m.sender_id;
          if (!byPeer[peerId] || new Date(m.created_at) > new Date(byPeer[peerId].created_at)) {
            byPeer[peerId] = { ...m, peerId };
          }
        }
        setConversations(Object.values(byPeer));
      }
      setLoading(false);
    });
  }, []);

  const openChat = async (peerId: string, peerDogName: string) => {
    if (!userId) return;
    setActiveUserId(peerId);
    setActiveDogName(peerDogName);
    const msgs = await getMessages(userId, peerId);
    setMessages(msgs);
  };

  const handleSend = async () => {
    if (!text.trim() || !userId || !activeUserId) return;
    setSending(true);
    await sendMessage(userId, activeUserId, dogName, text);
    setText("");
    const msgs = await getMessages(userId, activeUserId);
    setMessages(msgs);
    setSending(false);
  };

  if (loading) return (
    <div className="flex flex-col h-full w-full items-center justify-center bg-[#FAF8F5]">
      <Loader2 size={24} className="animate-spin text-amber-500" />
    </div>
  );

  // Chat view
  if (activeUserId) {
    return (
      <div className="flex flex-col h-full w-full bg-[#FAF8F5]">
        <div className="glass border-b border-white/40 px-4 py-3 flex items-center gap-3 shadow-sm z-10 flex-shrink-0">
          <button onClick={() => setActiveUserId(null)} className="p-2 -ml-2 rounded-full hover:bg-white/50 text-gray-600 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm text-lg">
            🐶
          </div>
          <div>
            <p className="font-bold text-[#242019] text-sm">{activeDogName}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">En ligne</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
          {messages.length === 0 && <p className="text-center text-sm text-gray-400 mt-10 font-medium">Envoyez votre premier message !</p>}
          {messages.map((msg) => {
            const isMe = msg.sender_id === userId;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}>
                {!isMe && (
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden shadow-sm flex items-center justify-center text-sm">
                    🐾
                  </div>
                )}
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm ${isMe ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-br-sm" : "glass border border-white/40 text-gray-800 rounded-bl-sm"}`}>
                  <p>{msg.text}</p>
                  <p className={`text-[9px] mt-1 text-right ${isMe ? "text-amber-100" : "text-gray-400"}`}>{timeAgo(msg.created_at)}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="glass border-t border-white/40 p-4 flex-shrink-0">
          <div className="flex items-end gap-2">
            <div className="flex-1 glass border border-white/40 rounded-3xl px-4 py-2 shadow-inner">
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Écrire un message..." rows={1}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                className="w-full bg-transparent text-sm text-[#242019] resize-none focus:outline-none placeholder-gray-400 py-1" />
            </div>
            <button onClick={handleSend} disabled={!text.trim() || sending}
              className="p-3 bg-gradient-to-r from-amber-400 to-amber-600 disabled:opacity-40 text-white rounded-full hover:shadow-lg transition-all shadow-md shadow-amber-500/20 flex-shrink-0">
              {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="transform translate-x-0.5" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Conversations list
  return (
    <div className="flex flex-col h-full w-full bg-[#FAF8F5]">
      <div className="glass border-b border-white/40 px-4 py-4 flex flex-col gap-4 flex-shrink-0 shadow-sm z-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-800 text-[#242019] text-lg tracking-tight">Messages</h2>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs">
            🐶
          </div>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-white/40 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white/60 placeholder-gray-400 text-gray-800 shadow-inner transition-all" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {conversations.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">💬</p>
            <p className="font-medium">Aucune conversation</p>
            <p className="text-sm mt-1">Les messages arriveront quand des membres vous écriront.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-[11px] uppercase tracking-wider font-bold text-gray-500 ml-1">Conversations</h3>
            {conversations
              .filter((c) => (c.sender_dog_name ?? "").toLowerCase().includes(search.toLowerCase()))
              .map((c) => {
                const peerId = c.peerId;
                const peerDogName = c.sender_id === userId ? "Correspondant" : (c.sender_dog_name ?? "Correspondant");
                return (
                  <button key={peerId} onClick={() => openChat(peerId, peerDogName)}
                    className="w-full text-left glass rounded-2xl border border-white/40 p-3 shadow-sm hover:shadow-md transition-all flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center border-2 border-white shadow-sm text-2xl">
                      🐶
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="font-bold text-sm text-gray-900 truncate">{peerDogName}</p>
                        <span className="text-[10px] font-bold text-gray-400">{timeAgo(c.created_at)}</span>
                      </div>
                      <p className="text-xs truncate font-medium text-gray-500">
                        {c.sender_id === userId ? `Vous: ${c.text}` : c.text}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
