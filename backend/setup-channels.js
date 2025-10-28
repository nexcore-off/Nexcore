// Script pour créer les canaux par défaut
require('dotenv').config();
const mongoose = require('mongoose');
const { Channel } = require('./models');

const defaultChannels = [
  {
    name: 'général',
    description: 'Discussions générales pour tous',
    type: 'text'
  },
  {
    name: 'développement',
    description: 'Parlons code et tech !',
    type: 'text'
  },
  {
    name: 'random',
    description: 'Pour tout et n\'importe quoi',
    type: 'text'
  }
];

async function setupChannels() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialhub', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connecté à MongoDB');

    for (const channelData of defaultChannels) {
      const existing = await Channel.findOne({ name: channelData.name });
      if (!existing) {
        const channel = new Channel(channelData);
        await channel.save();
        console.log(`✅ Canal créé: ${channelData.name}`);
      } else {
        console.log(`ℹ️  Canal existe déjà: ${channelData.name}`);
      }
    }

    console.log('🎉 Canaux par défaut créés avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

setupChannels();
