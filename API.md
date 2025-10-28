# 📡 Documentation API - SocialHub

Base URL : `http://localhost:5000/api`

## 🔐 Authentification

### POST /auth/register
Créer un nouveau compte utilisateur

**Request:**
```json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "motdepasse123"
}
```

**Response (201):**
```json
{
  "message": "Utilisateur créé avec succès",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "alice",
    "email": "alice@example.com",
    "avatar": "https://ui-avatars.com/api/?name=alice&background=random",
    "publicKey": "-----BEGIN PUBLIC KEY-----..."
  },
  "privateKey": "-----BEGIN PRIVATE KEY-----..."
}
```

**Errors:**
- `400` : Utilisateur déjà existant
- `500` : Erreur serveur

---

### POST /auth/login
Se connecter avec un compte existant

**Request:**
```json
{
  "email": "alice@example.com",
  "password": "motdepasse123"
}
```

**Response (200):**
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "alice",
    "email": "alice@example.com",
    "avatar": "https://ui-avatars.com/api/?name=alice&background=random",
    "publicKey": "-----BEGIN PUBLIC KEY-----..."
  }
}
```

**Errors:**
- `400` : Identifiants incorrects
- `500` : Erreur serveur

---

### GET /auth/profile/:userId
Récupérer le profil d'un utilisateur

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "alice",
  "email": "alice@example.com",
  "avatar": "https://ui-avatars.com/api/?name=alice",
  "bio": "Développeuse passionnée",
  "publicKey": "-----BEGIN PUBLIC KEY-----...",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Errors:**
- `404` : Utilisateur non trouvé
- `500` : Erreur serveur

---

## 📝 Posts

### GET /posts
Récupérer la liste des posts (feed)

**Query Parameters:**
- `page` (optional) : Numéro de page (défaut: 1)
- `limit` (optional) : Nombre de posts par page (défaut: 10)

**Response (200):**
```json
{
  "posts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Mon premier post",
      "content": "Contenu du post...",
      "author": {
        "_id": "507f1f77bcf86cd799439012",
        "username": "alice",
        "avatar": "https://ui-avatars.com/api/?name=alice"
      },
      "mediaUrl": "https://example.com/image.jpg",
      "mediaType": "image",
      "likes": ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"],
      "comments": [
        {
          "user": {
            "username": "bob",
            "avatar": "https://ui-avatars.com/api/?name=bob"
          },
          "text": "Super post !",
          "createdAt": "2024-01-15T11:00:00.000Z"
        }
      ],
      "tags": ["dev", "social"],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

---

### POST /posts
Créer un nouveau post

**Request:**
```json
{
  "title": "Mon nouveau post",
  "content": "Contenu intéressant...",
  "author": "507f1f77bcf86cd799439011",
  "mediaUrl": "https://example.com/video.mp4",
  "mediaType": "video",
  "tags": ["tech", "video"]
}
```

**Response (201):**
```json
{
  "message": "Post créé avec succès",
  "post": {
    "_id": "507f1f77bcf86cd799439020",
    "title": "Mon nouveau post",
    "content": "Contenu intéressant...",
    "author": {
      "username": "alice",
      "avatar": "https://ui-avatars.com/api/?name=alice"
    },
    "mediaUrl": "https://example.com/video.mp4",
    "mediaType": "video",
    "likes": [],
    "comments": [],
    "tags": ["tech", "video"],
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
```

**Errors:**
- `500` : Erreur création post

---

### GET /posts/:postId
Récupérer un post spécifique

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Mon premier post",
  "content": "Contenu du post...",
  "author": {
    "username": "alice",
    "avatar": "https://ui-avatars.com/api/?name=alice"
  },
  "mediaUrl": "https://example.com/image.jpg",
  "mediaType": "image",
  "likes": ["507f1f77bcf86cd799439013"],
  "comments": [],
  "tags": ["dev"],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Errors:**
- `404` : Post non trouvé
- `500` : Erreur serveur

---

### POST /posts/:postId/like
Liker ou dé-liker un post

**Request:**
```json
{
  "userId": "507f1f77bcf86cd799439011"
}
```

**Response (200):**
```json
{
  "message": "Like mis à jour",
  "likes": 5
}
```

**Errors:**
- `404` : Post non trouvé
- `500` : Erreur serveur

---

### POST /posts/:postId/comment
Ajouter un commentaire à un post

**Request:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "text": "Excellent post !"
}
```

**Response (200):**
```json
{
  "message": "Commentaire ajouté",
  "comments": [
    {
      "user": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "alice",
        "avatar": "https://ui-avatars.com/api/?name=alice"
      },
      "text": "Excellent post !",
      "createdAt": "2024-01-15T12:30:00.000Z"
    }
  ]
}
```

**Errors:**
- `404` : Post non trouvé
- `500` : Erreur serveur

---

## 📢 Channels (Canaux)

### GET /channels
Récupérer tous les canaux

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439030",
    "name": "général",
    "description": "Canal de discussion générale",
    "type": "text",
    "members": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
    "createdAt": "2024-01-15T09:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439031",
    "name": "développement",
    "description": "Discussions techniques",
    "type": "text",
    "members": ["507f1f77bcf86cd799439011"],
    "createdAt": "2024-01-15T09:00:00.000Z"
  }
]
```

