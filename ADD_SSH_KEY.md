# 🔑 Ajouter votre clé SSH sur GitHub (UNE SEULE FOIS)

## 📋 Votre clé publique SSH :

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFg0zUkmiquUuQYtx4yCo2BCj43uYDXko7fisGsoHdXG quickapp
```

## 🚀 Instructions (5 minutes, une seule fois) :

### 1. Copiez la clé ci-dessus
   - Sélectionnez tout le texte de la clé (de `ssh-ed25519` jusqu'à `quickapp`)

### 2. Allez sur GitHub
   - Ouvrez : https://github.com/settings/keys
   - Ou : GitHub → Settings → SSH and GPG keys

### 3. Ajoutez la clé
   - Cliquez sur **"New SSH key"** (bouton vert)
   - **Title** : `quickapp` (ou ce que vous voulez)
   - **Key type** : Authentication Key
   - **Key** : Collez la clé que vous avez copiée
   - Cliquez **"Add SSH key"**

### 4. Testez
   - Une fois ajoutée, dites-moi et je testerai la connexion
   - OU testez vous-même : `ssh -T git@github.com`

---

## ✅ Une fois fait, vous pourrez dire "push" et ça marchera automatiquement !

**Plus besoin de tokens, plus besoin de copier quoi que ce soit !** 🎉

