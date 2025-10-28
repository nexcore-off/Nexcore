const express = require('express');
const router = express.Router();
const { Post } = require('../models');

// Créer un post (comme GitHub/TikTok)
router.post('/', async (req, res) => {
  try {
    const { title, content, author, mediaUrl, mediaType, tags } = req.body;

    const post = new Post({
      title,
      content,
      author,
      mediaUrl: mediaUrl || '',
      mediaType: mediaType || 'none',
      tags: tags || []
    });

    await post.save();
    const populatedPost = await Post.findById(post._id).populate('author', 'username avatar');

    res.status(201).json({
      message: 'Post créé avec succès',
      post: populatedPost
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur création post', error: error.message });
  }
});

// Récupérer tous les posts (feed)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const posts = await Post.find()
      .populate('author', 'username avatar')
      .populate('comments.user', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Post.countDocuments();

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération posts', error: error.message });
  }
});

// Récupérer un post spécifique
router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'username avatar')
      .populate('comments.user', 'username avatar');
    
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération post', error: error.message });
  }
});

// Liker un post
router.post('/:postId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ message: 'Like mis à jour', likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Erreur like', error: error.message });
  }
});

// Commenter un post
router.post('/:postId/comment', async (req, res) => {
  try {
    const { userId, text } = req.body;
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    post.comments.push({ user: userId, text });
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('comments.user', 'username avatar');

    res.json({ message: 'Commentaire ajouté', comments: updatedPost.comments });
  } catch (error) {
    res.status(500).json({ message: 'Erreur commentaire', error: error.message });
  }
});

module.exports = router;
