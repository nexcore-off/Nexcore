import React, { useState } from 'react';
import axios from 'axios';
import { Lock, Mail, User, LogIn, UserPlus } from 'lucide-react';
import './Login.css';

const API_URL = 'http://localhost:5000/api';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(`${API_URL}${endpoint}`, formData);

      if (response.data.privateKey) {
        localStorage.setItem('privateKey', response.data.privateKey);
      }

      onLogin(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🚀 SocialHub</h1>
          <p>Communication • Posts • Chiffrement</p>
        </div>

        <div className="login-tabs">
          <button 
            className={isLogin ? 'tab active' : 'tab'}
            onClick={() => setIsLogin(true)}
          >
            <LogIn size={18} />
            Connexion
          </button>
          <button 
            className={!isLogin ? 'tab active' : 'tab'}
            onClick={() => setIsLogin(false)}
          >
            <UserPlus size={18} />
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>
                <User size={18} />
                Nom d'utilisateur
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
                placeholder="johndoe"
              />
            </div>
          )}

          <div className="input-group">
            <label>
              <Mail size={18} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="email@example.com"
            />
          </div>

          <div className="input-group">
            <label>
              <Lock size={18} />
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
          </button>
        </form>

        <div className="features-list">
          <div className="feature">💬 Chat en temps réel</div>
          <div className="feature">📝 Partage de posts</div>
          <div className="feature">🔐 Messages chiffrés</div>
          <div className="feature">🎥 Médias vidéo</div>
        </div>
      </div>
    </div>
  );
}

export default Login;
