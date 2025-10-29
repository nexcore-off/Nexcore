const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://nexcores.netlify.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  maxHttpBufferSize: 10e6 // 10MB max pour les images
});

// Middleware - CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://nexcores.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialhub', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connecté à MongoDB');
}).catch(err => {
  console.error('❌ Erreur MongoDB:', err);
  console.log('⚠️  MongoDB non disponible. Veuillez installer MongoDB ou utiliser MongoDB Atlas.');
  console.log('📖 Voir INSTALL_MONGODB.md pour les instructions d\'installation');
});

// Models
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  publicKey: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const MessageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  channel: { type: String, required: true },
  encrypted: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mediaUrl: { type: String },
  mediaType: { type: String, enum: ['image', 'video', 'none'], default: 'none' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const ChannelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  type: { type: String, enum: ['text', 'voice'], default: 'text' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Message = mongoose.model('Message', MessageSchema);
const Post = mongoose.model('Post', PostSchema);
const Channel = mongoose.model('Channel', ChannelSchema);

// Routes - Authentication
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const channelRoutes = require('./routes/channels');
const messageRoutes = require('./routes/messages');
const searchRoutes = require('./routes/search');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/search', searchRoutes);

// Socket.IO - Communication en temps réel (comme Discord)
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('👤 Nouvel utilisateur connecté:', socket.id);

  socket.on('join', ({ username, userId }) => {
    activeUsers.set(socket.id, { username, userId });
    io.emit('userList', Array.from(activeUsers.values()));
    console.log(`✅ ${username} a rejoint`);
  });

  socket.on('joinChannel', (channel) => {
    socket.join(channel);
    console.log(`📢 Utilisateur rejoint le canal: ${channel}`);
  });

  socket.on('sendMessage', async ({ channel, content, message, userId, encrypted, imageData }) => {
    try {
      console.log('📨 Envoi message, imageData présent:', !!imageData);
      if (imageData) {
        console.log('📏 Taille imageData:', (imageData.length / 1024).toFixed(2), 'KB');
      }
      
      const newMessage = new Message({
        content: content || message,
        sender: userId,
        channel: channel,
        encrypted: encrypted,
        imageData: imageData || null
      });
      await newMessage.save();
      console.log('💾 Message sauvegardé, imageData dans DB:', !!newMessage.imageData);
      
      const populatedMessage = await Message.findById(newMessage._id)
        .populate('sender', 'username avatar')
        .select('+imageData'); // Explicitement inclure imageData
      
      console.log('📤 Message populé envoyé, imageData:', !!populatedMessage.imageData);
      if (populatedMessage.imageData) {
        console.log('✅ ImageData bien présent dans le message envoyé!');
      } else {
        console.log('❌ ImageData MANQUANT dans le message envoyé!');
      }
      
      io.to(channel).emit('newMessage', populatedMessage);
    } catch (error) {
      console.error('Erreur envoi message:', error);
    }
  });

  socket.on('typing', ({ channel, username }) => {
    socket.to(channel).emit('userTyping', { username });
  });

  socket.on('messageReaction', ({ channel, message }) => {
    socket.to(channel).emit('reactionUpdate', message);
  });

  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      console.log(`❌ ${user.username} s'est déconnecté`);
      activeUsers.delete(socket.id);
      io.emit('userList', Array.from(activeUsers.values()));
    }
  });
});

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 SocialHub API',
    features: [
      '💬 Communication Discord-like',
      '📝 Posts GitHub-like', 
      '🔐 Chiffrement Telegram-like',
      '🎥 Média TikTok-like'
    ]
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
