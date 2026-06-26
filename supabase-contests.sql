-- ============================================================
-- PARCACHIEN — Tables Concours
-- Coller dans l'éditeur SQL Supabase
-- ============================================================

-- Table des concours
create table if not exists contests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  end_date timestamptz not null,
  active boolean default true,
  created_at timestamptz default now()
);
alter table contests enable row level security;
create policy "Lecture publique contests" on contests for select using (true);
create policy "Admin insert contests" on contests for insert with check (auth.role() = 'authenticated');

-- Entrées au concours
create table if not exists contest_entries (
  id uuid primary key default gen_random_uuid(),
  contest_id uuid references contests on delete cascade not null,
  user_id uuid references auth.users not null,
  dog_name text not null,
  dog_breed text not null,
  photo text not null,
  vote_count int default 0,
  created_at timestamptz default now()
);
alter table contest_entries enable row level security;
create policy "Lecture publique entries" on contest_entries for select using (true);
create policy "Insert par utilisateur" on contest_entries for insert with check (auth.uid() = user_id);

-- Votes (1 par user par concours)
create table if not exists contest_votes (
  contest_id uuid references contests on delete cascade not null,
  voter_id uuid references auth.users not null,
  entry_id uuid references contest_entries on delete cascade not null,
  created_at timestamptz default now(),
  primary key (contest_id, voter_id)
);
alter table contest_votes enable row level security;
create policy "Lecture votes" on contest_votes for select using (true);
create policy "Vote par utilisateur" on contest_votes for insert with check (auth.uid() = voter_id);

-- Insérer un premier concours actif
insert into contests (title, description, end_date, active)
values (
  '🏆 Election du Plus Beau Chien — Juin 2026',
  'Votez pour votre coup de cœur ! Le gagnant sera mis à la une de ParcAChien tout le mois de juillet.',
  now() + interval '7 days',
  true
);
