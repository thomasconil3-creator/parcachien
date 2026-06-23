-- ============================================================
-- PARCACHIEN — Migrations v2 (Nouvelles fonctionnalités)
-- À coller dans l'éditeur SQL de Supabase (dashboard)
-- ============================================================

-- ── DOGS : colonnes manquantes ───────────────────────────────
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS push_token TEXT;
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS size TEXT CHECK (size IN ('petit', 'moyen', 'grand'));

-- ── PARK REVIEWS (Avis communautaires sur les parcs) ─────────
CREATE TABLE IF NOT EXISTS park_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  park_id TEXT NOT NULL,
  park_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  cleanliness INT CHECK (cleanliness BETWEEN 1 AND 5),
  safety INT CHECK (safety BETWEEN 1 AND 5),
  shade INT CHECK (shade BETWEEN 1 AND 5),
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE park_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des avis" ON park_reviews FOR SELECT USING (true);
CREATE POLICY "Insertion par l'utilisateur" ON park_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Modification par l'utilisateur" ON park_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS park_reviews_park_id ON park_reviews(park_id);

-- ── MEETUP INVITES (Rencontres planifiées) ───────────────────
CREATE TABLE IF NOT EXISTS meetup_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES auth.users NOT NULL,
  to_user_id uuid REFERENCES auth.users NOT NULL,
  park_id TEXT NOT NULL,
  park_name TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  message TEXT,
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE meetup_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture de ses meetups" ON meetup_invites FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "Créer un meetup" ON meetup_invites FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "Répondre à un meetup" ON meetup_invites FOR UPDATE USING (auth.uid() = to_user_id OR auth.uid() = from_user_id);

-- ── EVENTS (Événements canins PACA) ─────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT CHECK (event_type IN ('balade', 'concours', 'adoption', 'formation', 'social', 'autre')) DEFAULT 'social',
  park_id TEXT,
  park_name TEXT,
  city TEXT NOT NULL,
  lat FLOAT,
  lng FLOAT,
  event_date TIMESTAMPTZ NOT NULL,
  max_participants INT,
  organizer_dog_name TEXT NOT NULL,
  organizer_breed TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des événements" ON events FOR SELECT USING (event_date > NOW() - INTERVAL '1 day');
CREATE POLICY "Création d'événement" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Modification par l'organisateur" ON events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Suppression par l'organisateur" ON events FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS events_event_date ON events(event_date);

-- ── EVENT PARTICIPANTS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_participants (
  event_id uuid REFERENCES events ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users,
  dog_name TEXT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (event_id, user_id)
);
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture des participants" ON event_participants FOR SELECT USING (true);
CREATE POLICY "S'inscrire à un événement" ON event_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Se désinscrire" ON event_participants FOR DELETE USING (auth.uid() = user_id);

-- ── HEALTH RECORDS (Carnet de santé vétérinaire) ────────────
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  dog_id uuid REFERENCES dogs ON DELETE CASCADE,
  record_type TEXT CHECK (record_type IN ('vaccin', 'antiparasitaire', 'ordonnance', 'visite', 'chirurgie', 'autre')) NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  date_done TIMESTAMPTZ,
  reminder_at TIMESTAMPTZ,
  vet_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture de son carnet de santé" ON health_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insertion dans son carnet" ON health_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Modification de son carnet" ON health_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Suppression de son carnet" ON health_records FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS health_records_dog_id ON health_records(dog_id);
CREATE INDEX IF NOT EXISTS health_records_reminder ON health_records(reminder_at);

-- ── LOST DOGS (Chiens perdus / retrouvés) ───────────────────
CREATE TABLE IF NOT EXISTS lost_dogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  dog_name TEXT NOT NULL,
  breed TEXT,
  photo TEXT,
  description TEXT NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL,
  last_seen_lat FLOAT NOT NULL,
  last_seen_lng FLOAT NOT NULL,
  last_seen_city TEXT NOT NULL,
  contact_phone TEXT,
  status TEXT CHECK (status IN ('lost', 'found')) DEFAULT 'lost',
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE lost_dogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des chiens perdus" ON lost_dogs FOR SELECT USING (NOT resolved);
CREATE POLICY "Signalement par l'utilisateur" ON lost_dogs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Mise à jour par l'utilisateur" ON lost_dogs FOR UPDATE USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS lost_dogs_status ON lost_dogs(status, resolved);
CREATE INDEX IF NOT EXISTS lost_dogs_created_at ON lost_dogs(created_at DESC);

-- ── PARTNERS (Bons Plans partenaires premium) ───────────────
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('veterinaire', 'educateur', 'toiletteur', 'boutique', 'pension', 'autre')) NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  dept TEXT,
  lat FLOAT,
  lng FLOAT,
  phone TEXT,
  email TEXT,
  website TEXT,
  photo TEXT,
  premium BOOLEAN DEFAULT false,
  premium_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lecture publique des partenaires" ON partners FOR SELECT USING (true);

-- ── INDEX de performance supplémentaires ─────────────────────
CREATE INDEX IF NOT EXISTS lost_dogs_location ON lost_dogs(last_seen_lat, last_seen_lng);
CREATE INDEX IF NOT EXISTS events_city ON events(city);
CREATE INDEX IF NOT EXISTS partners_category ON partners(category);
CREATE INDEX IF NOT EXISTS partners_dept ON partners(dept);
