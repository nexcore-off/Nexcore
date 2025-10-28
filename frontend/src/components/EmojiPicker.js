import React, { useState } from 'react';
import { X } from 'lucide-react';
import './EmojiPicker.css';

const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
  'Gestes': ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝'],
  'Émotions': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️'],
  'Animaux': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉'],
  'Nature': ['🌸', '💮', '🏵', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍'],
  'Nourriture': ['🍕', '🍔', '🍟', '🌭', '🍿', '🧈', '🧂', '🥓', '🥚', '🍳', '🧇', '🥞', '🧈', '🍞', '🥐', '🥨', '🥯', '🥖', '🧀', '🥗', '🥙', '🥪', '🌮', '🌯', '🫔', '🥫', '🍝', '🍜'],
  'Activités': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼'],
  'Objets': ['💻', '🖥', '⌨️', '🖱', '🖲', '💽', '💾', '💿', '📀', '🧮', '📱', '📲', '☎️', '📞', '📟', '📠', '📺', '📻', '🎙', '🎚', '🎛', '🧭', '⏱', '⏲', '⏰', '🕰', '⏳', '⌛', '📡'],
  'Symboles': ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜', '◼️', '◻️', '◾', '◽', '▪️', '▫️', '🔶', '🔷', '🔸', '🔹', '🔺']
};

function EmojiPicker({ onEmojiSelect, onClose }) {
  const [activeCategory, setActiveCategory] = useState('Smileys');

  return (
    <div className="emoji-picker-overlay" onClick={onClose}>
      <div className="emoji-picker" onClick={(e) => e.stopPropagation()}>
        <div className="emoji-picker-header">
          <h3>Choisir un emoji</h3>
          <X size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>
        
        <div className="emoji-categories">
          {Object.keys(EMOJI_CATEGORIES).map((category) => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="emoji-grid">
          {EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
            <button
              key={index}
              className="emoji-btn"
              onClick={() => {
                onEmojiSelect(emoji);
                onClose();
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmojiPicker;
