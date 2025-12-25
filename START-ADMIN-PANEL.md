# 🚀 Guide de démarrage - Admin Panel Builder

## 📋 Prérequis

Assurez-vous d'avoir installé les dépendances :
```bash
# Dans admin-panel
cd admin-panel
npm install

# Dans template
cd ../template
npm install
```

---

## 🎯 Démarrage en 3 étapes

### ⚠️ IMPORTANT : Lancez 3 terminaux séparés dans cet ordre

---

### 1️⃣ Terminal 1 - Template (port 5173)

```bash
cd template
npm run dev
```

**✅ Attendez de voir :**
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.11.102:5173/
```

**Ne fermez pas ce terminal !**

---

### 2️⃣ Terminal 2 - API Server (port 3001)

```bash
cd admin-panel
npm run server
```

**✅ Attendez de voir :**
```
🚀 API Server running on http://localhost:3001
📁 Config path: /Users/omarcherqaoui/quickapp/template/public/config.json
```

**Ne fermez pas ce terminal !**

---

### 3️⃣ Terminal 3 - Admin Panel (port 3000)

```bash
cd admin-panel
npm run dev
```

**✅ Attendez de voir :**
```
  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.11.102:3000/
```

---

## 🌐 URLs disponibles

### 💻 Sur votre Mac (localhost)

- **Admin Panel** : http://localhost:3000
- **Template** : http://localhost:5173
- **API Server** : http://localhost:3001

### 📱 Sur votre iPhone (même WiFi)

- **Admin Panel** : http://192.168.11.102:3000
- **Template** : http://192.168.11.102:5173
- **API Server** : http://192.168.11.102:3001

---

## ✅ Vérification

1. Ouvrez http://localhost:3000 sur votre Mac
2. Vous devriez voir :
   - Un iPhone preview au centre
   - Une barre de configuration en bas
   - La prévisualisation devrait se charger automatiquement

3. Si vous voyez "Chargement config..." qui reste bloqué :
   - ✅ Vérifiez que le Terminal 2 (API Server) est bien lancé
   - ✅ Vérifiez que le Terminal 1 (Template) est bien lancé
   - ✅ Vérifiez la console du navigateur (F12) pour voir les erreurs

---

## 🔧 Dépannage

### ❌ "Chargement config..." reste bloqué

**Cause** : Le template ne peut pas charger `config.json`

**Solutions** :
1. Vérifiez que le **Terminal 1 (Template)** est bien lancé sur le port 5173
2. Vérifiez que le fichier `template/public/config.json` existe
3. Ouvrez http://localhost:5173/config.json dans votre navigateur - vous devriez voir le JSON
4. Vérifiez la console du navigateur (F12) pour voir les erreurs

### ❌ L'iPhone preview ne charge pas

**Cause** : Le template n'est pas accessible

**Solutions** :
1. Vérifiez que le **Terminal 1 (Template)** est bien lancé
2. Ouvrez http://localhost:5173 directement dans votre navigateur
3. Vérifiez que le port 5173 n'est pas déjà utilisé

### ❌ Les modifications ne s'affichent pas

**Cause** : Le serveur API ne sauvegarde pas correctement

**Solutions** :
1. Vérifiez que le **Terminal 2 (API Server)** est bien lancé sur le port 3001
2. Vérifiez les logs du Terminal 2 pour voir si les sauvegardes fonctionnent
3. Attendez quelques secondes, le reload est automatique avec un délai de 100ms

### ❌ Erreur de connexion sur iPhone

**Cause** : Problème de réseau ou firewall

**Solutions** :
1. Vérifiez que votre iPhone est sur le même WiFi que votre Mac
2. Vérifiez que le firewall de votre Mac autorise les connexions entrantes
3. Testez avec l'IP réseau : http://192.168.11.102:3000

---

## 📝 Notes importantes

- **Ne fermez jamais les 3 terminaux** pendant que vous travaillez
- L'ordre de démarrage est important : Template → API Server → Admin Panel
- Si vous modifiez `config.json` manuellement, rechargez la page de l'admin panel
- Les modifications sont sauvegardées automatiquement après 150ms d'inactivité

---

## 🎉 C'est prêt !

Une fois les 3 serveurs lancés, ouvrez http://localhost:3000 et commencez à personnaliser votre application !

