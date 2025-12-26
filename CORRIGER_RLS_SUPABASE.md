# 🔧 Corriger les politiques RLS dans Supabase

## ❌ Problème actuel

L'erreur dans la console montre :
```
new row violates row-level security policy for table "users"
```

Cela signifie qu'il manque une politique INSERT pour la table `users`.

## ✅ Solution : Ajouter la politique INSERT

### Étape 1 : Aller dans Supabase Dashboard

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Dans le menu de gauche, cliquez sur **Authentication**
4. Cliquez sur **Policies**

### Étape 2 : Ajouter la politique INSERT pour users

1. Dans la liste des tables, trouvez **`users`**
2. Cliquez sur **"Create policy"** (ou le bouton +)
3. Remplissez :
   - **Policy name** : `Users can insert own profile`
   - **Allowed operation** : `INSERT`
   - **Target roles** : `authenticated`
   - **USING expression** : (laissez vide)
   - **WITH CHECK expression** : `auth.uid() = id`
4. Cliquez sur **"Review"** puis **"Save policy"**

### Alternative : Exécuter le SQL directement

1. Dans Supabase Dashboard, allez dans **SQL Editor**
2. Cliquez sur **"New query"**
3. Copiez-collez ce SQL :

```sql
-- Create INSERT policy for users
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);
```

4. Cliquez sur **"Run"**

## ✅ Vérification

Après avoir ajouté la politique :

1. Déconnectez-vous de l'admin panel
2. Créez un nouveau compte
3. Vérifiez dans la console qu'il n'y a plus d'erreur RLS
4. Vérifiez dans **Table Editor > users** que votre utilisateur est créé
5. Vérifiez dans **Table Editor > projects** que votre projet est créé

## 🎯 Résultat attendu

- ✅ L'utilisateur est créé dans `users`
- ✅ Le projet est créé dans `projects`
- ✅ Plus d'erreur RLS dans la console

**Faites cette modification dans Supabase et testez à nouveau !** 🚀

