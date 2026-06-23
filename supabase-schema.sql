-- ============================================================
-- PARCACHIEN — Schéma Supabase complet
-- À coller dans l'éditeur SQL de Supabase (dashboard)
-- ============================================================

-- DOGS
create table if not exists dogs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  breed text not null,
  age int not null,
  weight text check (weight in ('petit', 'moyen', 'grand')),
  gender text check (gender in ('male', 'female')),
  sterilized boolean default false,
  character text[] default '{}',
  vaccinated boolean default true,
  photo text,
  created_at timestamptz default now()
);
alter table dogs enable row level security;
create policy "Lecture publique des chiens" on dogs for select using (true);
create policy "Insertion par l'utilisateur" on dogs for insert with check (auth.uid() = user_id);
create policy "Modification par l'utilisateur" on dogs for update using (auth.uid() = user_id);
create policy "Suppression par l'utilisateur" on dogs for delete using (auth.uid() = user_id);

-- CHECKINS
create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  dog_id uuid references dogs,
  dog_name text not null,
  dog_breed text not null,
  park_id text not null,
  park_name text not null,
  city text not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);
alter table checkins enable row level security;
create policy "Lecture publique des checkins" on checkins for select using (true);
create policy "Insertion par l'utilisateur" on checkins for insert with check (auth.uid() = user_id);
create policy "Suppression par l'utilisateur" on checkins for delete using (auth.uid() = user_id);

-- FEED POSTS
create table if not exists feed_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  author_dog_name text not null,
  author_breed text not null,
  park_id text,
  park_name text,
  text text not null,
  photo text,
  emoji text default '📸',
  created_at timestamptz default now()
);
alter table feed_posts enable row level security;
create policy "Lecture des posts" on feed_posts for select to authenticated using (true);
create policy "Insertion par l'utilisateur" on feed_posts for insert with check (auth.uid() = user_id);
create policy "Suppression par l'utilisateur" on feed_posts for delete using (auth.uid() = user_id);

-- FEED LIKES
create table if not exists feed_likes (
  post_id uuid references feed_posts on delete cascade,
  user_id uuid references auth.users,
  primary key (post_id, user_id)
);
alter table feed_likes enable row level security;
create policy "Lecture des likes" on feed_likes for select to authenticated using (true);
create policy "Like par l'utilisateur" on feed_likes for insert with check (auth.uid() = user_id);
create policy "Unlike par l'utilisateur" on feed_likes for delete using (auth.uid() = user_id);

-- FEED COMMENTS
create table if not exists feed_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references feed_posts on delete cascade not null,
  user_id uuid references auth.users not null,
  author_dog_name text not null,
  text text not null,
  created_at timestamptz default now()
);
alter table feed_comments enable row level security;
create policy "Lecture des commentaires" on feed_comments for select to authenticated using (true);
create policy "Insertion par l'utilisateur" on feed_comments for insert with check (auth.uid() = user_id);

-- FORUM THREADS
create table if not exists forum_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  category text not null,
  title text not null,
  body text not null,
  author_dog_name text not null,
  author_breed text not null,
  pinned boolean default false,
  views int default 0,
  created_at timestamptz default now()
);
alter table forum_threads enable row level security;
create policy "Lecture des threads" on forum_threads for select to authenticated using (true);
create policy "Insertion par l'utilisateur" on forum_threads for insert with check (auth.uid() = user_id);
create policy "Mise à jour des vues" on forum_threads for update using (true);

-- FORUM REPLIES
create table if not exists forum_replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references forum_threads on delete cascade not null,
  user_id uuid references auth.users not null,
  author_dog_name text not null,
  text text not null,
  likes int default 0,
  created_at timestamptz default now()
);
alter table forum_replies enable row level security;
create policy "Lecture des réponses" on forum_replies for select to authenticated using (true);
create policy "Insertion par l'utilisateur" on forum_replies for insert with check (auth.uid() = user_id);
create policy "Like par tout utilisateur" on forum_replies for update using (auth.uid() is not null);

-- MESSAGES
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users not null,
  receiver_id uuid references auth.users not null,
  sender_dog_name text not null,
  text text not null,
  read boolean default false,
  created_at timestamptz default now()
);
alter table messages enable row level security;
create policy "Lecture de ses messages" on messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Envoi de message" on messages for insert with check (auth.uid() = sender_id);
create policy "Marquer comme lu" on messages for update using (auth.uid() = receiver_id);

-- FRIENDS
create table if not exists friends (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  friend_user_id uuid references auth.users not null,
  friend_dog_name text not null,
  friend_breed text not null,
  status text check (status in ('pending', 'accepted')) default 'pending',
  created_at timestamptz default now(),
  unique(user_id, friend_user_id)
);
alter table friends enable row level security;
create policy "Lecture de ses amis" on friends for select using (auth.uid() = user_id or auth.uid() = friend_user_id);
create policy "Demande d'amitié" on friends for insert with check (auth.uid() = user_id);
create policy "Accepter une demande" on friends for update using (auth.uid() = friend_user_id or auth.uid() = user_id);

-- STORIES
create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  park_id text not null,
  park_name text not null,
  dog_name text not null,
  emoji text not null,
  text text not null,
  likes int default 0,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);
alter table stories enable row level security;
create policy "Lecture publique des stories actives" on stories for select using (expires_at > now());
create policy "Insertion par l'utilisateur" on stories for insert with check (auth.uid() = user_id);
create policy "Like par tout utilisateur" on stories for update using (auth.uid() is not null);

-- INDEX pour les performances
create index if not exists checkins_park_id on checkins(park_id);
create index if not exists checkins_expires_at on checkins(expires_at);
create index if not exists feed_posts_created_at on feed_posts(created_at desc);
create index if not exists forum_threads_created_at on forum_threads(created_at desc);
create index if not exists messages_receiver_id on messages(receiver_id);
create index if not exists stories_expires_at on stories(expires_at);
