const express = require('express');
const router = express.Router();
const { User, Message, Post } = require('../models');

// Recherche globale
router.get('/', async (req, res) => {
  try {
    const { q, type } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.json({ messages: [], posts: [], users: [] });
    }

    const searchQuery = q.trim();
    const results = {};

    // Recherche de messages
    if (!type || type === 'messages') {
      results.messages = await Message.find({
        content: { $regex: searchQuery, $options: 'i' }
      })
      .populate('sender', 'username avatar')
      .sort({ timestamp: -1 })
      .limit(20);
    }

    // Recherche de posts
    if (!type || type === 'posts') {
      results.posts = await Post.find({
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { content: { $regex: searchQuery, $options: 'i' } }
        ]
      })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(20);
    }

    // Recherche d'utilisateurs
    if (!type || type === 'users') {
      results.users = await User.find({
        $or: [
          { username: { $regex: searchQuery, $options: 'i' } },
          { bio: { $regex: searchQuery, $options: 'i' } }
        ]
      })
      .select('username avatar bio createdAt')
      .limit(20);
    }

    res.json(results);
  } catch (error) {
    console.error('Erreur recherche:', error);
    res.status(500).json({ message: 'Erreur lors de la recherche', error: error.message });
  }
});

module.exports = router;
