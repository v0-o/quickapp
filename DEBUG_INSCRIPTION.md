# 🔍 Guide de débogage - Problème d'inscription

## Problème actuel
- ✅ L'utilisateur est créé dans Supabase Auth (visible dans Authentication > Users)
- ❌ Le projet n'est pas créé dans la table `projects`
- ❌ L'interface affiche un fond bleu vide

## 🔧 Étapes de débogage

### 1. Vérifier la table `users`

Dans Supabase Dashboard :
1. Allez dans **Table Editor**
2. Cliquez sur **`users`** (pas "Authentication > Users")
3. Vérifiez si votre utilisateur y est présent

**Si l'utilisateur n'est PAS dans la table `users` :**
- C'est le problème ! L'insertion dans `users` échoue
- Vérifiez les logs dans la console du navigateur

### 2. Vérifier les logs dans la console

1. Ouvrez la console du navigateur (F12 ou Cmd+Option+I)
2. Allez dans l'onglet **Console**
3. Testez l'inscription à nouveau
4. Cherchez les messages avec ces emojis :
   - 🔐 = Début de l'inscription
   - ✅ = Succès
   - ❌ = Erreur
   - 📝 = Création d'enregistrement
   - 🆕 = Création de projet

### 3. Vérifier les politiques RLS

Dans Supabase Dashboard :
1. Allez dans **Authentication** > **Policies**
2. Vérifiez que les politiques pour `users` et `projects` sont actives

### 4. Vérifier les erreurs dans Supabase

Dans Supabase Dashboard :
1. Allez dans **Logs** > **Postgres Logs**
2. Cherchez les erreurs récentes

## 🛠️ Solutions possibles

### Solution 1 : L'utilisateur n'existe pas dans `users`

Si l'utilisateur n'est pas dans la table `users`, il faut :
1. Vérifier que l'insertion dans `useAuth.js` fonctionne
2. Vérifier les politiques RLS pour `users`
3. Vérifier que la table `users` existe bien

### Solution 2 : Erreur lors de la création du projet

Si le projet ne se crée pas :
1. Vérifier que l'utilisateur existe dans `users`
2. Vérifier les politiques RLS pour `projects`
3. Vérifier les logs dans la console

## 📝 Prochaines étapes

1. **Ouvrez la console du navigateur** (F12)
2. **Testez l'inscription à nouveau**
3. **Copiez tous les messages de la console** et envoyez-les moi
4. **Vérifiez dans Supabase** si l'utilisateur est dans la table `users`

Ensuite, on pourra corriger le problème précisément ! 🚀

