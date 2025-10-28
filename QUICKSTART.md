# 🚀 Guide de démarrage rapide - SocialHub

## Installation en 3 étapes

### 1️⃣ Installer MongoDB

Si MongoDB n'est pas installé :

**Ubuntu/Debian:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**MacOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Téléchargez depuis [mongodb.com](https://www.mongodb.com/try/download/community)

### 2️⃣ Installer les dépendances

```bash
cd /home/moupou/CascadeProjects/SocialHub
npm run install:all
```

### 3️⃣ Lancer l'application

**Option A : Script automatique (Linux/Mac)**
```bash
./start.sh
```

**Option B : Manuel**

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

## ✅ Vérification

- Backend : http://localhost:5000
- Frontend : http://localhost:3000
- MongoDB : mongodb://localhost:27017

## 🎯 Premier test

1. Ouvrez http://localhost:3000
2. Cliquez sur "Inscription"
3. Créez un compte (ex: username: alice, email: alice@test.com)
4. Vous êtes redirigé vers le dashboard
5. Testez le chat en temps réel
6. Créez votre premier post dans le Feed

## 🔐 Test du chiffrement

1. Dans le chat, cliquez sur le bouton 🔒 (Chiffrement)
2. Le bouton devient violet = chiffrement activé
3. Envoyez un message
4. Le message est chiffré avant d'être envoyé au serveur
5. Seuls les utilisateurs avec la bonne clé peuvent le lire

## 🎨 Fonctionnalités disponibles

### Chat (Discord-like)
- ✅ Messages en temps réel
- ✅ Canaux multiples (général, développement, random)
- ✅ Indicateur de frappe
- ✅ Liste des utilisateurs en ligne
- ✅ Chiffrement AES activable

### Feed (GitHub/TikTok-like)
- ✅ Création de posts avec titre et contenu
- ✅ Ajout d'images et vidéos
- ✅ Système de likes (♥)
- ✅ Commentaires
- ✅ Tags (#dev, #random, etc.)
- ✅ Feed chronologique

### Sécurité (Telegram-like)
- ✅ Authentification JWT
- ✅ Mots de passe hashés (bcrypt)
- ✅ Chiffrement AES des messages
- ✅ Génération de clés RSA
- ✅ Clés privées stockées localement

## 🐛 Dépannage

**Erreur MongoDB :**
```bash
# Vérifier si MongoDB est lancé
pgrep mongod

# Si pas lancé, démarrer MongoDB
mongod
```

**Port déjà utilisé :**
```bash
# Tuer le processus sur le port 5000
lsof -ti:5000 | xargs kill -9

# Ou changer le port dans backend/.env
PORT=5001
```

**Erreur de connexion frontend :**
- Vérifiez que le backend est bien lancé sur le port 5000
- Vérifiez votre fichier backend/.env

## 📱 Utilisation multi-utilisateurs

Pour tester avec plusieurs utilisateurs :

1. Ouvrez plusieurs fenêtres de navigateur en mode incognito
2. Créez un compte différent dans chaque fenêtre
3. Regardez les messages apparaître en temps réel
4. Testez les likes, commentaires, etc.

## 🎓 Exemples de test

### Test du chat
```
Utilisateur 1 : "Bonjour tout le monde !"
Utilisateur 2 : "Salut ! 👋"
```

### Test du chiffrement
```
1. Activez le chiffrement (bouton 🔒)
2. Envoyez : "Message secret"
3. Dans la base MongoDB, le message est chiffré
4. Dans l'interface, il est déchiffré automatiquement
```

### Test des posts
```
Titre: "Mon premier post sur SocialHub"
Contenu: "Voici une nouvelle plateforme qui combine Discord, GitHub et Telegram !"
Tags: dev, social, tech
Média: https://picsum.photos/800/600
```

## 🌟 Prochaines étapes

1. Personnalisez votre profil
2. Créez vos propres canaux
3. Partagez du contenu multimédia
4. Explorez le code source
5. Ajoutez vos propres fonctionnalités !

## 💡 Astuces

- **Raccourci clavier** : Appuyez sur Entrée pour envoyer un message
- **Markdown dans les posts** : Le contenu supporte le texte simple
- **Avatars** : Générés automatiquement avec vos initiales
- **Notifications** : Compteur de nouveaux messages dans la sidebar

---

Besoin d'aide ? Consultez le [README.md](README.md) complet
