const express = require('express');
const router = express.Router();
const { Channel, Message } = require('../models');

// Créer un canal
router.post('/', async (req, res) => {
  try {
    const { name, description, type } = req.body;

    const existingChannel = await Channel.findOne({ name });
    if (existingChannel) {
      return res.status(400).json({ message: 'Canal déjà existant' });
    }

    const channel = new Channel({
      name,
      description: description || '',
      type: type || 'text'
    });

    await channel.save();
    res.status(201).json({ message: 'Canal créé', channel });
  } catch (error) {
    res.status(500).json({ message: 'Erreur création canal', error: error.message });
  }
});

// Récupérer tous les canaux
router.get('/', async (req, res) => {
  try {
    const channels = await Channel.find().sort({ createdAt: -1 });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération canaux', error: error.message });
  }
});

// Rejoindre un canal
router.post('/:channelId/join', async (req, res) => {
  try {
    const { userId } = req.body;
    const channel = await Channel.findById(req.params.channelId);

    if (!channel) {
      return res.status(404).json({ message: 'Canal non trouvé' });
    }

    if (!channel.members.includes(userId)) {
      channel.members.push(userId);
      await channel.save();
    }

    res.json({ message: 'Canal rejoint', channel });
  } catch (error) {
    res.status(500).json({ message: 'Erreur rejoindre canal', error: error.message });
  }
});

// Récupérer les messages d'un canal
router.get('/:channelName/messages', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const messages = await Message.find({ channel: req.params.channelName })
      .populate('sender', 'username avatar')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération messages', error: error.message });
  }
});

module.exports = router;
