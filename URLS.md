# 📱 URLs pour Admin Panel Builder

## 🌐 Votre IP réseau : `192.168.11.102`

---

## 💻 **Localhost (Mac)**

### Admin Panel
- **URL** : http://localhost:3000
- **Description** : Interface d'administration avec prévisualisation iPhone

### Template (Prévisualisation)
- **URL** : http://localhost:5173
- **Description** : Application e-commerce qui s'affiche dans l'iPhone preview

### API Server
- **URL** : http://localhost:3001
- **Description** : Serveur qui gère la sauvegarde de `config.json`

---

## 📱 **Réseau (iPhone - même WiFi)**

### Admin Panel
- **URL** : http://192.168.11.102:3000
- **Description** : Interface d'administration accessible depuis votre iPhone

### Template (Prévisualisation)
- **URL** : http://192.168.11.102:5173
- **Description** : Application e-commerce accessible depuis votre iPhone

### API Server
- **URL** : http://192.168.11.102:3001
- **Description** : Serveur API accessible depuis votre iPhone

---

## 🚀 **Instructions de démarrage**

### 1️⃣ Terminal 1 - Template (port 5173)
```bash
cd template
npm run dev
```
✅ Attendez : `Local: http://localhost:5173/`

### 2️⃣ Terminal 2 - API Server (port 3001)
```bash
cd admin-panel
npm run server
```
✅ Attendez : `🚀 API Server running on http://localhost:3001`

### 3️⃣ Terminal 3 - Admin Panel (port 3000)
```bash
cd admin-panel
npm run dev
```
✅ Attendez : `Local: http://localhost:3000/`

---

## ✅ **Vérification**

1. Ouvrez http://localhost:3000 sur votre Mac
2. La prévisualisation iPhone devrait se charger automatiquement
3. Pour tester sur iPhone, ouvrez http://192.168.11.102:3000 sur votre iPhone (même WiFi)

---

## 🔧 **Dépannage**

### ❌ "Chargement config..." reste bloqué
➡️ Vérifiez que le **Terminal 2 (API Server)** est bien lancé sur le port 3001

### ❌ L'iPhone preview ne charge pas
➡️ Vérifiez que le **Terminal 1 (Template)** est bien lancé sur le port 5173

### ❌ Erreur de connexion sur iPhone
➡️ Vérifiez que votre iPhone est sur le même WiFi que votre Mac
➡️ Vérifiez que le firewall de votre Mac autorise les connexions entrantes

