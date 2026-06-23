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

// ─── PARK REVIEWS ─────────────────────────────────────────────────────────────

export async function getParkReviews(parkId: string) {
  const { data } = await db()
    .from("park_reviews")
    .select("*")
    .eq("park_id", parkId)
    .order("created_at", { ascending: false })
    .limit(10);
  const reviews = data ?? [];
  const avg = reviews.length
    ? reviews.reduce((sum: number, r: any) => sum + (r.rating ?? 0), 0) / reviews.length
    : null;
  return { reviews, avgRating: avg };
}

export async function addParkReview(userId: string, review: {
  park_id: string; park_name: string; rating: number;
  cleanliness?: number; safety?: number; shade?: number; text?: string;
}) {
  const { data } = await db().from("park_reviews").insert({
    user_id: userId,
    ...review,
  }).select().single();
  return data;
}

// ─── EVENTS ────────────────────────────────────────────────────────────────────

export async function getEvents(filter?: 'week' | 'weekend') {
  const now = new Date();
  let query = db()
    .from("events")
    .select("*, event_participants(*)")
    .gt("event_date", now.toISOString());

  if (filter === 'week') {
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    query = query.lt("event_date", nextWeek.toISOString());
  } else if (filter === 'weekend') {
    // Next Saturday
    const day = now.getDay(); // 0=Sun,6=Sat
    const daysToSat = (6 - day + 7) % 7 || 7;
    const sat = new Date(now);
    sat.setDate(now.getDate() + daysToSat);
    sat.setHours(0, 0, 0, 0);
    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);
    sun.setHours(23, 59, 59, 999);
    query = query.gte("event_date", sat.toISOString()).lte("event_date", sun.toISOString());
  }

  const { data } = await query.order("event_date", { ascending: true });
  return data ?? [];
}

export async function addEvent(userId: string, event: {
  title: string; description?: string; event_type: string;
  park_id?: string; park_name?: string; city: string;
  lat?: number; lng?: number; event_date: string;
  max_participants?: number; organizer_dog_name: string; organizer_breed?: string;
}) {
  const { data } = await db().from("events").insert({
    user_id: userId,
    ...event,
  }).select().single();
  return data;
}

export async function joinEvent(eventId: string, userId: string, dogName: string) {
  const { data } = await db().from("event_participants").insert({
    event_id: eventId,
    user_id: userId,
    dog_name: dogName,
  }).select().single();
  return data;
}

export async function leaveEvent(eventId: string, userId: string) {
  await db().from("event_participants")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId);
}

// ─── LOST DOGS ────────────────────────────────────────────────────────────────

export async function getLostDogs() {
  const { data } = await db()
    .from("lost_dogs")
    .select("*")
    .eq("status", "lost")
    .eq("resolved", false)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function reportLostDog(userId: string, dog: {
  dog_name: string; breed?: string; photo?: string;
  description: string; last_seen_lat: number; last_seen_lng: number;
  last_seen_city: string; contact_phone?: string;
}) {
  const { data } = await db().from("lost_dogs").insert({
    user_id: userId,
    ...dog,
    status: "lost",
    resolved: false,
    last_seen_at: new Date().toISOString(),
  }).select().single();
  return data;
}

export async function markDogFound(lostDogId: string) {
  await db().from("lost_dogs").update({ resolved: true }).eq("id", lostDogId);
}

// ─── HEALTH RECORDS ───────────────────────────────────────────────────────────

export async function getHealthRecords(userId: string, dogId?: string) {
  let query = db()
    .from("health_records")
    .select("*")
    .eq("user_id", userId);
  if (dogId) query = query.eq("dog_id", dogId);
  const { data } = await query.order("date_done", { ascending: false });
  return data ?? [];
}

export async function addHealthRecord(userId: string, record: {
  dog_id?: string; record_type: string; title: string;
  notes?: string; date_done?: string; reminder_at?: string; vet_name?: string;
}) {
  const { data } = await db().from("health_records").insert({
    user_id: userId,
    ...record,
  }).select().single();
  return data;
}

export async function deleteHealthRecord(recordId: string) {
  await db().from("health_records").delete().eq("id", recordId);
}

// ─── MEETUP INVITES ───────────────────────────────────────────────────────────

export async function getMeetupInvites(userId: string) {
  const { data } = await db()
    .from("meetup_invites")
    .select("*")
    .eq("to_user_id", userId)
    .eq("status", "pending");
  return data ?? [];
}

export async function sendMeetupInvite(fromUserId: string, invite: {
  to_user_id: string; park_id: string; park_name: string;
  scheduled_at: string; message?: string;
}) {
  const { data } = await db().from("meetup_invites").insert({
    from_user_id: fromUserId,
    ...invite,
    status: "pending",
  }).select().single();
  return data;
}

export async function respondToMeetup(meetupId: string, status: 'accepted' | 'declined') {
  await db().from("meetup_invites").update({ status }).eq("id", meetupId);
}
