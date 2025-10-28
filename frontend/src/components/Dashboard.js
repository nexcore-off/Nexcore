import React, { useState, useEffect } from 'react';
import { MessageCircle, FileText, LogOut, Hash, Plus, X, Moon, Sun, Crown } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../ThemeContext';
import { isPremiumEnabled } from '../config/monetization';
import Chat from './Chat';
import Feed from './Feed';
import Pricing from './Pricing';
import SearchBar from './SearchBar';
import './Dashboard.css';

const API_URL = 'https://nexcore-backend.onrender.com/api';

function Dashboard({ user, onLogout }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('chat');
  const [currentChannel, setCurrentChannel] = useState('général');
  const [channels, setChannels] = useState([]);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [unreadMessages, setUnreadMessages] = useState({}); // {channelName: count}

  // Charger les canaux au démarrage
  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const response = await axios.get(`${API_URL}/channels`);
      setChannels(response.data);
    } catch (error) {
      console.error('Erreur chargement canaux:', error);
      // Canaux par défaut si erreur
      setChannels(['général', 'développement', 'random']);
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    try {
      await axios.post(`${API_URL}/channels`, {
        name: newChannelName.toLowerCase().trim(),
        description: newChannelDesc,
        type: 'text'
      });
      
      setNewChannelName('');
      setNewChannelDesc('');
      setShowCreateChannel(false);
      loadChannels(); // Recharger les canaux
    } catch (error) {
      console.error('Erreur création canal:', error);
      alert(error.response?.data?.message || 'Erreur lors de la création du canal');
    }
  };

  const handleChannelChange = (channelName) => {
    setCurrentChannel(channelName);
    setActiveTab('chat');
    // Marquer les messages comme lus pour ce canal
    setUnreadMessages(prev => ({
      ...prev,
      [channelName]: 0
    }));
  };

  const handleNewMessage = (channelName) => {
    // Incrémenter le compteur si ce n'est pas le canal actif
    if (channelName !== currentChannel || activeTab !== 'chat') {
      setUnreadMessages(prev => ({
        ...prev,
        [channelName]: (prev[channelName] || 0) + 1
      }));
    }
  };

  // Calculer le total de messages non lus
  const totalUnread = Object.values(unreadMessages).reduce((sum, count) => sum + count, 0);

  const handleSearchResult = (type, item) => {
    if (type === 'message') {
      // Aller au canal du message
      setCurrentChannel(item.channel);
      setActiveTab('chat');
    } else if (type === 'post') {
      // Aller au feed
      setActiveTab('feed');
    } else if (type === 'user') {
      // Pour l'instant, juste afficher une notification
      alert(`Profil de ${item.username} - Fonctionnalité à venir !`);
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>🚀 Nexcore</h2>
        </div>

        <div className="user-profile">
          <img src={user.avatar} alt={user.username} className="avatar" />
          <div>
            <div className="username">{user.username}</div>
            <div className="user-status">🟢 En ligne</div>
          </div>
        </div>

        <nav className="nav-menu">
          <button 
            className={activeTab === 'chat' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('chat')}
          >
            <MessageCircle size={20} />
            Chat
            {totalUnread > 0 && <span className="badge">{totalUnread}</span>}
          </button>
          <button 
            className={activeTab === 'feed' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('feed')}
          >
            <FileText size={20} />
            Feed
          </button>
        </nav>

        <div className="channels-section">
          <div className="section-header">
            <Hash size={16} />
            <span>Canaux</span>
            <Plus 
              size={16} 
              className="add-icon" 
              onClick={() => setShowCreateChannel(true)}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className="channel-list">
            {channels.map((channel) => {
              const channelName = typeof channel === 'string' ? channel : channel.name;
              const unreadCount = unreadMessages[channelName] || 0;
              return (
                <div 
                  key={channelName}
                  className={`channel-item ${currentChannel === channelName ? 'active' : ''}`}
                  onClick={() => handleChannelChange(channelName)}
                >
                  <span># {channelName}</span>
                  {unreadCount > 0 && (
                    <span className="channel-badge">{unreadCount}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bouton Premium (visible seulement si activé dans la config) */}
        {isPremiumEnabled() && !user.isPremium && (
          <button className="premium-btn" onClick={() => setShowPricing(true)}>
            <Crown size={18} />
            Passer à Premium
          </button>
        )}

        {/* Badge Premium si l'utilisateur est premium */}
        {user.isPremium && (
          <div className="premium-badge-user">
            <Crown size={16} />
            <span>Membre Premium</span>
          </div>
        )}

        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          {isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
        </button>

        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>

      <div className="main-content">
        <div className="main-header">
          <SearchBar onResultClick={handleSearchResult} />
        </div>

        {activeTab === 'chat' && (
          <Chat 
            user={user} 
            channel={currentChannel} 
            onNewMessage={handleNewMessage}
          />
        )}
        {activeTab === 'feed' && <Feed user={user} />}
      </div>

      {/* Modal de création de canal */}
      {showCreateChannel && (
        <div className="modal-overlay" onClick={() => setShowCreateChannel(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Créer un nouveau canal</h3>
              <X 
                size={24} 
                onClick={() => setShowCreateChannel(false)} 
                style={{ cursor: 'pointer' }}
              />
            </div>
            <form onSubmit={handleCreateChannel} className="modal-form">
              <div className="form-group">
                <label htmlFor="channelName">Nom du canal</label>
                <input
                  id="channelName"
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="ex: design, gaming, musique..."
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="channelDesc">Description (optionnel)</label>
                <textarea
                  id="channelDesc"
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                  placeholder="De quoi parle ce canal ?"
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowCreateChannel(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Créer le canal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Pricing */}
      {showPricing && (
        <Pricing 
          onClose={() => setShowPricing(false)}
          user={user}
        />
      )}
    </div>
  );
}

export default Dashboard;
