DELETE FROM public.feed_likes;
DELETE FROM public.feed_comments;
DELETE FROM public.feed_posts;
DELETE FROM public.checkins;

DO $$
DECLARE
  u1 uuid; u2 uuid; u3 uuid; u4 uuid; u5 uuid;
  p1 uuid := gen_random_uuid(); p2 uuid := gen_random_uuid(); p3 uuid := gen_random_uuid();
BEGIN
  SELECT id INTO u1 FROM auth.users WHERE email = 'lucie@demo.com' LIMIT 1;
  SELECT id INTO u2 FROM auth.users WHERE email = 'marc@demo.com' LIMIT 1;
  SELECT id INTO u3 FROM auth.users WHERE email = 'sophie@demo.com' LIMIT 1;
  SELECT id INTO u4 FROM auth.users WHERE email = 'thomas@demo.com' LIMIT 1;
  SELECT id INTO u5 FROM auth.users WHERE email = 'julie@demo.com' LIMIT 1;

  INSERT INTO public.feed_posts (id, user_id, author_dog_name, author_breed, park_id, park_name, text, photo, emoji)
  VALUES
    (p1, u1, 'Max', 'Golden Retriever', '13-028', 'Parc Saucisse', 'Super balade sous le soleil aujourd''hui au Parc Saucisse ! Max s''est fait plein de copains. N''hésitez pas à nous rejoindre. ☀️🐾', 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800', '🐶'),
    (p2, u2, 'Luna', 'Bouledogue Français', '13-006', 'Espace canin Lodi', 'Luna est épuisée après 1h de jeu non-stop ! Il y a pas mal de monde ce matin au caniparc.', NULL, '😴'),
    (p3, u4, 'Nala', 'Shiba Inu', NULL, NULL, 'Coucou la meute ! On cherche un partenaire de jeu de petite ou moyenne taille vers Aubagne pour Nala. Des intéressés ?', 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=800', '🦊'),
    (gen_random_uuid(), u3, 'Rocky', 'Berger Allemand', '84-001', 'Caniparc Chico Mendes', 'Attention, j''ai vu quelques chenilles processionnaires près des pins au sud du parc. Gardez l''œil ouvert pour vos loulous !', NULL, '⚠️'),
    (gen_random_uuid(), u5, 'Buster', 'Jack Russell', '13-005', 'Espace canin La Capelette', 'Buster a trouvé une balle perdue en fouillant dans les buissons ! Le propriétaire se reconnaîtra ? On est là jusqu''à midi. 🎾', 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=800', '🎾');

  INSERT INTO public.feed_likes (post_id, user_id) VALUES (p1, u2), (p1, u3), (p1, u4), (p2, u1), (p3, u5);
  INSERT INTO public.feed_comments (post_id, user_id, author_dog_name, text) VALUES (p1, u2, 'Luna', 'Trop mignon ! On y sera cet après-midi !'), (p3, u1, 'Max', 'Salut ! Max est un peu grand mais il est très doux avec les plus petits. On peut essayer de se voir ce weekend !');
  INSERT INTO public.checkins (user_id, dog_name, dog_breed, park_id, park_name, city, expires_at)
  VALUES (u1, 'Max', 'Golden Retriever', '13-028', 'Parc Saucisse', 'Marseille', now() + interval '2 hours'), (u2, 'Luna', 'Bouledogue Français', '13-006', 'Espace canin Lodi', 'Marseille', now() + interval '1 hour'), (u3, 'Rocky', 'Berger Allemand', '13-002', 'Espace canin Baille', 'Marseille', now() + interval '3 hours');
END $$;
