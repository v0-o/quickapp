# Guide Supabase - Étape par étape

## ✅ Étape 1 : Récupérer les clés API

1. Dans le dashboard Supabase, cliquez sur **"Project Settings"** (icône engrenage en bas à gauche)
2. Cliquez sur **"API"** dans le menu de gauche
3. Vous verrez deux informations importantes :
   - **Project URL** : quelque chose comme `https://xxxxx.supabase.co`
   - **anon public key** : une longue chaîne commençant par `eyJ...`

**👉 Notez ces deux valeurs, vous en aurez besoin !**

---

## ✅ Étape 2 : Créer les tables dans la base de données

1. Dans la barre latérale gauche, cliquez sur **"SQL Editor"**
2. Cliquez sur le bouton **"New query"** (en haut à droite)
3. **Copiez-collez le script SQL ci-dessous** dans l'éditeur
4. Cliquez sur **"Run"** (ou appuyez sur Ctrl+Enter / Cmd+Enter)
5. Vous devriez voir un message de succès ✅

### Script SQL à copier-coller :

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'trial', 'premium')),
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Users policies: Users can only read/update their own record
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Projects policies: Users can only access their own projects
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- Public read access for projects by slug (for template to load configs)
CREATE POLICY "Public can read projects by slug"
  ON public.projects FOR SELECT
  USING (status = 'active');
```

**👉 Après avoir exécuté le script, vérifiez que tout s'est bien passé !**

---

## ✅ Étape 3 : Vérifier que les tables sont créées

1. Dans la barre latérale, cliquez sur **"Table Editor"**
2. Vous devriez voir deux tables : `users` et `projects`
3. Si vous les voyez, c'est bon ! ✅

---

## ✅ Étape 4 : Configurer l'authentification (optionnel mais recommandé)

1. Dans la barre latérale, cliquez sur **"Authentication"**
2. Cliquez sur **"Settings"**
3. Vérifiez que **"Email"** est activé comme méthode d'authentification
4. (Par défaut, c'est déjà activé, donc vous n'avez probablement rien à faire)

---

## ✅ Étape 5 : Configurer les variables d'environnement localement

Maintenant, vous devez créer des fichiers `.env` avec vos clés Supabase.

### Pour Admin Panel :

Créez le fichier `admin-panel/.env` avec ce contenu (remplacez par VOS vraies valeurs) :

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Pour Template :

Créez le fichier `template/.env` avec le même contenu :

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Pour le serveur (si vous l'utilisez) :

Créez le fichier `admin-panel/server/.env` avec :

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
PORT=3001
```

**Note :** Pour obtenir la `service_role_key`, allez dans Project Settings > API, et copiez la **"service_role"** key (⚠️ gardez-la secrète, ne la partagez jamais !)

---

## ✅ C'est tout !

Une fois ces étapes terminées, vous pouvez :
1. Redémarrer vos serveurs de développement
2. Tester l'inscription dans l'admin panel
3. Vérifier que tout fonctionne

**Dites-moi quand vous avez terminé ces étapes et on passera à la suite !** 🚀

