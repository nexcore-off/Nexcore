import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { Send, Lock, Unlock, Smile, SmilePlus } from 'lucide-react';
import EmojiPicker from './EmojiPicker';
import ReactionPicker from './ReactionPicker';
import './Chat.css';

const API_URL = 'http://localhost:5000';

function Chat({ user, channel, onNewMessage }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.emit('join', { username: user.username, userId: user.id });
    newSocket.emit('joinChannel', channel);

    newSocket.on('newMessage', (message) => {
      setMessages(prev => [...prev, message]);
      // Notifier le Dashboard d'un nouveau message
      if (onNewMessage && message.channel) {
        onNewMessage(message.channel);
      }
    });

    newSocket.on('userTyping', ({ username }) => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    });

    newSocket.on('reactionUpdate', (updatedMessage) => {
      setMessages(prev => prev.map(msg => 
        msg._id === updatedMessage._id ? updatedMessage : msg
      ));
    });

    loadMessages();

    return () => newSocket.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/channels/${channel}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const encryptMessage = (message) => {
    const encryptionKey = localStorage.getItem('privateKey') || 'default-key';
    return CryptoJS.AES.encrypt(message, encryptionKey).toString();
  };

  const decryptMessage = (encryptedMessage) => {
    try {
      const encryptionKey = localStorage.getItem('privateKey') || 'default-key';
      const bytes = CryptoJS.AES.decrypt(encryptedMessage, encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8) || encryptedMessage;
    } catch (error) {
      return encryptedMessage;
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageToSend = isEncrypted ? encryptMessage(newMessage) : newMessage;

    socket.emit('sendMessage', {
      channel: channel,
      message: messageToSend,
      userId: user.id,
      encrypted: isEncrypted
    });

    setNewMessage('');
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', { channel: channel, username: user.username });
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji);
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      const response = await axios.post(`${API_URL}/api/messages/${messageId}/react`, {
        emoji: emoji,
        userId: user.id
      });
      
      // Mettre à jour le message localement
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? response.data : msg
      ));

      // Émettre via socket pour les autres utilisateurs
      if (socket) {
        socket.emit('messageReaction', {
          channel: channel,
          message: response.data
        });
      }
    } catch (error) {
      console.error('Erreur réaction:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="channel-info">
          <h2># {channel}</h2>
          <span className="channel-description">Canal de discussion</span>
        </div>
        <button 
          className={`encryption-btn ${isEncrypted ? 'active' : ''}`}
          onClick={() => setIsEncrypted(!isEncrypted)}
          title={isEncrypted ? 'Chiffrement activé' : 'Chiffrement désactivé'}
        >
          {isEncrypted ? <Lock size={18} /> : <Unlock size={18} />}
          {isEncrypted ? 'Chiffré' : 'Non chiffré'}
        </button>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className="message"
            onMouseEnter={() => setHoveredMessage(msg._id)}
            onMouseLeave={() => setHoveredMessage(null)}
          >
            <img 
              src={msg.sender?.avatar || 'https://ui-avatars.com/api/?name=User'} 
              alt={msg.sender?.username} 
              className="message-avatar"
            />
            <div className="message-content">
              <div className="message-header">
                <span className="message-author">{msg.sender?.username || 'Utilisateur'}</span>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                {msg.encrypted && <Lock size={12} className="encrypted-icon" />}
                
                {hoveredMessage === msg._id && (
                  <button 
                    className="add-reaction-btn"
                    onClick={() => setShowReactionPicker(showReactionPicker === msg._id ? null : msg._id)}
                  >
                    <SmilePlus size={16} />
                  </button>
                )}
              </div>
              <div className="message-text">
                {msg.encrypted ? decryptMessage(msg.content) : msg.content}
              </div>

              {/* Afficher les réactions */}
              {msg.reactions && msg.reactions.length > 0 && (
                <div className="message-reactions">
                  {msg.reactions.map((reaction, idx) => {
                    const hasReacted = reaction.users.includes(user.id);
                    return (
                      <button
                        key={idx}
                        className={`reaction-badge ${hasReacted ? 'reacted' : ''}`}
                        onClick={() => handleReaction(msg._id, reaction.emoji)}
                      >
                        {reaction.emoji} {reaction.users.length}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ReactionPicker */}
              {showReactionPicker === msg._id && (
                <div style={{ position: 'relative' }}>
                  <ReactionPicker
                    onReact={(emoji) => handleReaction(msg._id, emoji)}
                    onClose={() => setShowReactionPicker(null)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <span>Quelqu'un est en train d'écrire</span>
            <span className="dots">...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-container" onSubmit={handleSend}>
        <button 
          type="button" 
          className="emoji-btn-trigger"
          onClick={() => setShowEmojiPicker(true)}
        >
          <Smile size={22} />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleTyping}
          placeholder={`Message dans #${channel}...`}
          className="message-input"
        />
        <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
          <Send size={20} />
        </button>
      </form>

      {showEmojiPicker && (
        <EmojiPicker 
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
}

export default Chat;