---

### POST /channels
Créer un nouveau canal

**Request:**
```json
{
  "name": "design",
  "description": "Discussions sur le design",
  "type": "text"
}
```

**Response (201):**
```json
{
  "message": "Canal créé",
  "channel": {
    "_id": "507f1f77bcf86cd799439032",
    "name": "design",
    "description": "Discussions sur le design",
    "type": "text",
    "members": [],
    "createdAt": "2024-01-15T13:00:00.000Z"
  }
}
```

**Errors:**
- `400` : Canal déjà existant
- `500` : Erreur serveur

---

### POST /channels/:channelId/join
Rejoindre un canal

**Request:**
```json
{
  "userId": "507f1f77bcf86cd799439011"
}
```

**Response (200):**
```json
{
  "message": "Canal rejoint",
  "channel": {
    "_id": "507f1f77bcf86cd799439030",
    "name": "général",
    "members": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
  }
}
```

**Errors:**
- `404` : Canal non trouvé
- `500` : Erreur serveur

---

### GET /channels/:channelName/messages
Récupérer les messages d'un canal

**Query Parameters:**
- `limit` (optional) : Nombre de messages (défaut: 50)

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439040",
    "content": "Bonjour tout le monde !",
    "sender": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "alice",
      "avatar": "https://ui-avatars.com/api/?name=alice"
    },
    "channel": "général",
    "encrypted": false,
    "timestamp": "2024-01-15T10:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439041",
    "content": "U2FsdGVkX1+vupppZksvRf5...",
    "sender": {
      "_id": "507f1f77bcf86cd799439012",
      "username": "bob",
      "avatar": "https://ui-avatars.com/api/?name=bob"
    },
    "channel": "général",
    "encrypted": true,
    "timestamp": "2024-01-15T10:05:00.000Z"
  }
]
```

**Errors:**
- `500` : Erreur serveur

---

## 🔌 WebSocket Events (Socket.io)

### Client → Server

#### `join`
Se connecter au chat

**Payload:**
```json
{
  "username": "alice",
  "userId": "507f1f77bcf86cd799439011"
}
```

---

#### `joinChannel`
Rejoindre un canal spécifique

**Payload:**
```json
"général"
```

---

#### `sendMessage`
Envoyer un message

**Payload:**
```json
{
  "channel": "général",
  "message": "Hello world!",
  "userId": "507f1f77bcf86cd799439011",
  "encrypted": false
}
```

---

#### `typing`
Indiquer que l'utilisateur est en train d'écrire

**Payload:**
```json
{
  "channel": "général",
  "username": "alice"
}
```

---

### Server → Client

#### `newMessage`
Nouveau message reçu

**Payload:**
```json
{
  "_id": "507f1f77bcf86cd799439040",
  "content": "Hello world!",
  "sender": {
    "username": "alice",
    "avatar": "https://ui-avatars.com/api/?name=alice"
  },
  "channel": "général",
  "encrypted": false,
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

---

#### `userTyping`
Un utilisateur est en train d'écrire

**Payload:**
```json
{
  "username": "alice"
}
```

---

#### `userList`
Liste mise à jour des utilisateurs en ligne

**Payload:**
```json
[
  {
    "username": "alice",
    "userId": "507f1f77bcf86cd799439011"
  },
  {
    "username": "bob",
    "userId": "507f1f77bcf86cd799439012"
  }
]
```

---

## 🔒 Codes d'erreur HTTP

- `200` : Succès
- `201` : Créé avec succès
- `400` : Mauvaise requête / Données invalides
- `401` : Non authentifié
- `403` : Non autorisé
- `404` : Ressource non trouvée
- `500` : Erreur serveur interne

---

## 🧪 Exemples avec cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "email": "alice@example.com",
    "password": "pass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "pass123"
  }'
```

### Create Post
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "This is a test",
    "author": "507f1f77bcf86cd799439011",
    "tags": ["test"]
  }'
```

### Get Posts
```bash
curl http://localhost:5000/api/posts?page=1&limit=10
```

---

## 🔐 Authentification (JWT)

Pour les routes protégées (à implémenter) :

```bash
curl http://localhost:5000/api/protected-route \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Le token JWT contient :
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "username": "alice",
  "iat": 1705315200,
  "exp": 1705919999
}
```

---

## 📊 Rate Limiting (à implémenter)

Recommandations pour la production :
- Auth endpoints : 5 requêtes/minute
- Posts endpoints : 20 requêtes/minute
- Messages : 100 messages/minute

---

**Note** : Cette API est en développement. De nouveaux endpoints seront ajoutés régulièrement.
