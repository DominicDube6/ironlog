# Iron Log

Webapp de suivi d'entraînement — full body 4x/semaine, suggestion de poids par double progression, rotation d'accessoires 4 semaines, gestion des pauses. Aucun tracking de poids corporel.

Stack : Next.js (App Router) + Supabase (Postgres + Auth magic link) + Vercel.

## 1. Créer le projet Supabase (5 min, une seule fois)

1. Va sur [supabase.com](https://supabase.com) → New project (le plan gratuit suffit largement).
2. Une fois le projet créé, ouvre **SQL Editor** → colle le contenu de [`supabase/schema.sql`](supabase/schema.sql) → Run.
3. Va dans **Project Settings → API** et copie :
   - `Project URL`
   - `anon public` key
4. Va dans **Authentication → URL Configuration** et ajoute comme *Redirect URL* (à faire une fois en local, et une fois de plus avec l'URL Vercel une fois déployé) :
   - `http://localhost:3000/auth/confirm`
   - `https://<ton-domaine-vercel>/auth/confirm`

## 2. Configurer en local

```bash
cp .env.local.example .env.local
```

Colle les deux valeurs de l'étape 1 dans `.env.local`, puis :

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) — tu seras redirigé vers `/login`, entre ton courriel, ouvre le lien reçu depuis ton téléphone ou ton ordi.

## 3. Déployer sur Vercel

```bash
npx vercel login
npx vercel
```

Suis les prompts (lie le dossier à un nouveau projet Vercel). Une fois le projet créé sur Vercel, ajoute les deux variables d'environnement dans **Vercel → Project → Settings → Environment Variables** :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Puis redéploie :

```bash
npx vercel --prod
```

Ajoute l'URL `https://<ton-domaine>.vercel.app/auth/confirm` dans Supabase (étape 1.4) — sinon le lien magique va rediriger vers `localhost` en prod.

**Sur ton téléphone** : ouvre l'URL Vercel dans Safari/Chrome → menu de partage → "Ajouter à l'écran d'accueil". L'app s'ouvre alors en plein écran, sans barre d'adresse.

## Structure

- `lib/program.js` — programme A/B/C/D, rotation de blocs, algorithme `suggestNext` (double progression, deload après 3 séances de stagnation, reprise à 85% après 14j+ d'absence).
- `components/` — `ExerciseCard`, `PauseManager`, `PlateBar`, `StickFigure`/`PatternIcon`.
- `app/page.js` — écran principal, lit/écrit dans Supabase (`profile`, `exercise_history`).
- `app/login`, `app/auth/confirm`, `proxy.js` — auth par lien magique (un seul utilisateur pour l'instant, mais scoping `user_id` déjà en place).
- `supabase/schema.sql` — schéma + RLS (chaque user ne voit que ses propres données).

## Pour que Claude connaisse ta progression

Dans une session Claude Code future ouverte dans ce dossier (`projects/iron-log`), lance :

```bash
node scripts/report.mjs
```

Ça imprime un snapshot direct depuis Supabase (dernier poids, PR, nombre de séances par exercice) que tu peux coller dans la conversation, ou que Claude peut lancer lui-même s'il a accès au terminal. Nécessite `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local` (voir `.env.local.example` — cette clé contourne les RLS, elle reste locale, jamais dans Vercel ni dans git).

## Notes

- Zéro tracking de poids corporel, zéro onboarding — l'app va direct au training.
- Pictos "bonhomme allumette" en SVG inline, pas d'images externes.
- Le déploiement Vercel `npx vercel login` ouvre une fenêtre de navigateur pour t'authentifier avec ton propre compte Vercel — Claude ne peut pas créer ce compte à ta place.
