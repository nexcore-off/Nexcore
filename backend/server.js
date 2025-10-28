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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
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

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);

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

  socket.on('sendMessage', async ({ channel, message, userId, encrypted }) => {
    try {
      const newMessage = new Message({
        content: message,
        sender: userId,
        channel: channel,
        encrypted: encrypted
      });
      await newMessage.save();
      
      const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'username avatar');
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
