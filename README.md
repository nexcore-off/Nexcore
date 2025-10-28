# 🚀 Nexcore

Une application moderne combinant les meilleures fonctionnalités de :
- **💬 Discord** : Communication en temps réel avec chat et canaux
- **📝 GitHub** : Système de posts et feed social  
- **🔐 Telegram** : Chiffrement end-to-end des messages
- **🎥 TikTok** : Partage de médias (images et vidéos)

## ✨ Fonctionnalités

### Communication (Discord-like)
- Chat en temps réel avec Socket.io
- Canaux de discussion multiples
- Indicateur de frappe (typing indicator)
- Liste des utilisateurs en ligne

### Posts & Feed (GitHub/TikTok-like)
- Création de posts avec titre et contenu
- Partage d'images et vidéos
- Système de likes et commentaires
- Tags et organisation du contenu
- Feed chronologique

### Sécurité (Telegram-like)
- Chiffrement AES pour les messages
- Authentification JWT
- Génération de paires de clés RSA
- Mode chiffré activable/désactivable

## 🛠️ Technologies

### Backend
- Node.js + Express
- Socket.io (temps réel)
- MongoDB + Mongoose
- JWT (authentification)
- Crypto-JS (chiffrement)

### Frontend
- React 18
- React Router
- Socket.io Client
- Axios
- Lucide React (icônes)
- Date-fns (dates)
- Crypto-JS (chiffrement)

## 📦 Installation

### Prérequis
- Node.js 16+ 
- MongoDB (local ou Atlas)

### 1. Cloner et installer le backend

```bash
cd backend
npm install
```

### 2. Configuration du backend

Créer un fichier `.env` dans le dossier `backend` :

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/socialhub
JWT_SECRET=votre_secret_jwt_super_secure
ENCRYPTION_KEY=votre_cle_chiffrement_super_secure
```

### 3. Installer le frontend

```bash
cd ../frontend
npm install
```

## 🚀 Lancement

### Démarrer MongoDB (si local)

```bash
mongod
```

### Démarrer le backend

```bash
cd backend
npm run dev
# ou
npm start
```

Le serveur démarre sur `http://localhost:5000`

### Démarrer le frontend

```bash
cd frontend
npm start
```

L'application s'ouvre sur `http://localhost:3000`

## 📱 Utilisation

### 1. Créer un compte
- Cliquez sur "Inscription"
- Entrez vos informations
- Une paire de clés de chiffrement est automatiquement générée

### 2. Chat en temps réel
- Sélectionnez un canal dans la sidebar
- Activez le chiffrement avec le bouton 🔒
- Envoyez des messages instantanément
- Voyez qui est en train d'écrire

### 3. Créer des posts
- Allez dans l'onglet "Feed"
- Cliquez sur "Créer un post"
- Ajoutez un titre, contenu, média (optionnel) et tags
- Likez et commentez les posts des autres

## 🔐 Chiffrement

Les messages peuvent être chiffrés end-to-end :
- Activez le mode chiffré avec le bouton dans le chat
- Vos messages sont chiffrés avec AES
- Seuls les utilisateurs avec la bonne clé peuvent les déchiffrer
- La clé privée est stockée localement (jamais sur le serveur)

## 🎨 Interface

Interface moderne avec :
- Dégradés colorés
- Animations fluides
- Design responsive
- Thème sombre pour la sidebar
- Avatars générés automatiquement

## 📂 Structure du projet

```
SocialHub/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Authentification
│   │   ├── posts.js         # Gestion des posts
│   │   └── channels.js      # Gestion des canaux
│   ├── server.js            # Serveur principal
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.js     # Page de connexion
    │   │   ├── Dashboard.js # Tableau de bord
    │   │   ├── Chat.js      # Composant chat
    │   │   └── Feed.js      # Composant feed
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🔧 API Endpoints

### Auth
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile/:userId` - Profil utilisateur

### Posts
- `GET /api/posts` - Liste des posts
- `POST /api/posts` - Créer un post
- `GET /api/posts/:postId` - Détails d'un post
- `POST /api/posts/:postId/like` - Liker un post
- `POST /api/posts/:postId/comment` - Commenter un post

### Channels
- `GET /api/channels` - Liste des canaux
- `POST /api/channels` - Créer un canal
- `POST /api/channels/:channelId/join` - Rejoindre un canal
- `GET /api/channels/:channelName/messages` - Messages d'un canal

### WebSocket Events
- `join` - Rejoindre le chat
- `joinChannel` - Rejoindre un canal
- `sendMessage` - Envoyer un message
- `typing` - Indicateur de frappe
- `newMessage` - Nouveau message reçu
- `userTyping` - Utilisateur en train d'écrire
- `userList` - Liste des utilisateurs en ligne

## 🌟 Fonctionnalités futures

- [ ] Appels vidéo/audio
- [ ] Partage de fichiers
- [ ] Notifications push
- [ ] Mode sombre complet
- [ ] Stories (comme Instagram/TikTok)
- [ ] Groupes privés
- [ ] Modération
- [ ] Recherche avancée
- [ ] Émojis et réactions
- [ ] Profils personnalisables

## 📄 Licence

MIT

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou un pull request.

---

Développé avec ❤️ par vous
