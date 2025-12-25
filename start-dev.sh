#!/bin/bash

# Script de démarrage pour l'admin panel builder
# Ce script lance les 3 serveurs nécessaires

echo "🚀 Démarrage de l'Admin Panel Builder..."
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Obtenir l'IP locale
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

echo -e "${YELLOW}📋 URLs disponibles :${NC}"
echo -e "${GREEN}Localhost :${NC}"
echo "  - Admin Panel : http://localhost:3000"
echo "  - Template : http://localhost:5173"
echo "  - API Server : http://localhost:3001"
echo ""
echo -e "${GREEN}Réseau (iPhone) :${NC}"
echo "  - Admin Panel : http://${LOCAL_IP}:3000"
echo "  - Template : http://${LOCAL_IP}:5173"
echo "  - API Server : http://${LOCAL_IP}:3001"
echo ""
echo -e "${YELLOW}⚠️  Vous devez lancer 3 terminaux séparés :${NC}"
echo ""
echo -e "${BLUE}Terminal 1 - Template :${NC}"
echo "  cd template && npm run dev"
echo ""
echo -e "${BLUE}Terminal 2 - API Server :${NC}"
echo "  cd admin-panel && npm run server"
echo ""
echo -e "${BLUE}Terminal 3 - Admin Panel :${NC}"
echo "  cd admin-panel && npm run dev"
echo ""

