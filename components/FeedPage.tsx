"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getFeedPosts, addFeedPost, toggleLike, addComment, uploadPhoto } from "@/lib/db";
import { Heart, MessageCircle, Camera, Send, MapPin, X, Image as ImageIcon, PawPrint, Loader2 } from "lucide-react";
import { PACA_PARKS } from "@/lib/parks-data";

const timeAgo = (iso: string) => {
  const d = Date.now() - new Date(iso).getTime();
  if (d < 60000) return "À l'instant";
  if (d < 3600000) return `${Math.round(d / 60000)}min`;
  if (d < 86400000) return `${Math.round(d / 3600000)}h`;
  return `${Math.round(d / 86400000)}j`;
};

export default function FeedPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [dogName, setDogName] = useState<string>("Mon chien");
  const [dogBreed, setDogBreed] = useState<string>("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState("");
  const [newPhoto, setNewPhoto] = useState<string>();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [selectedPark, setSelectedPark] = useState("");
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      // Récupérer le profil du chien
      if (uid) {
        const { data: dog } = await supabase.from("dogs").select("name,breed").eq("user_id", uid).limit(1).single();
        if (dog) { setDogName(dog.name); setDogBreed(dog.breed); }
      }
      // Charger les posts
      const p = await getFeedPosts(uid ?? undefined);
      setPosts(p);
      setLoading(false);
    });

    const channel = supabase.channel('public:feed_posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'feed_posts' }, async () => {
        const { data } = await supabase.auth.getUser();
        const p = await getFeedPosts(data.user?.id ?? undefined);
        setPosts(p);
      }).subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  const refresh = async () => {
    const p = await getFeedPosts(userId ?? undefined);
    setPosts(p);
  };

  const handlePhoto = (file: File) => {
    setPhotoFile(file);
    const r = new FileReader();
    r.onload = (e) => setNewPhoto(e.target?.result as string);
    r.readAsDataURL(file);
  };

  const handlePost = async () => {
    if (!newText.trim() && !newPhoto) return;
    if (!userId) return;
    setPosting(true);
    try {
      const park = PACA_PARKS.find((p) => p.id === selectedPark);
      let photoUrl = newPhoto;
      if (photoFile) {
        photoUrl = await uploadPhoto(photoFile, userId);
      }
      await addFeedPost(userId, {
        author_dog_name: dogName,
        author_breed: dogBreed,
        text: newText,
        photo: photoUrl,
        park_id: park?.id,
        park_name: park?.name,
      });
      setNewText(""); setNewPhoto(undefined); setPhotoFile(null); setSelectedPark(""); setShowCompose(false);
      await refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string, likedByMe: boolean) => {
    if (!userId) return;
    await toggleLike(postId, userId, likedByMe);
    await refresh();
  };

  const handleComment = async (postId: string) => {
    if (!commentText.trim() || !userId) return;
    await addComment(postId, userId, dogName, commentText);
    setCommentText("");
    await refresh();
  };

  if (loading) return (
    <div className="flex flex-col h-full w-full items-center justify-center bg-[#FAF8F5]">
      <Loader2 size={24} className="animate-spin text-amber-500" />
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full bg-[#FAF8F5]">

      {/* Top bar */}
      <div className="glass border-b border-white/40 px-4 py-4 flex items-center justify-between flex-shrink-0 shadow-sm z-10">
        <div>
          <h2 className="font-display font-800 text-[#242019] text-lg tracking-tight">Fil d&apos;actu</h2>
          <p className="text-[11px] uppercase tracking-wider font-bold text-amber-600">{posts.length} publications</p>
        </div>
        {userId && (
          <button onClick={() => setShowCompose(true)}
            className="bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs px-4 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all">
            <Camera size={15} /> Publier
          </button>
        )}
      </div>

      {/* Compose modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/60 z-[1000] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl">
            <div className="p-4 border-b border-[#E2DDD5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-500">
                  <PawPrint size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#242019]">{dogName}</p>
                  <p className="text-xs text-[#7D7269]">{dogBreed}</p>
                </div>
              </div>
              <button onClick={() => { setShowCompose(false); setNewPhoto(undefined); setPhotoFile(null); setNewText(""); }}>
                <X size={18} className="text-[#7D7269]" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <textarea value={newText} onChange={(e) => setNewText(e.target.value)}
                placeholder={`Quoi de neuf avec ${dogName} ?`}
                rows={4}
                className="w-full text-sm text-[#242019] resize-none focus:outline-none placeholder-[#7D7269] leading-relaxed" />

              {newPhoto && (
                <div className="relative rounded-2xl overflow-hidden">
                  <img src={newPhoto} alt="preview" className="w-full object-cover max-h-48" />
                  <button onClick={() => { setNewPhoto(undefined); setPhotoFile(null); }} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"><X size={13} /></button>
                </div>
              )}

              <select value={selectedPark} onChange={(e) => setSelectedPark(e.target.value)}
                className="w-full text-sm border border-[#E2DDD5] rounded-2xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-[#FAF8F5] text-[#7D7269]">
                <option value="">📍 Taguer un parc (optionnel)</option>
                {PACA_PARKS.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.city}</option>)}
              </select>
            </div>

            <div className="p-4 border-t border-[#E2DDD5] flex items-center justify-between">
              <div className="flex gap-4">
                <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
                <button onClick={() => camRef.current?.click()} className="flex items-center gap-1.5 text-sm text-[#7D7269] hover:text-amber-500 transition-colors font-medium">
                  <Camera size={16} /> Photo
                </button>
                <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 text-sm text-[#7D7269] hover:text-amber-500 transition-colors font-medium">
                  <ImageIcon size={16} /> Galerie
                </button>
              </div>
              <button onClick={handlePost} disabled={(!newText.trim() && !newPhoto) || posting}
                className="bg-amber-500 disabled:opacity-40 text-white px-5 py-2 rounded-2xl text-sm font-semibold hover:bg-amber-600 transition-colors flex items-center gap-1.5 shadow-sm shadow-amber-200">
                {posting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Publier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto py-6 px-4 space-y-6">
          {posts.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <PawPrint size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">Soyez le premier à publier !</p>
            </div>
          )}
          {posts.map((post) => (
            <article key={post.id} className="glass rounded-3xl border border-white/40 overflow-hidden card-hover group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="p-5 pb-3 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-300 to-amber-500 rounded-2xl flex items-center justify-center text-xl shadow-md">🐶</div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#242019]">{post.author_dog_name}</p>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-[#7D7269]">{post.author_breed} · {timeAgo(post.created_at)}</p>
                    </div>
                  </div>
                  {post.park_name && (
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-amber-700 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full font-bold shadow-sm">
                      <MapPin size={12} /> {post.park_name}
                    </div>
                  )}
                </div>
                <p className="text-sm text-[#242019] leading-relaxed font-medium">{post.text}</p>
              </div>

              {post.photo && (
                <div className="mx-4 mb-3 rounded-2xl overflow-hidden">
                  <img src={post.photo} alt="post" className="w-full object-cover max-h-72" />
                </div>
              )}

              <div className="px-4 pb-3 flex items-center gap-5 border-t border-[#F2EFE9] pt-3">
                <button onClick={() => handleLike(post.id, post.likedByMe)}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors group ${post.likedByMe ? "text-red-500" : "text-[#7D7269] hover:text-red-400"}`}>
                  <Heart size={17} fill={post.likedByMe ? "currentColor" : "none"} className="group-hover:scale-110 transition-transform" />
                  <span>{post.likes.length}</span>
                </button>
                <button onClick={() => setOpenComments(openComments === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#7D7269] hover:text-amber-500 transition-colors">
                  <MessageCircle size={17} />
                  <span>{post.comments.length}</span>
                </button>
              </div>

              {openComments === post.id && (
                <div className="px-4 pb-4 space-y-3 border-t border-[#F2EFE9] pt-3">
                  {post.comments.map((c: any) => (
                    <div key={c.id} className="flex gap-2">
                      <div className="w-7 h-7 bg-[#F2EFE9] rounded-xl flex items-center justify-center text-sm flex-shrink-0">🐾</div>
                      <div className="bg-[#FAF8F5] rounded-2xl px-3 py-2 flex-1 border border-[#E2DDD5]">
                        <p className="text-xs font-semibold text-[#242019]">{c.author_dog_name}</p>
                        <p className="text-xs text-[#7D7269] mt-0.5">{c.text}</p>
                      </div>
                    </div>
                  ))}
                  {userId && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-xl flex-shrink-0 bg-amber-500 flex items-center justify-center">
                        <span className="text-xs text-white">🐶</span>
                      </div>
                      <div className="flex-1 flex gap-2">
                        <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleComment(post.id)}
                          placeholder="Commenter..."
                          className="flex-1 bg-[#FAF8F5] border border-[#E2DDD5] rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 text-[#242019]" />
                        <button onClick={() => handleComment(post.id)} className="text-amber-500 hover:text-amber-600 transition-colors"><Send size={15} /></button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
