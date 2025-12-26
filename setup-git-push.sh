#!/bin/bash

# Script de configuration pour push GitHub automatique
# Ce script configure SSH et Git pour que les pushs fonctionnent automatiquement

echo "🔧 Configuration de Git pour push automatique..."
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Vérifier si la clé SSH existe
if [ ! -f ~/.ssh/id_ed25519_quickapp ]; then
    echo -e "${YELLOW}⚠️  Clé SSH non trouvée. Création d'une nouvelle clé...${NC}"
    ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_quickapp -N "" -C "quickapp-git"
    echo -e "${GREEN}✅ Clé SSH créée${NC}"
else
    echo -e "${GREEN}✅ Clé SSH trouvée${NC}"
fi

# 2. Configurer SSH config
echo ""
echo -e "${BLUE}📝 Configuration de SSH...${NC}"
mkdir -p ~/.ssh
chmod 700 ~/.ssh

if ! grep -q "Host github.com" ~/.ssh/config 2>/dev/null; then
    cat >> ~/.ssh/config << 'EOF'
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_quickapp
    IdentitiesOnly yes
EOF
    chmod 600 ~/.ssh/config
    echo -e "${GREEN}✅ Configuration SSH ajoutée${NC}"
else
    echo -e "${GREEN}✅ Configuration SSH déjà présente${NC}"
fi

# 3. Afficher la clé publique
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 ÉTAPE IMPORTANTE : Ajoutez cette clé sur GitHub${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
cat ~/.ssh/id_ed25519_quickapp.pub
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📝 Instructions :${NC}"
echo "1. Copiez la clé ci-dessus (tout le texte)"
echo "2. Allez sur : https://github.com/settings/keys"
echo "3. Cliquez sur 'New SSH key'"
echo "4. Titre : 'quickapp' (ou ce que vous voulez)"
echo "5. Collez la clé dans le champ 'Key'"
echo "6. Cliquez 'Add SSH key'"
echo ""
echo -e "${YELLOW}Une fois la clé ajoutée, appuyez sur Entrée pour tester la connexion...${NC}"
read

# 4. Tester la connexion
echo ""
echo -e "${BLUE}🔍 Test de la connexion GitHub...${NC}"
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo -e "${GREEN}✅ Connexion SSH réussie !${NC}"
    SSH_WORKING=true
else
    echo -e "${YELLOW}⚠️  La clé n'est peut-être pas encore ajoutée sur GitHub${NC}"
    echo -e "${YELLOW}   Ou elle n'est pas encore propagée (attendez 1-2 minutes)${NC}"
    SSH_WORKING=false
fi

# 5. Configurer Git pour utiliser SSH
echo ""
echo -e "${BLUE}⚙️  Configuration de Git...${NC}"
cd /Users/omarcherqaoui/quickapp
git remote set-url origin git@github.com:v0-o/quickapp.git
echo -e "${GREEN}✅ Remote Git configuré pour SSH${NC}"

# 6. Tester le push (dry-run)
echo ""
if [ "$SSH_WORKING" = true ]; then
    echo -e "${GREEN}🎉 Configuration terminée !${NC}"
    echo ""
    echo -e "${BLUE}✅ Vous pouvez maintenant dire 'push' et ça fonctionnera automatiquement !${NC}"
else
    echo -e "${YELLOW}⚠️  Vérifiez que la clé est bien ajoutée sur GitHub${NC}"
    echo -e "${YELLOW}   Puis relancez ce script ou testez avec : ssh -T git@github.com${NC}"
fi

echo ""

