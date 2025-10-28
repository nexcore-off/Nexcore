import React, { useEffect } from 'react';
import { MONETIZATION_CONFIG } from '../config/monetization';
import './AdBanner.css';

function AdBanner({ slot = 'FEED_BANNER', format = 'auto', style = {} }) {
  useEffect(() => {
    // Charger le script AdSense si pas déjà chargé
    if (!window.adsbygoogle) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${MONETIZATION_CONFIG.GOOGLE_ADSENSE_CLIENT}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Initialiser la pub
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  // Si AdSense n'est pas configuré, afficher un placeholder
  if (MONETIZATION_CONFIG.GOOGLE_ADSENSE_CLIENT === 'ca-pub-XXXXXXXXXXXXXXXXX') {
    return (
      <div className="ad-banner-placeholder" style={style}>
        <div className="ad-content">
          <p>📢 Espace publicitaire</p>
          <small>Configurez Google AdSense dans config/monetization.js</small>
        </div>
      </div>
    );
  }

  return (
    <div className="ad-banner-container" style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={MONETIZATION_CONFIG.GOOGLE_ADSENSE_CLIENT}
        data-ad-slot={MONETIZATION_CONFIG.AD_SLOTS[slot]}
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

export default AdBanner;
