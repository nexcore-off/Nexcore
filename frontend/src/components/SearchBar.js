import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MessageSquare, FileText, User } from 'lucide-react';
import axios from 'axios';
import './SearchBar.css';

const API_URL = 'https://nexcore-backend.onrender.com/api';

function SearchBar({ onResultClick }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ messages: [], posts: [], users: [] });
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 0) {
        performSearch();
      } else {
        setResults({ messages: [], posts: [], users: [] });
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, activeFilter]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const params = { q: query };
      if (activeFilter !== 'all') {
        params.type = activeFilter;
      }
      
      const response = await axios.get(`${API_URL}/search`, { params });
      setResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Erreur recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (type, item) => {
    setShowResults(false);
    setQuery('');
    onResultClick(type, item);
  };

  const totalResults = 
    (results.messages?.length || 0) + 
    (results.posts?.length || 0) + 
    (results.users?.length || 0);

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher messages, posts, utilisateurs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery('')}>
            <X size={18} />
          </button>
        )}
      </div>

      {showResults && (
        <div className="search-results-dropdown">
          <div className="search-filters">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Tout ({totalResults})
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveFilter('messages')}
            >
              <MessageSquare size={14} /> Messages ({results.messages?.length || 0})
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveFilter('posts')}
            >
              <FileText size={14} /> Posts ({results.posts?.length || 0})
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'users' ? 'active' : ''}`}
              onClick={() => setActiveFilter('users')}
            >
              <User size={14} /> Utilisateurs ({results.users?.length || 0})
            </button>
          </div>

          <div className="search-results-list">
            {loading && <div className="search-loading">Recherche...</div>}

            {!loading && totalResults === 0 && (
              <div className="search-empty">
                Aucun résultat pour "{query}"
              </div>
            )}

            {/* Messages */}
            {!loading && (activeFilter === 'all' || activeFilter === 'messages') && results.messages?.length > 0 && (
              <div className="search-section">
                <div className="search-section-title">Messages</div>
                {results.messages.map((message) => (
                  <div 
                    key={message._id} 
                    className="search-result-item"
                    onClick={() => handleResultClick('message', message)}
                  >
                    <img 
                      src={message.sender?.avatar || 'https://ui-avatars.com/api/?name=User'} 
                      alt={message.sender?.username}
                      className="result-avatar"
                    />
                    <div className="result-content">
                      <div className="result-title">{message.sender?.username}</div>
                      <div className="result-text">{message.content}</div>
                      <div className="result-meta">
                        #{message.channel} • {new Date(message.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Posts */}
            {!loading && (activeFilter === 'all' || activeFilter === 'posts') && results.posts?.length > 0 && (
              <div className="search-section">
                <div className="search-section-title">Posts</div>
                {results.posts.map((post) => (
                  <div 
                    key={post._id} 
                    className="search-result-item"
                    onClick={() => handleResultClick('post', post)}
                  >
                    <img 
                      src={post.author?.avatar || 'https://ui-avatars.com/api/?name=User'} 
                      alt={post.author?.username}
                      className="result-avatar"
                    />
                    <div className="result-content">
                      <div className="result-title">{post.title}</div>
                      <div className="result-text">{post.content}</div>
                      <div className="result-meta">
                        Par {post.author?.username} • {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Users */}
            {!loading && (activeFilter === 'all' || activeFilter === 'users') && results.users?.length > 0 && (
              <div className="search-section">
                <div className="search-section-title">Utilisateurs</div>
                {results.users.map((user) => (
                  <div 
                    key={user._id} 
                    className="search-result-item"
                    onClick={() => handleResultClick('user', user)}
                  >
                    <img 
                      src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.username} 
                      alt={user.username}
                      className="result-avatar"
                    />
                    <div className="result-content">
                      <div className="result-title">{user.username}</div>
                      {user.bio && <div className="result-text">{user.bio}</div>}
                      <div className="result-meta">
                        Membre depuis {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
