# Tester l'application avec Supabase

## ✅ Configuration terminée !

- ✅ Tables créées dans Supabase
- ✅ Fichiers .env créés avec vos clés
- ✅ Tout est prêt !

## 🚀 Prochaines étapes : Tester l'application

### Étape 1 : Redémarrer les serveurs

**Terminal 1 - Admin Panel :**
```bash
cd admin-panel
npm run dev
```

**Terminal 2 - Template (si nécessaire) :**
```bash
cd template
npm run dev
```

**Terminal 3 - Serveur API (si vous l'utilisez) :**
```bash
cd admin-panel/server
npm start
```

### Étape 2 : Tester l'inscription

1. Ouvrez l'admin panel dans votre navigateur (généralement `http://localhost:3000`)
2. Vous devriez voir l'onboarding
3. Complétez les 3 slides
4. À la fin, vous verrez le formulaire d'inscription
5. Remplissez :
   - Nom complet
   - Email
   - Mot de passe (minimum 6 caractères)
6. Cliquez sur "Créer mon compte"

### Étape 3 : Vérifier dans Supabase

1. Retournez dans Supabase Dashboard
2. Allez dans **"Authentication"** > **"Users"**
3. Vous devriez voir votre utilisateur créé ! ✅
4. Allez dans **"Table Editor"** > **"users"**
5. Vous devriez voir votre profil avec votre nom et email ✅
6. Allez dans **"Table Editor"** > **"projects"**
7. Vous devriez voir un projet "Ma Boutique" créé automatiquement ✅

### Étape 4 : Tester l'édition

1. Dans l'admin panel, modifiez quelque chose (par exemple le nom de la boutique)
2. Attendez quelques secondes
3. Retournez dans Supabase > Table Editor > projects
4. Cliquez sur le projet
5. Regardez la colonne "config" - elle devrait être mise à jour ! ✅

## 🎉 Si tout fonctionne

Félicitations ! Votre application est maintenant connectée à Supabase et fonctionne en production ! 🚀

**Dites-moi ce qui se passe quand vous testez l'inscription !**

