# Prompt Gemini — ParcAChien : Finalisation App

---

## Contexte du projet

Tu travailles sur **ParcAChien** (`parcachien.com`), une application web Next.js 16.2.9 (App Router) pour les propriétaires de chiens en région PACA.

**Repo local :** `C:\Users\TC\Desktop\Projets\parcachien\`
**GitHub :** https://github.com/thomasconil3-creator/parcachien (auto-deploy Vercel sur push master)
**Stack :** Next.js 16.2.9, React 19, TypeScript, Tailwind CSS v4, Supabase (auth + DB), Leaflet, Zustand

### Ce qui est déjà fait ✅
- Carte interactive avec 308+ parcs et clustering
- Auth Supabase (login/inscription sur `/login`)
- Feed communautaire → branché Supabase (`components/FeedPage.tsx`)
- Forum → branché Supabase (`components/ForumPage.tsx`)
- Messagerie privée → branchée Supabase (`components/MessagesPage.tsx`)
- Profil chien → branché Supabase (`components/DogProfileModal.tsx`)
- Toutes les fonctions DB dans `lib/db.ts`
- Client Supabase dans `utils/supabase/client.ts`
- Tables SQL Supabase déjà créées (checkins, stories, dogs, feed_posts, forum_threads, messages…)

### Ce qu'il reste à faire — TON TRAVAIL

---

## TÂCHE 1 — Brancher les Check-ins sur Supabase

**Fichiers à modifier :** `app/page.tsx`, `components/ParkPanel.tsx`, `lib/db.ts`

### Contexte actuel
Les check-ins sont gérés par Zustand (local, non partagé). La table `checkins` existe déjà en base avec ce schéma :
```sql
checkins (id, user_id, dog_id, dog_name, dog_breed, park_id, park_name, city, expires_at, created_at)
```

Les fonctions DB existent déjà dans `lib/db.ts` :
- `addCheckin(userId, dog, parkId, parkName, city)` → insert en base
- `getActiveCheckins(parkId?)` → récupère les check-ins actifs (expires_at > now)
- `removeCheckin(checkinId)` → supprime un check-in
- `getMyActiveCheckin(userId)` → check-in actif de l'utilisateur

### Ce que tu dois faire

**Dans `app/page.tsx` :**
1. Récupérer l'userId via `supabase.auth.getUser()` (déjà présent dans le fichier)
2. Au mount, charger les check-ins actifs depuis Supabase avec `getActiveCheckins()` au lieu du store Zustand
3. Modifier `handleCheckin(park)` pour appeler `addCheckin()` de `lib/db.ts` avec l'userId et le chien du profil Supabase
4. Rafraîchir les check-ins après chaque action
5. Mettre à jour le compteur dans la stats ribbon avec le vrai nombre de check-ins

**Dans `components/ParkPanel.tsx` :**
- Le panneau affiche les check-ins via `getActiveCheckins(park.id)` du store. Remplacer par un appel à `getActiveCheckins(park.id)` de `lib/db.ts` avec un `useEffect` au mount.
- Les stories et signalements dans ParkPanel utilisent aussi le store — idem, les relier à Supabase (tables `stories` et — pour les reports — garder en local pour l'instant).

**Dans `components/StoriesBanner.tsx` :**
- Actuellement : `useStore().getActiveStories()`. Remplacer par un appel à `getActiveStories()` de `lib/db.ts`.

---

## TÂCHE 2 — Upload Photos vers Supabase Storage

**Fichiers à modifier :** `components/FeedPage.tsx`, `lib/db.ts`

### Contexte actuel
Les photos sont converties en base64 (`FileReader`) et stockées directement dans la colonne `photo` de la table `feed_posts`. Ça fonctionne pour les petites images mais sera trop lourd en production.

### Ce que tu dois faire

1. **Créer un bucket Supabase Storage** nommé `photos` (public) — à documenter dans le prompt pour que l'utilisateur le crée dans le dashboard Supabase.

2. **Ajouter une fonction `uploadPhoto` dans `lib/db.ts` :**
```typescript
export async function uploadPhoto(file: File, userId: string): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split('.').pop();
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('photos').upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from('photos').getPublicUrl(path);
  return data.publicUrl;
}
```

3. **Dans `components/FeedPage.tsx`**, modifier `handlePhoto` et `handlePost` :
   - Au lieu de convertir en base64, uploader le fichier avec `uploadPhoto(file, userId)`
   - Stocker l'URL publique dans `photo` de `addFeedPost`
   - Afficher un spinner pendant l'upload
   - Garder la preview base64 locale uniquement pour l'affichage avant publication

---

## TÂCHE 3 — Temps Réel (Supabase Realtime)

**Fichiers à modifier :** `components/FeedPage.tsx`, `components/MessagesPage.tsx`, `app/page.tsx`

### Ce que tu dois faire

Utiliser `supabase.channel()` pour s'abonner aux changements en temps réel.

**Dans `components/MessagesPage.tsx`** (priorité max — la messagerie doit être instantanée) :
```typescript
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
      setMessages(prev => [...prev, payload.new as any]);
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}, [userId, activeUserId]);
```

**Dans `components/FeedPage.tsx`** :
- S'abonner aux INSERT sur `feed_posts` pour rafraîchir le feed automatiquement.

**Dans `app/page.tsx`** :
- S'abonner aux INSERT/DELETE sur `checkins` pour mettre à jour le compteur live en temps réel.

---

## TÂCHE 4 — DogMatch (Bonus si le temps le permet)

**Fichier existant :** `lib/dogmatch.ts` — contient `computeMatchScore(dog1, dog2)` et `getMatchLabel(score)`

**Ce que tu dois faire :**
Créer une section "DogMatch" dans le `ParkPanel` (onglet Live) qui :
1. Récupère les chiens présents dans le parc (via leurs check-ins)
2. Pour chaque chien, calcule le score de compatibilité avec le chien de l'utilisateur connecté
3. Affiche : nom du chien, race, score de compatibilité en % avec une couleur (vert > 70%, orange 40-70%, rouge < 40%)

---

## Règles de code à respecter

1. **Ne pas casser ce qui marche** — Ne pas toucher aux composants non listés.
2. **Gestion des erreurs** — Envelopper tous les appels Supabase dans try/catch. Ne pas bloquer l'UI sur une erreur DB.
3. **États de chargement** — Toujours afficher un spinner `<Loader2 className="animate-spin" />` pendant les opérations async.
4. **Pas de `any` inutile** — Typer correctement les retours Supabase quand c'est simple.
5. **Garder le style existant** — Même design (Tailwind, rounded-3xl, amber-500, couleurs existantes). Ne pas changer le CSS.
6. **Toujours tester le build** — Lancer `npm run build` avant de pousser. Le build doit passer avec 0 erreur.
7. **Push sur master** — `git add -A && git commit -m "feat: ..." && git push origin master`

---

## Structure des fichiers clés

```
parcachien/
├── app/
│   ├── page.tsx          ← Page principale (carte + app)
│   ├── login/page.tsx    ← Page connexion
│   └── layout.tsx
├── components/
│   ├── FeedPage.tsx      ← Feed (branché Supabase)
│   ├── ForumPage.tsx     ← Forum (branché Supabase)
│   ├── MessagesPage.tsx  ← Messages (branché Supabase)
│   ├── ParkPanel.tsx     ← Panneau latéral d'un parc
│   ├── StoriesBanner.tsx ← Bannière stories en haut
│   ├── DogProfileModal.tsx ← Profil chien (branché Supabase)
│   └── Map.tsx           ← Carte Leaflet
├── lib/
│   ├── db.ts             ← Toutes les fonctions Supabase
│   ├── store.ts          ← Zustand (état local)
│   ├── types.ts          ← Types TypeScript
│   ├── dogmatch.ts       ← Algo compatibilité canine
│   └── parks-data.ts     ← 308+ parcs PACA
└── utils/supabase/
    ├── client.ts         ← createClient() browser
    └── server.ts         ← createClient() server
```

## Variables d'environnement (dans .env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://gptyvxkefaxqthoptxqv.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_EZ9-JrdIAIXLSyyyThzA-w_SGROSkG_
```

---

## Ordre d'exécution recommandé

1. Tâche 1 (Check-ins) → la plus impactante, visible immédiatement sur la carte
2. Tâche 2 (Upload photos) → important pour éviter les gros base64 en DB
3. Tâche 3 (Realtime messages) → améliore l'expérience messagerie
4. Tâche 4 (DogMatch) → bonus UX

Commence par lire les fichiers avant de les modifier.
Lance `npm run build` à la fin pour valider.
