# QuickApp - Guide d'hébergement Supabase

## ✅ Implémentation terminée

Tous les composants nécessaires pour l'hébergement avec Supabase ont été créés et configurés.

## 📋 Ce qui a été fait

### 1. Configuration Supabase
- ✅ Client Supabase créé (`admin-panel/src/lib/supabase.js`, `template/src/lib/supabase.js`)
- ✅ Schéma de base de données créé (`supabase/migrations/001_initial_schema.sql`)
- ✅ Tables `users` et `projects` avec RLS configurées
- ✅ Variables d'environnement documentées

### 2. Authentification
- ✅ Hook `useAuth.js` créé pour gérer l'authentification
- ✅ Onboarding modifié pour utiliser Supabase Auth
- ✅ Inscription avec email + mot de passe
- ✅ Session persistante gérée par Supabase

### 3. Gestion des projets
- ✅ Store `projectsStore.js` créé avec Zustand
- ✅ CRUD complet pour les projets
- ✅ Sauvegarde automatique des configs dans Supabase
- ✅ ProfileModal modifié pour afficher les projets

### 4. API Server
- ✅ Serveur Express migré vers Supabase
- ✅ Endpoints REST complets
- ✅ Authentification sur toutes les routes
- ✅ Endpoint public pour le template (`/api/config/:slug`)

### 5. Template
- ✅ Loader modifié pour charger depuis Supabase
- ✅ Support du slug dans l'URL
- ✅ Fallback vers config.json si Supabase non configuré

### 6. Déploiement
- ✅ Configuration Vercel créée (`vercel.json`)
- ✅ Documentation de déploiement créée

## 🚀 Prochaines étapes

### Étape 1 : Créer le projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un compte et un nouveau projet
3. Noter l'URL et les clés API

### Étape 2 : Configurer la base de données
1. Dans Supabase Dashboard → SQL Editor
2. Exécuter le script : `supabase/migrations/001_initial_schema.sql`
3. Vérifier que les tables sont créées

### Étape 3 : Configurer les variables d'environnement

**Localement :**
- Créer `admin-panel/.env` avec `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
- Créer `template/.env` avec les mêmes variables
- Créer `admin-panel/server/.env` avec `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`

**Production (Vercel) :**
- Ajouter les variables dans les paramètres du projet Vercel
- Pour Admin Panel et Template : `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Pour le serveur (si déployé séparément) : `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### Étape 4 : Déployer sur Vercel

**Admin Panel :**
1. Connecter le repo GitHub à Vercel
2. Root Directory : `admin-panel`
3. Build Command : `npm run build`
4. Output Directory : `dist`
5. Ajouter les variables d'environnement

**Template :**
1. Créer un nouveau projet Vercel
2. Root Directory : `template`
3. Build Command : `npm run build`
4. Output Directory : `dist`
5. Ajouter les variables d'environnement

**Server (optionnel) :**
- Déployer sur Railway ou Render
- Root Directory : `admin-panel/server`
- Start Command : `node index.js`
- Ajouter les variables d'environnement

## 📝 Structure des données

### Table `users`
- `id` : UUID (référence auth.users)
- `email` : Email unique
- `name` : Nom complet
- `subscription_status` : 'free' | 'trial' | 'premium'
- `subscription_expires_at` : Date d'expiration (nullable)

### Table `projects`
- `id` : UUID
- `user_id` : UUID (référence users.id)
- `name` : Nom du projet
- `slug` : Identifiant unique pour l'URL publique
- `config` : JSONB contenant toute la configuration
- `status` : 'active' | 'archived'

## 🔐 Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Les utilisateurs ne peuvent accéder qu'à leurs propres projets
- Le template peut lire les configs publiques via le slug
- Authentification requise pour toutes les opérations d'écriture

## 🌐 URLs de production

Une fois déployé :
- Admin Panel : `https://admin.quickapp.com` (ou votre domaine)
- Template : `https://app.quickapp.com/{slug}` (ou votre domaine)
- API : `https://api.quickapp.com` (si serveur séparé)

## 📚 Fichiers importants

- `supabase/migrations/001_initial_schema.sql` - Schéma de base de données
- `SUPABASE_SETUP.md` - Guide de configuration détaillé
- `admin-panel/src/lib/supabase.js` - Client Supabase admin
- `template/src/lib/supabase.js` - Client Supabase template
- `admin-panel/src/hooks/useAuth.js` - Hook d'authentification
- `admin-panel/src/store/projectsStore.js` - Store des projets

## ⚠️ Notes importantes

- Le plan gratuit Supabase inclut : 500MB DB, 2GB storage, 50k MAU
- Les configs sont stockées en JSONB (flexible et performant)
- Le slug sert d'identifiant public pour le template
- Fallback vers config.json si Supabase non configuré (pour développement local)

