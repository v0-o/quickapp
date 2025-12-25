# 🚀 Instructions pour pousser sur GitHub

## Méthode 1 : Token d'accès personnel (PAT) - Recommandé

1. **Créer un Personal Access Token sur GitHub :**
   - Allez sur https://github.com/settings/tokens
   - Cliquez sur "Generate new token" → "Generate new token (classic)"
   - Donnez un nom (ex: "quickapp")
   - Cochez `repo` (accès complet aux repositories)
   - Cliquez "Generate token"
   - **Copiez le token** (vous ne pourrez plus le voir après !)

2. **Pousser le code :**
   ```bash
   cd /Users/omarcherqaoui/quickapp
   git push -u origin main
   ```
   - Username: `v0-o`
   - Password: **collez votre token** (pas votre mot de passe GitHub)

## Méthode 2 : SSH (Alternative)

1. **Configurer SSH :**
   ```bash
   git remote set-url origin git@github.com:v0-o/quickapp.git
   ```

2. **Pousser :**
   ```bash
   git push -u origin main
   ```

## État actuel

✅ Repository Git initialisé
✅ Tous les fichiers ajoutés
✅ Commit créé avec succès (106 fichiers)
⏳ En attente du push (nécessite authentification)

Votre code est sauvegardé localement dans le commit. Vous pouvez pousser quand vous voulez avec une des méthodes ci-dessus.

