import React from 'react';
import './ReactionPicker.css';

const QUICK_REACTIONS = ['❤️', '👍', '😂', '😮', '😢', '🎉', '🔥', '👏'];

function ReactionPicker({ onReact, onClose }) {
  return (
    <div className="reaction-picker-popup">
      {QUICK_REACTIONS.map((emoji) => (
        <button
          key={emoji}
          className="reaction-option"
          onClick={() => {
            onReact(emoji);
            onClose();
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

export default ReactionPicker;
