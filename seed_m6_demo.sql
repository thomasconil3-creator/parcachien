-- ==========================================
-- DONNÉES DE DÉMONSTRATION POUR LE PITCH M6
-- ==========================================
-- À coller et exécuter dans l'éditeur SQL de Supabase

DO $$
DECLARE
  user1_id uuid := gen_random_uuid();
  user2_id uuid := gen_random_uuid();
  user3_id uuid := gen_random_uuid();
  user4_id uuid := gen_random_uuid();
  user5_id uuid := gen_random_uuid();
  post1_id uuid := gen_random_uuid();
  post2_id uuid := gen_random_uuid();
  post3_id uuid := gen_random_uuid();
BEGIN
  -- 1. Création des utilisateurs fictifs dans Supabase Auth
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES
    (user1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'lucie@demo.com', 'xxx', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
    (user2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'marc@demo.com', 'xxx', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
    (user3_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sophie@demo.com', 'xxx', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
    (user4_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'thomas@demo.com', 'xxx', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
    (user5_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'julie@demo.com', 'xxx', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now());

  -- 2. Création des chiens associés
  INSERT INTO public.dogs (user_id, name, breed, age, weight, gender, character)
  VALUES
    (user1_id, 'Max', 'Golden Retriever', 3, 'grand', 'male', '{joueur,sociable}'),
    (user2_id, 'Luna', 'Bouledogue Français', 2, 'petit', 'female', '{calme,gourmand}'),
    (user3_id, 'Rocky', 'Berger Allemand', 4, 'grand', 'male', '{protecteur,sportif}'),
    (user4_id, 'Nala', 'Shiba Inu', 1, 'moyen', 'female', '{independant}'),
    (user5_id, 'Buster', 'Jack Russell', 5, 'petit', 'male', '{energetique,joueur}');

  -- 3. Ajout de posts très visuels dans le fil d'actu (avec des photos)
  INSERT INTO public.feed_posts (id, user_id, author_dog_name, author_breed, park_id, park_name, text, photo, emoji)
  VALUES
    (post1_id, user1_id, 'Max', 'Golden Retriever', 'parc-borely', 'Parc Borély', 'Super balade sous le soleil aujourd''hui ! Max s''est fait plein de copains. N''hésitez pas à nous rejoindre. ☀️🐾', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800', '🐶'),
    (post2_id, user2_id, 'Luna', 'Bouledogue Français', 'parc-longchamp', 'Parc Longchamp', 'Luna est épuisée après 1h de jeu non-stop ! Il y a pas mal de monde ce matin au parc.', NULL, '😴'),
    (post3_id, user4_id, 'Nala', 'Shiba Inu', NULL, NULL, 'Coucou la meute ! On cherche un partenaire de jeu de petite ou moyenne taille vers Aubagne pour Nala. Des intéressés ?', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800', '🦊'),
    (gen_random_uuid(), user3_id, 'Rocky', 'Berger Allemand', 'parc-colline-puget', 'Colline Puget', 'Attention, j''ai vu quelques chenilles processionnaires près des pins au sud du parc. Gardez l''œil ouvert pour vos loulous !', NULL, '⚠️'),
    (gen_random_uuid(), user5_id, 'Buster', 'Jack Russell', 'parc-borely', 'Parc Borély', 'Buster a trouvé une balle perdue ! Le propriétaire se reconnaîtra ? On est là jusqu''à midi. 🎾', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800', '🎾');

  -- 4. Ajout de faux likes et de faux commentaires pour la preuve sociale
  INSERT INTO public.feed_likes (post_id, user_id) VALUES
    (post1_id, user2_id), (post1_id, user3_id), (post1_id, user4_id),
    (post2_id, user1_id), (post3_id, user5_id);

  INSERT INTO public.feed_comments (post_id, user_id, author_dog_name, text) VALUES
    (post1_id, user2_id, 'Luna', 'Trop mignon ! On y sera cet après-midi !'),
    (post3_id, user1_id, 'Max', 'Salut ! Max est un peu grand mais il est très doux avec les plus petits. On peut essayer de se voir ce weekend !');

  -- 5. Ajout de Check-ins (pour faire briller la carte avec des chiens en direct)
  INSERT INTO public.checkins (user_id, dog_id, dog_name, dog_breed, park_id, park_name, city, expires_at)
  VALUES
    (user1_id, NULL, 'Max', 'Golden Retriever', 'parc-borely', 'Parc Borély', 'Marseille', now() + interval '2 hours'),
    (user2_id, NULL, 'Luna', 'Bouledogue Français', 'parc-longchamp', 'Parc Longchamp', 'Marseille', now() + interval '1 hour'),
    (user3_id, NULL, 'Rocky', 'Berger Allemand', 'parc-colline-puget', 'Colline Puget', 'Marseille', now() + interval '3 hours');

END $$;
