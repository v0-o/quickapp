# Comment trouver l'anon public key dans Supabase

## Emplacement exact

1. Vous êtes dans **Project Settings** > **API** ✅
2. Vous voyez **"Project URL"** avec votre URL ✅
3. **L'anon key est juste en dessous !**

## Où regarder exactement

Sur la page API, vous devriez voir plusieurs sections :

### Section 1 : Project URL
- C'est ce que vous avez déjà trouvé ✅

### Section 2 : Project API keys
C'est ici que se trouve l'anon key ! Vous devriez voir :

- **`anon` `public`** - C'est la clé que vous cherchez !
  - C'est une longue chaîne qui commence par `eyJ...`
  - Il y a un bouton "Reveal" ou "Show" à côté pour l'afficher
  - Ou elle est déjà visible directement

- **`service_role` `secret`** - Celle-ci est pour le serveur (on en aura besoin plus tard)

## Si vous ne voyez toujours pas

1. Faites défiler la page vers le bas
2. Cherchez une section appelée **"Project API keys"** ou **"API Keys"**
3. Il y a peut-être un bouton **"Reveal"** ou **"Show"** à cliquer pour afficher la clé
4. La clé est masquée par défaut pour la sécurité

## Alternative : Dans "Settings" > "API"

Parfois, selon la version de Supabase, vous pouvez aussi trouver les clés dans :
- **Settings** (en haut) > **API**
- Ou directement dans le menu de gauche sous "Project Settings"

**Dites-moi ce que vous voyez exactement sur votre écran et je vous guiderai plus précisément !**

