# 🔍 Débogage - Utilisateur et projet non créés dans Supabase

## Problème
- ✅ L'utilisateur est créé dans **Authentication > Users** (Supabase Auth)
- ❌ L'utilisateur n'est **PAS** dans **Table Editor > users**
- ❌ Le projet n'est **PAS** dans **Table Editor > projects**

## Causes possibles

### 1. L'insertion dans `users` échoue silencieusement

Dans `useAuth.js`, après l'inscription, on essaie d'insérer dans `users` :
```javascript
await supabase.from('users').insert({...})
```

**Vérifiez dans la console du navigateur** :
- Cherchez les messages `❌ Error creating user record:`
- Si vous voyez une erreur, copiez-la et envoyez-la moi

### 2. Problème de RLS (Row Level Security)

Les politiques RLS peuvent empêcher l'insertion. Vérifiez dans Supabase :
1. Allez dans **Authentication** > **Policies**
2. Vérifiez que la politique **"Users can insert own profile"** existe et est active
3. Si elle n'existe pas, il faut la créer

### 3. L'utilisateur existe déjà

Si l'utilisateur existe déjà dans `users`, l'insertion échoue. On utilise maintenant `upsert` pour éviter ça.

## Solution temporaire : Créer l'utilisateur manuellement

1. Allez dans **Table Editor** > **users**
2. Cliquez sur **"Insert"** > **"Insert row"**
3. Remplissez :
   - **id** : Copiez l'ID de l'utilisateur depuis **Authentication > Users**
   - **email** : L'email de l'utilisateur
   - **name** : Le nom de l'utilisateur
   - **subscription_status** : `free`
3. Cliquez sur **"Save"

Ensuite, testez à nouveau l'inscription. Le projet devrait être créé automatiquement.

## Vérifier les logs

1. Ouvrez la console du navigateur (F12)
2. Testez l'inscription à nouveau
3. Cherchez les messages avec ces emojis :
   - 🔐 = Début de l'inscription
   - ✅ = Succès
   - ❌ = Erreur
   - 📝 = Création d'enregistrement
   - 🆕 = Création de projet

Copiez tous les messages et envoyez-les moi !

