import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { Send, Lock, Unlock, Smile, SmilePlus, Image, X } from 'lucide-react';
import EmojiPicker from './EmojiPicker';
import ReactionPicker from './ReactionPicker';
import './Chat.css';

const API_URL = 'https://nexcore-backend.onrender.com';

function Chat({ user, channel, onNewMessage }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageModal, setShowImageModal] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.emit('join', { username: user.username, userId: user.id });
    newSocket.emit('joinChannel', channel);

    newSocket.on('newMessage', (message) => {
      console.log('🆕 Nouveau message reçu:', message);
      if (message.imageData) {
        console.log('📸 Message contient une image!');
      }
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
      console.log('📥 Messages chargés:', response.data.length);
      console.log('📸 Messages avec images:', response.data.filter(m => m.imageData).length);
      if (response.data.some(m => m.imageData)) {
        console.log('🖼️ Exemple de message avec image:', response.data.find(m => m.imageData));
      }
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((newMessage.trim() === '' && !selectedImage) || !socket) return;

    let messageContent = newMessage || ' ';
    let imageData = null;

    if (isEncrypted) {
      messageContent = CryptoJS.AES.encrypt(newMessage, 'secret-key').toString();
    }

    // Compress image if present
    if (selectedImage && imagePreview) {
      imageData = await compressImage(imagePreview);
    }

    socket.emit('sendMessage', {
      channel: channel,
      content: messageContent,
      username: user.username,
      userId: user.id,
      encrypted: isEncrypted,
      imageData: imageData
    });

    setNewMessage('');
    removeImage();
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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        alert('Image trop grande (max 5MB)');
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const compressImage = (base64Image, maxWidth = 800) => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.src = base64Image;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
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

              {/* Afficher l'image si présente */}
              {msg.imageData && (
                <div className="message-image">
                  <img 
                    src={msg.imageData} 
                    alt="Image partagée"
                    onClick={() => setShowImageModal(msg.imageData)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              )}

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

      <form className="message-input-container" onSubmit={handleSendMessage}>
        {/* Preview de l'image sélectionnée */}
        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" className="image-preview" />
            <button 
              type="button" 
              className="remove-image-btn"
              onClick={removeImage}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="input-wrapper">
          <button 
            type="button" 
            className="emoji-btn-trigger"
            onClick={() => setShowEmojiPicker(true)}
          >
            <Smile size={22} />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button 
            type="button" 
            className="image-btn-trigger"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={22} />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleTyping}
            placeholder={`Message dans #${channel}...`}
            className="message-input"
          />
          <button type="submit" className="send-btn" disabled={!newMessage.trim() && !selectedImage}>
            <Send size={20} />
          </button>
        </div>
      </form>

      {showEmojiPicker && (
        <EmojiPicker 
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      {/* Modal pour afficher l'image en grand */}
      {showImageModal && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(null)}>
          <div className="image-modal-content">
            <button className="close-modal-btn" onClick={() => setShowImageModal(null)}>
              <X size={24} />
            </button>
            <img src={showImageModal} alt="Image agrandie" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
