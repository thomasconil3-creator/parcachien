import { createClient } from "@/utils/supabase/client";

const db = () => createClient();

// ─── DOGS ────────────────────────────────────────────────────────────────────

export async function getMyDog(userId: string) {
  const { data } = await db()
    .from("dogs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return data;
}

export async function saveDog(userId: string, dog: {
  name: string; breed: string; age: number;
  weight: string; gender: string; sterilized: boolean;
  character: string[]; vaccinated: boolean; photo?: string;
}) {
  // Upsert : 1 chien par user
  const existing = await getMyDog(userId);
  if (existing) {
    const { data } = await db().from("dogs").update(dog).eq("id", existing.id).select().single();
    return data;
  }
  const { data } = await db().from("dogs").insert({ ...dog, user_id: userId }).select().single();
  return data;
}

// ─── CHECKINS ────────────────────────────────────────────────────────────────

export async function getActiveCheckins(parkId?: string) {
  let query = db()
    .from("checkins")
    .select("*")
    .gt("expires_at", new Date().toISOString());
  if (parkId) query = query.eq("park_id", parkId);
  const { data } = await query.order("created_at", { ascending: false });
  return data ?? [];
}

export async function addCheckin(userId: string, dog: { id?: string; name: string; breed: string }, parkId: string, parkName: string, city: string) {
  const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
  const { data } = await db().from("checkins").insert({
    user_id: userId,
    dog_id: dog.id ?? null,
    dog_name: dog.name,
    dog_breed: dog.breed,
    park_id: parkId,
    park_name: parkName,
    city,
    expires_at: expiresAt,
  }).select().single();
  return data;
}

export async function removeCheckin(checkinId: string) {
  await db().from("checkins").delete().eq("id", checkinId);
}

export async function getMyActiveCheckin(userId: string) {
  const { data } = await db()
    .from("checkins")
    .select("*")
    .eq("user_id", userId)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return data;
}

// ─── FEED POSTS ──────────────────────────────────────────────────────────────

export async function uploadPhoto(file: File, userId: string): Promise<string> {
  const supabase = db();
  const ext = file.name.split('.').pop();
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('photos').upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from('photos').getPublicUrl(path);
  return data.publicUrl;
}

export async function getFeedPosts(userId?: string) {
  const { data: posts } = await db()
    .from("feed_posts")
    .select("*, feed_comments(*), feed_likes(user_id)")
    .order("created_at", { ascending: false })
    .limit(30);
  return (posts ?? []).map((p: any) => ({
    ...p,
    likes: p.feed_likes?.map((l: any) => l.user_id) ?? [],
    likedByMe: userId ? p.feed_likes?.some((l: any) => l.user_id === userId) : false,
    comments: p.feed_comments ?? [],
  }));
}

export async function addFeedPost(userId: string, post: {
  author_dog_name: string; author_breed: string;
  text: string; photo?: string; park_id?: string; park_name?: string; emoji?: string;
}) {
  const { data } = await db().from("feed_posts").insert({
    user_id: userId,
    ...post,
    emoji: post.emoji ?? "📸",
  }).select().single();
  return data;
}

export async function toggleLike(postId: string, userId: string, liked: boolean) {
  if (liked) {
    await db().from("feed_likes").delete().eq("post_id", postId).eq("user_id", userId);
  } else {
    await db().from("feed_likes").insert({ post_id: postId, user_id: userId });
  }
}

export async function addComment(postId: string, userId: string, authorDogName: string, text: string) {
  const { data } = await db().from("feed_comments").insert({
    post_id: postId,
    user_id: userId,
    author_dog_name: authorDogName,
    text,
  }).select().single();
  return data;
}

// ─── FORUM ───────────────────────────────────────────────────────────────────

export async function getForumThreads(category?: string) {
  let query = db()
    .from("forum_threads")
    .select("*, forum_replies(*)")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });
  if (category && category !== "général") query = query.eq("category", category);
  const { data } = await query.limit(20);
  return data ?? [];
}

export async function addForumThread(userId: string, thread: {
  category: string; title: string; body: string;
  author_dog_name: string; author_breed: string;
}) {
  const { data } = await db().from("forum_threads").insert({
    user_id: userId, ...thread,
  }).select().single();
  return data;
}

export async function addForumReply(threadId: string, userId: string, authorDogName: string, text: string) {
  const { data } = await db().from("forum_replies").insert({
    thread_id: threadId,
    user_id: userId,
    author_dog_name: authorDogName,
    text,
  }).select().single();
  // Incrémenter les vues
  await db().from("forum_threads").update({ views: 0 }).eq("id", threadId);
  return data;
}

export async function likeForumReply(replyId: string, currentLikes: number) {
  await db().from("forum_replies").update({ likes: currentLikes + 1 }).eq("id", replyId);
}

// ─── MESSAGES ────────────────────────────────────────────────────────────────

export async function getMessages(userId: string, friendId: string) {
  const { data } = await db()
    .from("messages")
    .select("*")
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${userId})`)
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function sendMessage(senderId: string, receiverId: string, senderDogName: string, text: string) {
  const { data } = await db().from("messages").insert({
    sender_id: senderId,
    receiver_id: receiverId,
    sender_dog_name: senderDogName,
    text,
  }).select().single();
  return data;
}

export async function getConversations(userId: string) {
  const { data } = await db()
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false });
  return data ?? [];
}

// ─── STORIES ─────────────────────────────────────────────────────────────────

export async function getActiveStories() {
  const { data } = await db()
    .from("stories")
    .select("*")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(20);
  return data ?? [];
}

export async function addStory(userId: string, story: {
  park_id: string; park_name: string; dog_name: string; emoji: string; text: string;
}) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const { data } = await db().from("stories").insert({
    user_id: userId, ...story, expires_at: expiresAt,
  }).select().single();
  return data;
}

export async function likeStory(storyId: string, currentLikes: number) {
  await db().from("stories").update({ likes: currentLikes + 1 }).eq("id", storyId);
}
