# Configuration Supabase pour QuickApp

## Étape 1 : Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un compte (gratuit)
3. Créer un nouveau projet
4. Noter l'URL du projet et les clés API

## Étape 2 : Configurer la base de données

1. Dans le dashboard Supabase, aller dans "SQL Editor"
2. Exécuter le script de migration : `supabase/migrations/001_initial_schema.sql`
3. Vérifier que les tables `users` et `projects` sont créées

## Étape 3 : Configurer l'authentification

1. Dans "Authentication" > "Settings"
2. Activer "Email" comme méthode d'authentification
3. (Optionnel) Configurer les templates d'email

## Étape 4 : Variables d'environnement

### Admin Panel

Créer `admin-panel/.env` :
```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_anon_key
```

### Template

Créer `template/.env` :
```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_anon_key
```

### Server (si utilisé)

Créer `admin-panel/server/.env` :
```
SUPABASE_URL=votre_url_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
PORT=3001
```

## Étape 5 : Déploiement

### Vercel (Recommandé)

1. Connecter le repo GitHub à Vercel
2. Pour Admin Panel :
   - Root Directory: `admin-panel`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Variables d'environnement: Ajouter `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

3. Pour Template :
   - Root Directory: `template`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Variables d'environnement: Ajouter `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

### Railway/Render (pour le serveur API si nécessaire)

1. Connecter le repo
2. Root Directory: `admin-panel/server`
3. Build Command: (pas nécessaire pour Express)
4. Start Command: `node index.js`
5. Variables d'environnement: Ajouter toutes les variables Supabase

## Notes importantes

- Le plan gratuit Supabase inclut : 500MB DB, 2GB storage, 50k MAU
- Les politiques RLS garantissent que les utilisateurs ne voient que leurs projets
- Le slug du projet sert d'identifiant public pour le template
- Format URL template : `https://template.quickapp.com/{slug}`

