# 🤝 Guide de contribution - SocialHub

Merci de vouloir contribuer à SocialHub ! Ce guide vous aidera à démarrer.

## 🏗️ Architecture du projet

```
SocialHub/
├── backend/              # Serveur Node.js
│   ├── routes/          # Routes API REST
│   │   ├── auth.js      # Authentification
│   │   ├── posts.js     # Gestion posts
│   │   └── channels.js  # Gestion canaux
│   ├── server.js        # Point d'entrée
│   ├── package.json     # Dépendances backend
│   └── .env            # Variables d'environnement
│
├── frontend/            # Application React
│   ├── public/         # Fichiers statiques
│   ├── src/
│   │   ├── components/ # Composants React
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Chat.js
│   │   │   └── Feed.js
│   │   ├── App.js      # Composant racine
│   │   └── index.js    # Point d'entrée
│   └── package.json    # Dépendances frontend
│
├── README.md           # Documentation principale
├── QUICKSTART.md       # Guide démarrage rapide
├── FEATURES.md         # Détails des fonctionnalités
└── start.sh           # Script de lancement
```

## 🔧 Environnement de développement

### Prérequis
- Node.js 16+
- MongoDB 4.4+
- Git
- Un éditeur de code (VS Code recommandé)

### Installation
```bash
git clone <votre-repo>
cd SocialHub
npm run install:all
```

### Variables d'environnement

Créez un fichier `backend/.env` :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/socialhub
JWT_SECRET=votre_secret_super_secure
ENCRYPTION_KEY=votre_cle_chiffrement
```

## 🎨 Standards de code

### JavaScript/React
- **Style** : Prettier avec config par défaut
- **Linting** : ESLint avec react-app config
- **Naming** :
  - Components : PascalCase (e.g., `UserProfile.js`)
  - Functions : camelCase (e.g., `handleSubmit`)
  - Constants : UPPER_SNAKE_CASE (e.g., `API_URL`)

### CSS
- **Classes** : kebab-case (e.g., `user-profile`)
- **Organisation** : Un fichier CSS par composant
- **Variables** : Utiliser les couleurs du thème

### Commits
Format : `type(scope): message`

Types :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatting, missing semi colons, etc
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Maintenance

Exemples :
```bash
git commit -m "feat(chat): add emoji support"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs(readme): update installation steps"
```

## 🚀 Workflow de développement

### 1. Créer une branche
```bash
git checkout -b feature/nom-de-la-feature
```

### 2. Développer
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### 3. Tester
- Testez manuellement toutes les fonctionnalités affectées
- Vérifiez la console pour les erreurs
- Testez sur différents navigateurs si possible

### 4. Commit et Push
```bash
git add .
git commit -m "feat(component): description"
git push origin feature/nom-de-la-feature
```

### 5. Pull Request
- Créez une PR sur GitHub
- Décrivez les changements
- Ajoutez des screenshots si UI
- Attendez la review

## 🐛 Debugging

### Backend
```javascript
// Ajouter des logs
console.log('Debug:', variable);

// Vérifier les erreurs MongoDB
mongoose.set('debug', true);
```

### Frontend
```javascript
// React DevTools
// Installer l'extension Chrome

// Logs dans les composants
useEffect(() => {
  console.log('State changed:', state);
}, [state]);
```

### WebSocket
```javascript
// Backend
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  
  socket.onAny((event, ...args) => {
    console.log('Event:', event, args);
  });
});

// Frontend
socket.onAny((event, ...args) => {
  console.log('Received:', event, args);
});
```

## 📝 Ajouter une fonctionnalité

### Exemple : Ajouter les réactions aux messages

#### 1. Backend - Modèle
```javascript
// server.js
const MessageSchema = new mongoose.Schema({
  // ... champs existants
  reactions: [{
    emoji: String,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }]
});
```

#### 2. Backend - Route
```javascript
// routes/messages.js (nouveau fichier)
router.post('/:messageId/react', async (req, res) => {
  const { emoji, userId } = req.body;
  // Logique pour ajouter/retirer la réaction
});
```

#### 3. Frontend - Composant
```javascript
// components/MessageReactions.js
function MessageReactions({ message, onReact }) {
  return (
    <div className="reactions">
      {message.reactions?.map((reaction) => (
        <button onClick={() => onReact(reaction.emoji)}>
          {reaction.emoji} {reaction.users.length}
        </button>
      ))}
    </div>
  );
}
```

#### 4. Socket.io - Événement temps réel
```javascript
// Backend
socket.on('addReaction', async ({ messageId, emoji, userId }) => {
  // Ajouter la réaction
  io.to(channel).emit('reactionAdded', { messageId, emoji, userId });
});

// Frontend
socket.on('reactionAdded', ({ messageId, emoji, userId }) => {
  // Mettre à jour l'UI
});
```

## 🎯 Bonnes pratiques

### Performance
- ✅ Éviter les re-renders inutiles (React.memo, useMemo)
- ✅ Utiliser des index MongoDB sur les champs recherchés
- ✅ Limiter le nombre de messages/posts chargés (pagination)
- ✅ Optimiser les images (compression, lazy loading)

### Sécurité
- ✅ Valider toutes les entrées utilisateur
- ✅ Sanitizer le contenu avant affichage (XSS)
- ✅ Utiliser HTTPS en production
- ✅ Ne jamais exposer les secrets (JWT_SECRET, etc.)
- ✅ Rate limiting sur les routes sensibles

### UX
- ✅ Loading states pendant les requêtes
- ✅ Messages d'erreur clairs
- ✅ Confirmations pour actions destructives
- ✅ Feedback visuel sur les actions

## 🧪 Tests (à venir)

### Backend
```javascript
// tests/auth.test.js
describe('Auth API', () => {
  test('Should register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'test', email: 'test@test.com', password: '123456' });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
  });
});
```

### Frontend
```javascript
// components/__tests__/Login.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';

test('renders login form', () => {
  render(<Login />);
  expect(screen.getByText('Connexion')).toBeInTheDocument();
});
```

## 📚 Ressources

### Documentation
- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [Socket.io](https://socket.io/docs/)
- [MongoDB](https://www.mongodb.com/docs/)
- [JWT](https://jwt.io/)

### Outils utiles
- **Postman** : Tester les API
- **MongoDB Compass** : Interface graphique MongoDB
- **React DevTools** : Debugger React
- **Redux DevTools** : Si Redux ajouté plus tard

## 💡 Idées de contributions

### Débutant
- [ ] Ajouter des emojis dans le chat
- [ ] Améliorer les messages d'erreur
- [ ] Ajouter des tooltips
- [ ] Thème sombre

### Intermédiaire
- [ ] Pagination pour le feed
- [ ] Recherche de messages
- [ ] Profils utilisateurs détaillés
- [ ] Notifications en temps réel

### Avancé
- [ ] Appels vidéo WebRTC
- [ ] Partage d'écran
- [ ] Bots et webhooks
- [ ] API publique

## 🤔 Questions ?

- Ouvrez une issue sur GitHub
- Consultez les discussions existantes
- Demandez dans le canal #dev

---

Merci de contribuer à SocialHub ! 🚀
