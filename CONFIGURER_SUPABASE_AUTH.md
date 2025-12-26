# 🔧 Configuration Supabase Auth

## Problème : Email invalide lors de l'inscription

L'erreur "Email address is invalid" peut venir de plusieurs choses :

### Solution 1 : Désactiver la confirmation d'email (pour le développement)

1. Allez dans **Supabase Dashboard**
2. Cliquez sur **Authentication** dans le menu de gauche
3. Allez dans **Configuration** > **Email Auth**
4. Désactivez **"Enable email confirmations"** (ou mettez-le sur OFF)
5. Cliquez sur **Save**

Cela permettra de créer des comptes sans avoir à confirmer l'email.

### Solution 2 : Vérifier les restrictions d'email

1. Allez dans **Authentication** > **Configuration** > **Email Auth**
2. Vérifiez qu'il n'y a pas de restrictions sur les domaines d'email
3. Assurez-vous que **"Enable sign ups"** est activé

### Solution 3 : Vérifier les paramètres du projet

1. Allez dans **Project Settings** > **Auth**
2. Vérifiez que **"Enable Email Signup"** est activé
3. Vérifiez qu'il n'y a pas de liste noire d'emails

## 🚀 Après avoir fait ces changements

1. Redémarrez l'admin panel
2. Testez l'inscription à nouveau
3. Ça devrait fonctionner !

