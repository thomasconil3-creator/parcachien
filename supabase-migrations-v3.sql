-- ============================================================
-- PARCACHIEN — Migrations v3
-- À coller dans l'éditeur SQL de Supabase (dashboard)
-- ============================================================

-- ── DOGS : colonne push_token (si pas déjà fait via v2) ─────
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS push_token TEXT;

-- ── PARTNERS : colonne user_id (lien propriétaire) ──────────
ALTER TABLE partners ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS hours TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS specialite TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- Politique : le propriétaire peut modifier sa fiche
DROP POLICY IF EXISTS "Modification par le propriétaire" ON partners;
CREATE POLICY "Modification par le propriétaire" ON partners
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Suppression par le propriétaire" ON partners;
CREATE POLICY "Suppression par le propriétaire" ON partners
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Insertion par l'utilisateur" ON partners;
CREATE POLICY "Insertion par l'utilisateur" ON partners
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ── FORUM REPORTS (Signalements de contenu) ─────────────────
CREATE TABLE IF NOT EXISTS forum_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES auth.users NOT NULL,
  content_type TEXT CHECK (content_type IN ('post', 'comment', 'review', 'lost_dog', 'event', 'partner')) NOT NULL,
  content_id uuid NOT NULL,
  reason TEXT CHECK (reason IN ('spam', 'inappropriate', 'fake', 'offensive', 'other')) NOT NULL,
  details TEXT,
  status TEXT CHECK (status IN ('pending', 'reviewed', 'dismissed', 'actioned')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE forum_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Signalement par l'utilisateur connecté" ON forum_reports;
CREATE POLICY "Signalement par l'utilisateur connecté" ON forum_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Lecture de ses propres signalements" ON forum_reports;
CREATE POLICY "Lecture de ses propres signalements" ON forum_reports
  FOR SELECT USING (auth.uid() = reporter_id);
CREATE INDEX IF NOT EXISTS forum_reports_status ON forum_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS forum_reports_content ON forum_reports(content_type, content_id);

-- ── PARTNER CONTACT REQUESTS (Formulaire rejoindre) ─────────
CREATE TABLE IF NOT EXISTS partner_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  category TEXT CHECK (category IN ('veterinaire', 'boutique', 'toiletteur', 'pension', 'educateur', 'autre')) NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT NOT NULL,
  website TEXT,
  message TEXT,
  status TEXT CHECK (status IN ('pending', 'contacted', 'onboarded', 'declined')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Table admin uniquement, pas de RLS public
ALTER TABLE partner_requests ENABLE ROW LEVEL SECURITY;
-- Insertion publique (formulaire de contact sans compte)
DROP POLICY IF EXISTS "Insertion publique demande partenaire" ON partner_requests;
CREATE POLICY "Insertion publique demande partenaire" ON partner_requests
  FOR INSERT WITH CHECK (true);

-- ── SEED : partenaires de démonstration ─────────────────────
-- Vétérinaires & boutiques par ville (données de démo)
INSERT INTO partners (name, category, description, city, dept, address, postal_code, lat, lng, phone, premium, hours, specialite, verified)
VALUES
  -- Marseille
  ('Clinique Vétérinaire du Prado', 'veterinaire', 'Clinique généraliste et spécialisée au cœur du 8ème arrondissement.', 'Marseille', '13', '245 Avenue du Prado', '13008', 43.2720, 5.3850, '04 91 78 XX XX', true, 'Lun-Sam 8h-20h', 'Généraliste + chirurgie', true),
  ('SOS Vétérinaires Marseille', 'veterinaire', 'Urgences vétérinaires 24h/24, 7j/7.', 'Marseille', '13', '12 Rue de Rome', '13001', 43.2940, 5.3750, '04 91 52 XX XX', true, '24h/24 — 7j/7', 'Urgences 24h/24', true),
  ('Cabinet Vétérinaire Belle de Mai', 'veterinaire', 'Équipe bienveillante, vaccins, bilans de santé.', 'Marseille', '13', '38 Rue Nationale', '13003', 43.3055, 5.3740, '04 91 64 XX XX', false, 'Lun-Ven 9h-19h, Sam 9h-13h', 'Généraliste', true),
  ('Maxi Zoo Marseille Grand Littoral', 'boutique', 'Grande animalerie, croquettes premium, accessoires.', 'Marseille', '13', 'Centre Commercial Grand Littoral', '13015', 43.3575, 5.3235, '04 91 09 XX XX', true, 'Lun-Sam 9h-21h, Dim 9h-19h', 'Croquettes premium & accessoires', true),
  ('Tom & Compagnie Marseille Prado', 'boutique', 'Spécialiste croquettes haut de gamme, BARF, alimentation crue.', 'Marseille', '13', '156 Boulevard Michelet', '13008', 43.2650, 5.3820, NULL, true, 'Mar-Sam 10h-19h', 'Croquettes premium sans céréales', true),
  ('Animalis Marseille Valentine', 'boutique', 'Alimentation naturelle, bio, compléments.', 'Marseille', '13', 'Centre Commercial Valentine', '13011', 43.2940, 5.4350, '04 91 43 XX XX', false, 'Lun-Sam 9h-20h', 'Alimentation bio & naturelle', true),

  -- Nice
  ('Clinique Vétérinaire Cimiez', 'veterinaire', 'Clinique moderne, imagerie médicale et chirurgie.', 'Nice', '06', '18 Avenue de la Marne', '06100', 43.7210, 7.2720, '04 93 81 XX XX', true, 'Lun-Ven 8h30-19h30, Sam 9h-13h', 'Imagerie & chirurgie', true),
  ('Urgences Vétérinaires Nice Côte d''Azur', 'veterinaire', 'Urgences vétérinaires pour Nice et la Côte d''Azur.', 'Nice', '06', '24 Avenue de Saint-Lambert', '06100', 43.7055, 7.2745, '04 93 52 XX XX', true, 'Urgences 24h/24', 'Urgences 24h/24', true),
  ('Cabinet Vétérinaire Promenade', 'veterinaire', 'Consultations rapides et urgences légères.', 'Nice', '06', '85 Promenade des Anglais', '06000', 43.6955, 7.2485, '04 93 97 XX XX', false, 'Lun-Sam 9h-19h', 'Généraliste', true),
  ('Maxi Zoo Nice Saint-Isidore', 'boutique', 'Vaste animalerie, croquettes, laisses, couchages.', 'Nice', '06', 'Zone Commerciale Saint-Isidore', '06200', 43.7355, 7.2420, '04 97 00 XX XX', true, 'Lun-Sam 9h-20h30, Dim 9h-19h', 'Croquettes & accessoires', true),
  ('Animalis Cap 3000', 'boutique', 'Alimentation premium et bien-être animal.', 'Nice', '06', 'Cap 3000, Saint-Laurent-du-Var', '06700', 43.6695, 7.1985, NULL, false, 'Lun-Sam 10h-21h, Dim 11h-20h', 'Bien-être & alimentation', true),

  -- Toulon
  ('Clinique Vétérinaire Toulon Centre', 'veterinaire', 'Clinique centrale, consultations toutes espèces, chirurgie.', 'Toulon', '83', '14 Rue Pierre Semard', '83000', 43.1255, 5.9305, '04 94 92 XX XX', true, 'Lun-Ven 8h30-19h, Sam 9h-13h', 'Généraliste toutes espèces', true),
  ('Clinique Vétérinaire La Valette', 'veterinaire', 'Clinique moderne avec plateau technique complet.', 'Toulon', '83', '24 Avenue François Duchatel', '83160', 43.1415, 5.9965, '04 94 60 XX XX', true, 'Lun-Ven 8h-19h30, Sam 9h-13h', 'Imagerie & prévention', true),
  ('Cabinet du Mourillon', 'veterinaire', 'Cabinet de quartier, accueil chaleureux.', 'Toulon', '83', '8 Rue de la Palud', '83000', 43.1095, 5.9520, '04 94 41 XX XX', false, 'Lun-Sam 9h-18h30', 'Généraliste', true),
  ('Maxi Zoo Toulon La Valette', 'boutique', 'Grande surface animalière, croquettes toutes marques.', 'Toulon', '83', 'Zone Commerciale La Valette', '83160', 43.1380, 5.9820, '04 94 21 XX XX', true, 'Lun-Sam 9h-20h, Dim 9h-19h', 'Croquettes & accessoires', true),
  ('Animalis Toulon Grand Var', 'boutique', 'Large choix croquettes premium et alimentation naturelle.', 'Toulon', '83', 'Centre Commercial Grand Var', '83130', 43.1645, 6.0025, NULL, false, 'Lun-Sam 9h30-21h, Dim 10h-19h', 'Alimentation naturelle', true),

  -- Aix-en-Provence
  ('Clinique Vétérinaire du Jas', 'veterinaire', 'Clinique de référence, 5 vétérinaires, échographie, radio.', 'Aix-en-Provence', '13', '8 Avenue de l''Europe', '13090', 43.5280, 5.4190, '04 42 26 XX XX', true, 'Lun-Ven 8h30-20h, Sam 9h-18h', 'Clinique multi-vétérinaires', true),
  ('Urgences Vétérinaires Aix PACA', 'veterinaire', 'Urgences vétérinaires pour Aix et les Bouches-du-Rhône.', 'Aix-en-Provence', '13', 'Zone d''activité Les Milles', '13290', 43.4960, 5.4095, '04 42 39 XX XX', true, 'Urgences 24h/24', 'Urgences 24h/24', true),
  ('Cabinet Vétérinaire Celony', 'veterinaire', 'Cabinet de proximité, à deux pas du Parc Gauffredy.', 'Aix-en-Provence', '13', '12 Rue Celony', '13100', 43.5335, 5.4415, '04 42 27 XX XX', false, 'Lun-Ven 9h-19h, Sam 9h-13h', 'Généraliste', true),
  ('Maxi Zoo Aix-en-Provence', 'boutique', 'Animalerie complète aux Milles, croquettes, accessoires.', 'Aix-en-Provence', '13', 'Zone Commerciale Les Milles', '13290', 43.4955, 5.3985, '04 42 24 XX XX', true, 'Lun-Sam 9h-20h, Dim 9h-19h', 'Croquettes & alimentation', true),
  ('Animalerie du Cours Mirabeau', 'boutique', 'Croquettes bio, accessoires et conseils personnalisés.', 'Aix-en-Provence', '13', '45 Cours Mirabeau', '13100', 43.5270, 5.4485, NULL, false, 'Mar-Sam 10h-19h', 'Bio & conseils', true),

  -- Avignon
  ('Clinique Vétérinaire des Remparts', 'veterinaire', 'À l''ombre des remparts, généraliste toutes espèces.', 'Avignon', '84', '8 Rue de la République', '84000', 43.9495, 4.8060, '04 90 82 XX XX', true, 'Lun-Ven 8h30-19h30, Sam 9h-12h30', 'Généraliste', true),
  ('Cabinet Vétérinaire Montfavet', 'veterinaire', 'Parking facile, consultations sans attente avec RDV.', 'Avignon', '84', '35 Route de Lyon', '84140', 43.9360, 4.8755, NULL, false, 'Lun-Sam 9h-18h30', 'Généraliste', true),
  ('Maxi Zoo Avignon', 'boutique', 'Grande animalerie zone commerciale Avignon Nord.', 'Avignon', '84', 'Zone Commerciale Cap Sud', '84000', 43.9715, 4.8050, NULL, true, 'Lun-Sam 9h-20h, Dim 9h-19h', 'Croquettes & accessoires', true),
  ('Animalis Avignon Le Pontet', 'boutique', 'Large gamme alimentation naturelle pour chiens.', 'Avignon', '84', 'Centre Commercial Mistral 7, Le Pontet', '84130', 43.9785, 4.8590, NULL, false, 'Lun-Sam 9h30-21h', 'Alimentation naturelle', true),

  -- Cannes
  ('Clinique Vétérinaire Cannes Palm', 'veterinaire', 'Clinique moderne, vaccination, suivi santé, chirurgie douce.', 'Cannes', '06', '12 Rue d''Antibes', '06400', 43.5524, 7.0179, '04 93 68 XX XX', true, 'Lun-Ven 8h30-19h, Sam 9h-13h', 'Généraliste', true),
  ('Cabinet Vétérinaire La Bocca', 'veterinaire', 'Accueil chaleureux, consultations et soins courants.', 'Cannes', '06', '48 Avenue Francis Tonner', '06150', 43.5525, 6.9965, '04 93 47 XX XX', false, 'Lun-Sam 9h-18h30', 'Généraliste', true),
  ('Maxi Zoo Cannes Mandelieu', 'boutique', 'Grande surface animalière Cannes-Mandelieu.', 'Cannes', '06', 'Zone Cannes-Mandelieu', '06210', 43.5465, 6.9875, NULL, true, 'Lun-Sam 9h-20h, Dim 9h-19h', 'Croquettes & accessoires', true),
  ('Animalis Cannes Centre', 'boutique', 'Alimentation naturelle, soins, accessoires haut de gamme.', 'Cannes', '06', '72 Rue d''Antibes', '06400', 43.5505, 7.0145, NULL, false, 'Lun-Sam 10h-19h', 'Premium & naturel', true)

ON CONFLICT DO NOTHING;

-- ── INDEX supplémentaires ────────────────────────────────────
CREATE INDEX IF NOT EXISTS partners_city ON partners(city);
CREATE INDEX IF NOT EXISTS partners_verified ON partners(verified, premium);
