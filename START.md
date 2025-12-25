# 🚀 Scripts de démarrage rapide

## Démarrer tous les serveurs

Utilisez ce fichier pour tout démarrer en une commande.

### Option 1 : Démarrage manuel (3 terminaux)

**Terminal 1 - Template:**
```bash
cd template && npm run dev
```

**Terminal 2 - API Server:**
```bash
cd admin-panel && npm run server
```

**Terminal 3 - Admin Panel:**
```bash
cd admin-panel && npm run dev
```

### Option 2 : Script automatique (TODO)
```bash
npm run start:all
```

## URLs

- Admin Panel: http://192.168.11.102:3000
- Template: http://192.168.11.102:5173
- API Server: http://192.168.11.102:3001

## Vérifier l'état

```bash
lsof -ti:3000 && echo "✅ Admin Panel" || echo "❌ Admin Panel"
lsof -ti:3001 && echo "✅ API Server" || echo "❌ API Server"
lsof -ti:5173 && echo "✅ Template" || echo "❌ Template"
```

