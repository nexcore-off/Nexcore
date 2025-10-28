// Configuration de monétisation
// Modifiez ces valeurs pour activer/désactiver les fonctionnalités

export const MONETIZATION_CONFIG = {
  // Publicités (ACTIF dès maintenant)
  ADS_ENABLED: true,
  GOOGLE_ADSENSE_CLIENT: 'ca-pub-XXXXXXXXXXXXXXXXX', // Remplacez par votre ID AdSense
  AD_SLOTS: {
    FEED_BANNER: 'XXXXXXXXXX', // Slot ID pour les bannières du feed
    SIDEBAR: 'XXXXXXXXXX',      // Slot ID pour la sidebar
  },

  // Abonnement Premium (DÉSACTIVÉ - À activer plus tard)
  PREMIUM_ENABLED: false,  // ⚠️ Changez en true quand vous êtes prêt
  PREMIUM_PRICE: 4.99,     // Prix mensuel en €
  PREMIUM_FEATURES: [
    'Aucune publicité',
    'Canaux illimités',
    'Messages illimités',
    'Badge Premium 👑',
    'Mode sombre exclusif',
    'Support prioritaire',
    'Réactions personnalisées',
    'Stockage 10GB'
  ],

  // Stripe (pour les paiements - à configurer plus tard)
  STRIPE_PUBLIC_KEY: 'pk_test_XXXXXXXXXXXXXXXXXX', // Clé publique Stripe
};

// Helper functions
export const isAdsEnabled = () => MONETIZATION_CONFIG.ADS_ENABLED;
export const isPremiumEnabled = () => MONETIZATION_CONFIG.PREMIUM_ENABLED;
export const shouldShowAds = (user) => {
  if (!isAdsEnabled()) return false;
  return !user?.isPremium; // Ne pas montrer de pubs aux utilisateurs premium
};
