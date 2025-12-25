# Admin Panel Builder

Interface d'administration pour personnaliser le template e-commerce en temps réel.

## Installation

```bash
cd admin-panel
npm install
```

## Démarrage rapide

⚠️ **IMPORTANT :** Vous devez lancer **3 terminaux séparés** dans cet ordre :

### 1️⃣ Terminal 1 - Template (port 5173)
```bash
cd ../template
npm run dev
```
✅ Attendez de voir : `Local: http://localhost:5173/`

### 2️⃣ Terminal 2 - Serveur API (port 3001)
```bash
cd admin-panel
npm run server
```
✅ Attendez de voir : `🚀 API Server running on http://localhost:3001`

### 3️⃣ Terminal 3 - Admin Panel (port 3000)
```bash
cd admin-panel
npm run dev
```
✅ Attendez de voir : `Local: http://localhost:3000/`

### 4️⃣ Ouvrir dans le navigateur
Ouvrez **http://localhost:3000** dans votre navigateur.

**Résumé des URLs :**
- 🌐 Admin Panel : http://localhost:3000
- 📱 Template : http://localhost:5173
- 🔌 API Server : http://localhost:3001

## Dépannage

### Erreur "Failed to load config"
➡️ Vérifiez que le serveur API (Terminal 2) est bien lancé et accessible sur le port 3001.

### L'iPhone preview ne charge pas
➡️ Vérifiez que le template (Terminal 1) est bien lancé sur le port 5173.

### Les modifications ne s'affichent pas
➡️ Attendez quelques secondes, le reload est automatique avec un délai de 500ms.

## Architecture

- **Admin Panel** (port 3000) : Interface React avec iPhone preview et barre de configuration
- **Template** (port 5173) : Application e-commerce qui charge `config.json`
- **API Server** (port 3001) : Serveur Express qui gère GET/PUT de `config.json`

## Fonctionnalités

- ✅ Preview iPhone au centre de l'écran
- ✅ Barre de personnalisation en bas (Theme, Brand)
- ✅ Synchronisation temps réel avec le template
- ✅ Éditeur de couleurs (Theme)
- ✅ Éditeur de marque (Nom, Slogan, Logo, Favicon)

## Structure

```
admin-panel/
├── src/
│   ├── pages/
│   │   └── Builder.jsx          # Page principale
│   ├── components/
│   │   ├── iPhonePreview.jsx    # Preview iPhone
│   │   ├── ConfigPanel.jsx      # Barre de config
│   │   ├── ThemeEditor.jsx      # Éditeur thème
│   │   └── BrandEditor.jsx      # Éditeur marque
│   ├── hooks/
│   │   └── useConfigSync.js     # Sync config → API
│   ├── store/
│   │   └── configStore.js       # Store Zustand
│   └── App.jsx
└── server/
    └── index.js                 # Serveur Express API
```

