import React from 'react';
import { Check, Crown, X } from 'lucide-react';
import { MONETIZATION_CONFIG } from '../config/monetization';
import './Pricing.css';

function Pricing({ onClose, user }) {
  const handleUpgrade = () => {
    // TODO: Intégrer Stripe pour le paiement
    alert('Paiement avec Stripe - À implémenter quand Premium sera activé');
    // window.location.href = '/checkout'; // Redirection vers Stripe Checkout
  };

  return (
    <div className="pricing-overlay" onClick={onClose}>
      <div className="pricing-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="pricing-header">
          <Crown size={48} className="crown-icon" />
          <h2>Passez à Premium</h2>
          <p>Profitez de SocialHub sans publicité et avec des fonctionnalités exclusives</p>
        </div>

        <div className="pricing-cards">
          {/* Plan Gratuit */}
          <div className="pricing-card">
            <h3>Gratuit</h3>
            <div className="price">
              <span className="amount">0€</span>
              <span className="period">/mois</span>
            </div>
            <ul className="features-list">
              <li><Check size={16} /> Accès aux canaux publics</li>
              <li><Check size={16} /> Messages illimités</li>
              <li><Check size={16} /> Réactions de base</li>
              <li className="disabled"><X size={16} /> Publicités présentes</li>
              <li className="disabled"><X size={16} /> Pas de badge Premium</li>
            </ul>
            <button className="btn-plan current" disabled>
              Plan actuel
            </button>
          </div>

          {/* Plan Premium */}
          <div className="pricing-card premium">
            <div className="badge-popular">Populaire</div>
            <h3>Premium <Crown size={20} /></h3>
            <div className="price">
              <span className="amount">{MONETIZATION_CONFIG.PREMIUM_PRICE}€</span>
              <span className="period">/mois</span>
            </div>
            <ul className="features-list">
              {MONETIZATION_CONFIG.PREMIUM_FEATURES.map((feature, index) => (
                <li key={index}>
                  <Check size={16} /> {feature}
                </li>
              ))}
            </ul>
            <button className="btn-plan premium-btn" onClick={handleUpgrade}>
              Passer à Premium
            </button>
          </div>
        </div>

        <div className="pricing-footer">
          <p>💳 Paiement sécurisé par Stripe • Résiliable à tout moment</p>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
