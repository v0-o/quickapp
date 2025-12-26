# 📍 Comment trouver la configuration Email Auth dans Supabase

## 🎯 Vous êtes actuellement dans : Authentication > Policies

C'est la bonne section pour les politiques RLS, mais **pas** pour configurer l'email.

## ✅ Ce qu'il faut faire :

### Étape 1 : Aller dans Configuration

1. Dans le menu de gauche, sous **"CONFIGURATION"**, vous voyez plusieurs options
2. Cliquez sur **"Sign In / Providers"** (pas "Policies")
3. C'est là que vous trouverez les paramètres d'email !

### Étape 2 : Configurer Email Auth

Une fois dans **"Sign In / Providers"** :

1. Vous verrez une liste de "Providers" (fournisseurs d'authentification)
2. Cherchez **"Email"** dans la liste
3. Cliquez sur **"Email"** pour ouvrir les paramètres
4. Vous verrez :
   - **"Enable sign ups"** → doit être **ON** ✅
   - **"Enable email confirmations"** → mettez-le sur **OFF** ❌
   - **"Secure email change"** → peut rester ON
5. Cliquez sur **"Save"** en bas

### Alternative : Si vous ne trouvez pas "Sign In / Providers"

1. Dans le menu de gauche, cherchez **"Configuration"** (sous Authentication)
2. Cliquez dessus
3. Vous verrez peut-être directement **"Email Auth"** ou **"Email"**
4. Cliquez dessus

## 🚀 Après avoir fait ça

1. Redémarrez l'admin panel
2. Testez l'inscription à nouveau
3. Ça devrait fonctionner !

## 📝 Note

Les "Policies" que vous voyez sont pour la sécurité des données (RLS), pas pour configurer l'authentification par email. C'est normal qu'elles soient là, mais ce n'est pas ce qu'on cherche maintenant.

