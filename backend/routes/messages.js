const express = require('express');
const router = express.Router();
const { Message } = require('../models');

// Ajouter ou retirer une réaction
router.post('/:messageId/react', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji, userId } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    // Chercher si l'emoji existe déjà
    const reactionIndex = message.reactions.findIndex(r => r.emoji === emoji);

    if (reactionIndex > -1) {
      // L'emoji existe
      const userIndex = message.reactions[reactionIndex].users.indexOf(userId);
      
      if (userIndex > -1) {
        // L'utilisateur a déjà réagi avec cet emoji, on retire
        message.reactions[reactionIndex].users.splice(userIndex, 1);
        
        // Si plus personne n'a cette réaction, on supprime l'emoji
        if (message.reactions[reactionIndex].users.length === 0) {
          message.reactions.splice(reactionIndex, 1);
        }
      } else {
        // L'utilisateur n'a pas encore réagi avec cet emoji, on ajoute
        message.reactions[reactionIndex].users.push(userId);
      }
    } else {
      // L'emoji n'existe pas encore, on le crée
      message.reactions.push({
        emoji: emoji,
        users: [userId]
      });
    }

    await message.save();
    
    // Récupérer le message mis à jour avec populate
    const updatedMessage = await Message.findById(messageId).populate('sender', 'username avatar');
    
    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Erreur réaction', error: error.message });
  }
});

module.exports = router;
