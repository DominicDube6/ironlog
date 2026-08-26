# Iron Log

Webapp de suivi d'entraînement — full body 4x/semaine, suggestion de poids par double progression, rotation d'accessoires 4 semaines, gestion des pauses. Aucun tracking de poids corporel.

Stack : Next.js (App Router) + Supabase (Postgres) + Vercel. App personnelle, zéro login — l'app va direct au training, sur n'importe quel appareil.

## 1. Créer le projet Supabase (5 min, une seule fois)

1. Va sur [supabase.com](https://supabase.com) → New project (le plan gratuit suffit largement).
2. Une fois le projet créé, ouvre **SQL Editor** → colle le contenu de [`supabase/schema.sql`](supabase/schema.sql) → Run.
3. Va dans **Project Settings → API Keys** et copie :
   - `Project URL`
   - `Publishable key` (= `anon` key, safe côté client)

## 2. Configurer en local

```bash
cp .env.local.example .env.local
```

Colle les deux valeurs de l'étape 1 dans `.env.local`, puis :

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) — direct au training, pas d'écran de connexion.

## 3. Déployer sur Vercel

Via l'import GitHub (vercel.com/new → GitHub → sélectionner le repo) : ajoute les deux variables d'environnement dans **Settings → Environments → Production** avant ou après le premier déploiement :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Sur ton téléphone** : ouvre l'URL Vercel dans Safari/Chrome → menu de partage → "Ajouter à l'écran d'accueil". L'app s'ouvre alors en plein écran, sans barre d'adresse.

## Structure

- `lib/program.js` — programme A/B/C/D, rotation de blocs, algorithme `suggestNext` (double progression, deload après 3 séances de stagnation, reprise à 85% après 14j+ d'absence).
- `lib/owner.js` — id fixe utilisé pour scoper toutes les lignes (pas d'auth réelle, app personnelle mono-utilisateur).
- `components/` — `ExerciseCard`, `PauseManager`, `PlateBar`, `StickFigure`/`PatternIcon`.
- `app/page.js` — écran unique, lit/écrit dans Supabase (`profile`, `exercise_history`).
- `supabase/schema.sql` — schéma + RLS ouvert (pas d'auth.uid(), la sécurité repose sur le fait que l'URL + la clé anon ne sont pas publiées).

## Pour que Claude connaisse ta progression

Dans une session Claude Code future ouverte dans ce dossier (`projects/iron-log`), lance :

```bash
node scripts/report.mjs
```

Ça imprime un snapshot direct depuis Supabase (dernier poids, PR, nombre de séances par exercice) que tu peux coller dans la conversation, ou que Claude peut lancer lui-même s'il a accès au terminal. Nécessite `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local` (voir `.env.local.example` — cette clé contourne les RLS, elle reste locale, jamais dans Vercel ni dans git).

## Notes

- Zéro tracking de poids corporel, zéro onboarding, zéro login — l'app va direct au training.
- Pictos "bonhomme allumette" en SVG inline, pas d'images externes.
- Pas d'auth réelle : n'importe qui connaissant l'URL Vercel exacte + la clé anon pourrait lire/écrire les données. Acceptable pour un tracker personnel sur une URL non annoncée ; à revisiter si l'app est un jour partagée.
