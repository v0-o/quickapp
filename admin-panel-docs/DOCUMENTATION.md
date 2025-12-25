# 📚 Documentation Complète - Admin Panel Builder

## Table des matières

1. [Contexte du projet](#contexte-du-projet)
2. [Template existant](#template-existant)
3. [Spécifications de l'Admin Panel](#spécifications-de-ladmin-panel)
4. [Fonctionnalités détaillées](#fonctionnalités-détaillées)
5. [Upload de fichiers](#upload-de-fichiers)
6. [Preview en temps réel](#preview-en-temps-réel)
7. [Génération et déploiement](#génération-et-déploiement)
8. [Réponses aux questions techniques](#réponses-aux-questions-techniques)

---

## Contexte du projet

Tu vas créer un **Admin Panel Builder** qui permet aux utilisateurs de personnaliser une webapp e-commerce en temps réel avec un preview iPhone. Le template React/Vite est déjà créé et fonctionnel.

---

## Template existant

### Structure du template

Le template se trouve dans `/template/` et contient :
- **React 19 + Vite** - Application React complète
- **Système de configuration JSON** - Le template charge tout depuis `/public/config.json`
- **Composants React** - Panier, produits, catégories, modals, etc.
- **Design system** - Tailwind CSS avec thème personnalisable

### Format de configuration

Le template lit un fichier `config.json` avec cette structure :

```json
{
  "brand": {
    "name": "Nom de la boutique",
    "slogan": "Slogan",
    "logo": "URL du logo",
    "favicon": "URL favicon",
    "language": "fr"
  },
  "theme": {
    "primaryColor": "#f97316",
    "secondaryColor": "#16a34a",
    "accentColor": "#ec4899",
    "backgroundColor": "#05090b",
    "textColor": "#ffffff",
    "customColors": {}
  },
  "categories": [
    {
      "id": "category1",
      "label": "Catégorie",
      "emoji": "🔥",
      "gradient": "from-orange-500 to-red-500",
      "isNew": false
    }
  ],
  "products": [
    {
      "id": "prod1",
      "category": "category1",
      "name": "Nom produit",
      "emoji": "🎁",
      "badge": "NOUVEAU",
      "media": ["URL vidéo 1", "URL vidéo 2"],
      "posters": ["URL image 1"],
      "thumbnail": "URL thumbnail",
      "desc": "Description",
      "price": 50,
      "oldPrice": null,
      "isPack": false,
      "weight": null,
      "catalogOnly": false
    }
  ],
  "pricing": {
    "pricesPerCategory": {
      "category1": 16
    },
    "quantityOptions": [5, 10, 20],
    "minQuantity": 5,
    "minWeight": 15
  },
  "delivery": {
    "cities": {
      "city1": {
        "name": "Paris",
        "price": 5,
        "emoji": "🗼",
        "estimatedDays": 1
      }
    }
  },
  "promoCodes": {},
  "contact": {
    "telegram": "@username",
    "phone": "+33600000000",
    "email": "contact@shop.com"
  },
  "social": {
    "instagram": "https://instagram.com/shop"
  },
  "seo": {
    "title": "Titre SEO",
    "description": "Description SEO"
  }
}
```

### Comment le template fonctionne

- Le template charge `/public/config.json` au démarrage via `src/config/loader.js`
- Les couleurs du thème sont injectées dans les CSS variables
- Les produits, catégories, etc. sont chargés depuis la config
- **Hot reload** : quand `config.json` change, le template se recharge automatiquement

**Fichiers clés à examiner :**
- `/template/src/config/loader.js` - Charge la config
- `/template/public/config.example.json` - Exemple complet
- `/template/src/App.jsx` - Application principale

---

## Spécifications de l'Admin Panel

### Architecture générale

**Stack technique recommandée :**
- **React 19 + Vite** (pour cohérence avec le template)
- **Tailwind CSS** (même design system)
- **Zustand** ou **React Context** (state management)
- **React Hook Form** (formulaires)
- **Zod** (validation)

**Structure de dossiers :**
```
admin-panel/
├── src/
│   ├── pages/
│   │   ├── Onboarding.jsx
│   │   ├── Builder.jsx          # Page principale
│   │   └── Payment.jsx
│   ├── components/
│   │   ├── iPhonePreview.jsx   # Preview iPhone
│   │   ├── ConfigPanel.jsx    # Barre de personnalisation
│   │   ├── BrandEditor.jsx
│   │   ├── ThemeEditor.jsx
│   │   ├── TypographyEditor.jsx
│   │   ├── CategoriesEditor.jsx
│   │   ├── ProductsEditor.jsx
│   │   ├── DeliveryEditor.jsx
│   │   └── FileUploader.jsx
│   ├── hooks/
│   │   ├── useConfigBuilder.js
│   │   └── useFileUpload.js
│   ├── utils/
│   │   ├── configManager.js
│   │   └── fileStorage.js
│   └── App.jsx
└── package.json
```

### Page Onboarding

**Fonctionnalités :**
- Page d'accueil avec présentation du produit
- Message : "Créez votre boutique en 5 minutes"
- Bouton "Commencer" qui redirige vers le Builder
- Design premium et moderne

### Page Builder (principale)

**Layout :**
```
┌─────────────────────────────────────────┐
│           Header (Logo + Actions)       │
├──────────────────┬──────────────────────┤
│                  │                      │
│  iPhone Preview  │   Config Panel       │
│  (375x812px)     │   (Barre basse)      │
│                  │                      │
│  [iframe]        │   [Formulaires]      │
│                  │                      │
└──────────────────┴──────────────────────┘
```

**iPhone Preview :**
- Cadre iPhone réaliste (ratio 375x812px, iPhone 13/14)
- Iframe pointant vers le template en localhost:5173
- Scrollable, responsive
- Rechargement automatique quand la config change
- Design premium avec ombres et reflets

**Config Panel (barre de personnalisation) :**
- Barre fixe en bas de l'écran (ou sidebar sur desktop)
- Tabs/onglets pour organiser les sections :
  - 🎨 **Thème** - Couleurs, typographies
  - 🏷️ **Marque** - Nom, logo, slogan
  - 📦 **Catégories** - Gestion des catégories
  - 🛍️ **Produits** - Ajout/modification de produits
  - 🚚 **Livraison** - Villes et tarifs
  - 📞 **Contact** - Infos de contact
  - ⚙️ **Paramètres** - Options avancées

---

## Fonctionnalités détaillées

### A. Éditeur de Thème

**Couleurs :**
- Color picker pour chaque couleur :
  - Couleur primaire
  - Couleur secondaire
  - Couleur accent
  - Couleur de fond
  - Couleur de texte
- Preview en temps réel dans l'iPhone
- Possibilité d'ajouter des couleurs personnalisées

**Typographies :**
- Sélecteur de police (Google Fonts) :
  - Inter, Poppins, Roboto, Montserrat, etc.
- Preview de la typographie
- Application immédiate dans le preview

### B. Éditeur de Marque

- Champ texte : Nom de la boutique
- Champ texte : Slogan
- Upload de logo :
  - Bouton "Choisir une image"
  - Sur mobile : ouvre la galerie
  - Sur desktop : ouvre le sélecteur de fichiers
  - Preview du logo
  - Upload vers service gratuit (voir section Upload)
- Upload de favicon (même système)

### C. Gestion des Catégories

- Liste des catégories existantes
- Bouton "Ajouter une catégorie"
- Pour chaque catégorie :
  - ID (auto-généré ou manuel)
  - Label (nom)
  - Emoji picker
  - Gradient selector (prédéfini ou custom)
  - Toggle "Nouvelle catégorie"
- Drag & drop pour réorganiser
- Bouton supprimer

### D. Gestion des Produits

- Liste des produits
- Bouton "Ajouter un produit"
- Formulaire pour chaque produit :
  - Nom du produit
  - Catégorie (dropdown)
  - Emoji picker
  - Badge (optionnel)
  - Description (textarea)
  - Prix (number)
  - Ancien prix (optionnel)
  - Toggle "Pack" (isPack)
  - Poids (si pack)
  - Toggle "Catalogue uniquement"
  
**Upload de médias :**
- **Vidéos :**
  - Bouton "Ajouter une vidéo"
  - Sur mobile : ouvre la galerie vidéos
  - Sur desktop : sélecteur de fichiers
  - Upload multiple
  - Preview des vidéos
  - Possibilité de réorganiser (drag & drop)
  - Bouton supprimer pour chaque vidéo
  
- **Images (posters/thumbnails) :**
  - Même système que les vidéos
  - Upload de thumbnail
  - Upload de posters (multiple)

### E. Gestion de la Livraison

- Liste des villes
- Bouton "Ajouter une ville"
- Pour chaque ville :
  - Nom
  - Prix (number)
  - Emoji
  - Jours estimés (number)
  - Toggle "Ville mise en avant"

### F. Contact & Social

- Champs texte pour :
  - Telegram
  - Téléphone
  - Email
  - WhatsApp
  - Instagram
  - Facebook
  - Twitter

---

## Upload de fichiers

### Solutions gratuites recommandées

**Option 1 : Cloudinary Free Tier**
- 25GB stockage, 25GB bande passante/mois
- API gratuite
- Upload direct depuis le navigateur
- URLs CDN générées automatiquement

**Option 2 : Imgur API**
- Gratuit, illimité
- Parfait pour images
- Moins adapté pour vidéos

**Option 3 : Base64 temporaire (développement)**
- Stockage en localStorage
- Limité à ~5MB par fichier
- Pour MVP uniquement

**Option 4 : Supabase Storage (gratuit)**
- 1GB stockage gratuit
- API simple
- Bon pour production

**Recommandation :** Utiliser **Cloudinary** pour la production, avec fallback **Base64** pour le développement local.

### Implémentation

```javascript
// Hook useFileUpload.js
const uploadFile = async (file, type = 'image') => {
  // 1. Vérifier la taille (max 10MB pour vidéos, 2MB pour images)
  // 2. Upload vers Cloudinary
  // 3. Retourner l'URL
  // 4. Gérer les erreurs
}
```

**Pour mobile :**
```html
<input 
  type="file" 
  accept="video/*" 
  capture="environment"
  onChange={handleFileSelect}
/>
```

---

## Preview en temps réel

### Fonctionnement

1. L'utilisateur modifie un champ dans le Config Panel
2. Le state de la config est mis à jour (Zustand/Context)
3. La config est écrite dans `config.json` (via API locale ou proxy)
4. L'iframe du template détecte le changement et se recharge
5. Le preview affiche les modifications instantanément

### Implémentation

```javascript
// Hook useConfigBuilder.js
const { config, updateConfig } = useConfigBuilder();

// Quand config change :
useEffect(() => {
  // Écrire config.json dans le template
  writeConfigToTemplate(config);
  // Forcer le reload de l'iframe
  iframeRef.current.contentWindow.location.reload();
}, [config]);
```

**Méthode 1 : Proxy API locale**
- Créer un serveur Express simple qui sert `config.json`
- L'admin-panel fait des requêtes PUT pour mettre à jour
- Le template fait des requêtes GET pour charger

**Méthode 2 : File System (développement)**
- Écrire directement dans `/template/public/config.json`
- Utiliser `fs` en Node.js (nécessite un serveur)

**Méthode 3 : WebSocket (avancé)**
- Communication bidirectionnelle
- Mise à jour instantanée sans reload

---

## Génération et déploiement

### Workflow

1. L'utilisateur clique sur "Générer ma boutique"
2. Validation de la config (Zod schema)
3. Génération du build :
   - Cloner/copier le template
   - Injecter `config.json`
   - Build avec Vite (`npm run build`)
4. Déploiement :
   - **GitHub Pages** (gratuit) : Push vers repo GitHub → Auto-deploy
   - **Cloudflare Pages** (gratuit) : Upload du dossier `dist/` → Auto-deploy
   - **Vercel** (gratuit) : Connecter repo GitHub → Auto-deploy

### Recommandation

Utiliser **Cloudflare Pages** car :
- Gratuit et illimité
- Déploiement en 1 clic
- CDN global
- Pas besoin de compte GitHub

### Implémentation

```javascript
// Fonction de génération
const generateWebapp = async (config) => {
  // 1. Valider config
  // 2. Créer un dossier temporaire
  // 3. Copier le template
  // 4. Écrire config.json
  // 5. npm install + npm run build
  // 6. Upload dist/ vers Cloudflare Pages
  // 7. Retourner l'URL de la webapp
}
```

**Alternative simple (MVP) :**
- Générer un fichier ZIP avec le template + config
- L'utilisateur télécharge et déploie manuellement
- Plus simple pour commencer

---

## Réponses aux questions techniques

### Q1 : Déploiement gratuit

**Réponse :** Oui, plusieurs options gratuites :
- **Cloudflare Pages** : gratuit, illimité, CDN global
- **GitHub Pages** : gratuit, nécessite repo public
- **Vercel** : gratuit avec limitations (100GB/mois)

**Recommandation :** Cloudflare Pages pour la simplicité.

### Q2 : Upload de fichiers depuis mobile

**Réponse :** Oui, possible avec :
```html
<input type="file" accept="video/*" capture="environment">
```
- Sur mobile : ouvre directement la caméra/galerie
- Sur desktop : ouvre le sélecteur de fichiers
- Upload vers Cloudinary (gratuit) ou Supabase Storage

### Q3 : Base de données

**Réponse :** Pour commencer :
- **LocalStorage** : pour sauvegarder la config en local
- **Supabase** (gratuit) : pour production (500MB gratuit)
- Pas besoin de backend complexe au début

### Q4 : Architecture

**Réponse :** 
- **Frontend uniquement** pour commencer
- Pas de backend nécessaire si on utilise :
  - Cloudinary pour les fichiers
  - LocalStorage/Supabase pour les configs
  - Cloudflare Pages pour le déploiement

---

## Checklist de développement

### Phase 1 : MVP (Semaine 1)
- [ ] Setup projet React + Vite
- [ ] Page Onboarding
- [ ] Layout Builder (iPhone Preview + Config Panel)
- [ ] Éditeur de Thème (couleurs)
- [ ] Éditeur de Marque (nom, logo)
- [ ] Preview en temps réel basique

### Phase 2 : Fonctionnalités core (Semaine 2)
- [ ] Gestion des Catégories
- [ ] Gestion des Produits
- [ ] Upload de fichiers (images)
- [ ] Upload de vidéos
- [ ] Éditeur de Typographie
- [ ] Gestion de la Livraison

### Phase 3 : Polish & Deploy (Semaine 3)
- [ ] Design premium
- [ ] Animations
- [ ] Responsive mobile
- [ ] Sauvegarde config (LocalStorage)
- [ ] Génération build
- [ ] Déploiement Cloudflare Pages

---

## Ressources utiles

**Template à utiliser :**
- Dossier `/template/` dans le projet
- Lancer avec `npm run dev` sur `localhost:5173`
- Le template charge `/public/config.json`

**Documentation :**
- `config.example.json` : Exemple de config complète
- `config.schema.json` : Schéma de validation JSON

**Services gratuits :**
- Cloudinary : https://cloudinary.com (25GB gratuit)
- Supabase : https://supabase.com (500MB gratuit)
- Cloudflare Pages : https://pages.cloudflare.com (gratuit)

---

## Notes importantes

1. Le template est déjà fonctionnel, ne pas le modifier
2. L'admin-panel doit seulement générer/modifier `config.json`
3. Le preview doit être en temps réel (hot reload)
4. Design premium et moderne
5. Mobile-first : doit fonctionner sur téléphone
6. Tout doit être gratuit (pas de services payants)

---

**Objectif final :** Permettre à un utilisateur de créer sa boutique e-commerce personnalisée en 5 minutes avec un preview en temps réel dans un iPhone, puis générer et déployer automatiquement sa webapp.

