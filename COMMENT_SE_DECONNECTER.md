# 🔓 Comment se déconnecter et tester à nouveau l'inscription

## Méthode 1 : Utiliser le bouton "Se déconnecter" (Recommandé)

1. Cliquez sur le bouton **"Profil"** en haut à droite (icône de profil)
2. Le modal de profil s'ouvre
3. Faites défiler jusqu'en bas
4. Cliquez sur le bouton rouge **"Se déconnecter"**
5. La page se recharge automatiquement et vous voyez l'onboarding

## Méthode 2 : Vider le cache et les données locales

Si le bouton Profil ne fonctionne pas :

### Dans Chrome/Safari :
1. Ouvrez les **Outils de développement** (F12 ou Cmd+Option+I)
2. Allez dans l'onglet **Application** (Chrome) ou **Stockage** (Safari)
3. Dans le menu de gauche, cliquez sur **Local Storage**
4. Cliquez sur votre URL (ex: `http://localhost:3000`)
5. Supprimez toutes les clés, notamment :
   - `quickapp_onboarding_complete`
   - Toutes les clés liées à Supabase (commençant par `sb-`)
6. Rechargez la page (F5 ou Cmd+R)

### Alternative rapide :
1. Ouvrez la console (F12)
2. Tapez :
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```
3. Appuyez sur Entrée

## Méthode 3 : Mode navigation privée

1. Ouvrez une fenêtre de navigation privée (Cmd+Shift+N sur Mac, Ctrl+Shift+N sur Windows)
2. Allez sur `http://localhost:3000`
3. Vous verrez l'onboarding directement

## ✅ Après la déconnexion

- L'onboarding s'affiche
- Vous pouvez créer un nouveau compte
- Vous pouvez tester l'inscription à nouveau

## 🐛 Si le bouton Profil ne s'ouvre pas

1. Ouvrez la console (F12)
2. Cliquez sur le bouton Profil
3. Regardez les messages dans la console
4. Vous devriez voir "Header: Profile button clicked" et "Profile clicked, opening modal"
5. Si vous ne voyez pas ces messages, dites-moi ce que vous voyez

