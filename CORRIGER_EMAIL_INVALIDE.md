# 🔧 Corriger l'erreur "Email address is invalid"

## Problème
Supabase rejette l'email avec l'erreur "Email address is invalid".

## Solution : Configurer Supabase Auth

### Étape 1 : Désactiver la confirmation d'email (pour le développement)

1. Allez dans **Supabase Dashboard** : https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Dans le menu de gauche, cliquez sur **Authentication**
4. Cliquez sur **Configuration** (en bas du menu)
5. Cliquez sur **Email Auth**
6. **Désactivez** "Enable email confirmations" (mettez le toggle sur OFF)
7. Cliquez sur **Save**

### Étape 2 : Vérifier que les signups sont activés

1. Toujours dans **Authentication** > **Configuration** > **Email Auth**
2. Vérifiez que **"Enable sign ups"** est activé (ON)
3. Si ce n'est pas le cas, activez-le et cliquez sur **Save**

### Étape 3 : Vérifier les paramètres du site URL

1. Allez dans **Project Settings** (icône engrenage en bas à gauche)
2. Cliquez sur **API** dans le menu
3. Vérifiez que **"Site URL"** est bien configuré (peut être `http://localhost:3000` ou votre URL)

### Étape 4 : Tester à nouveau

1. Redémarrez l'admin panel si nécessaire
2. Testez l'inscription avec un email valide (ex: `test@gmail.com`)
3. Ça devrait fonctionner maintenant !

## ⚠️ Note importante

Si vous avez toujours l'erreur après ces étapes, essayez avec un email différent (par exemple `test123@gmail.com`). Parfois Supabase peut avoir des restrictions sur certains domaines d'email.

## 🚀 Après avoir fait ces changements

Dites-moi si ça fonctionne ! Si ça ne marche toujours pas, on vérifiera les logs Supabase.

