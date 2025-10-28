#!/bin/bash

echo "🚀 Démarrage de SocialHub..."
echo ""

# Vérifier si MongoDB est lancé
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB n'est pas démarré. Veuillez lancer MongoDB d'abord:"
    echo "   mongod"
    echo ""
fi

# Installer les dépendances si nécessaire
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installation des dépendances backend..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installation des dépendances frontend..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "✅ Démarrage des serveurs..."
echo ""

# Démarrer le backend en arrière-plan
cd backend
npm start &
BACKEND_PID=$!
echo "✅ Backend démarré (PID: $BACKEND_PID) sur http://localhost:5000"
cd ..

# Attendre que le backend démarre
sleep 3

# Démarrer le frontend
cd frontend
echo "✅ Démarrage du frontend sur http://localhost:3000"
npm start

# Nettoyer à la sortie
trap "kill $BACKEND_PID" EXIT
