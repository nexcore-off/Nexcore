import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, MessageCircle, Share2, PlusCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import AdBanner from './AdBanner';
import { shouldShowAds } from '../config/monetization';
import './Feed.css';

const API_URL = 'http://localhost:5000/api';

function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    mediaType: 'none',
    mediaUrl: '',
    tags: ''
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Erreur chargement posts:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        ...newPost,
        author: user.id,
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await axios.post(`${API_URL}/posts`, postData);
      setNewPost({ title: '', content: '', mediaType: 'none', mediaUrl: '', tags: '' });
      setShowCreatePost(false);
      loadPosts();
    } catch (error) {
      console.error('Erreur création post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`${API_URL}/posts/${postId}/like`, { userId: user.id });
      loadPosts();
    } catch (error) {
      console.error('Erreur like:', error);
    }
  };

  const handleComment = async (postId, text) => {
    if (!text.trim()) return;
    try {
      await axios.post(`${API_URL}/posts/${postId}/comment`, { 
        userId: user.id, 
        text 
      });
      loadPosts();
    } catch (error) {
      console.error('Erreur commentaire:', error);
    }
  };

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h2>📝 Feed</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreatePost(!showCreatePost)}
        >
          <PlusCircle size={18} />
          Créer un post
        </button>
      </div>

      {showCreatePost && (
        <div className="create-post-card">
          <h3>Nouveau Post</h3>
          <form onSubmit={handleCreatePost}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Titre du post..."
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <textarea
                placeholder="Contenu de votre post..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                required
                rows="4"
              />
            </div>
            <div className="input-group">
              <select 
                value={newPost.mediaType}
                onChange={(e) => setNewPost({ ...newPost, mediaType: e.target.value })}
              >
                <option value="none">Sans média</option>
                <option value="image">Image</option>
                <option value="video">Vidéo</option>
              </select>
            </div>
            {newPost.mediaType !== 'none' && (
              <div className="input-group">
                <input
                  type="text"
                  placeholder="URL du média..."
                  value={newPost.mediaUrl}
                  onChange={(e) => setNewPost({ ...newPost, mediaUrl: e.target.value })}
                />
              </div>
            )}
            <div className="input-group">
              <input
                type="text"
                placeholder="Tags (séparés par des virgules)..."
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Publier
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowCreatePost(false)}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="posts-grid">
        {posts.map((post, index) => (
          <React.Fragment key={post._id}>
            <PostCard 
              post={post} 
              onLike={handleLike}
              onComment={handleComment}
              currentUser={user}
            />
            {/* Afficher une publicité tous les 3 posts */}
            {shouldShowAds(user) && (index + 1) % 3 === 0 && index !== posts.length - 1 && (
              <AdBanner slot="FEED_BANNER" format="auto" />
            )}
          </React.Fragment>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="empty-state">
          <p>Aucun post pour le moment. Soyez le premier à publier !</p>
        </div>
      )}
    </div>
  );
}

function PostCard({ post, onLike, onComment, currentUser }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = () => {
    onComment(post._id, commentText);
    setCommentText('');
  };

  const isLiked = post.likes?.includes(currentUser.id);

  return (
    <div className="post-card">
      <div className="post-header">
        <img 
          src={post.author?.avatar || 'https://ui-avatars.com/api/?name=User'} 
          alt={post.author?.username}
          className="post-avatar"
        />
        <div>
          <div className="post-author">{post.author?.username || 'Utilisateur'}</div>
          <div className="post-time">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: fr })}
          </div>
        </div>
      </div>

      <h3 className="post-title">{post.title}</h3>
      <p className="post-content">{post.content}</p>

      {post.mediaType === 'image' && post.mediaUrl && (
        <div className="post-media">
          <img src={post.mediaUrl} alt="Post media" className="media-image" />
        </div>
      )}

      {post.mediaType === 'video' && post.mediaUrl && (
        <div className="post-media">
          <video controls className="media-video">
            <source src={post.mediaUrl} />
          </video>
        </div>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map((tag, index) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="post-actions">
        <button 
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => onLike(post._id)}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          {post.likes?.length || 0}
        </button>
        <button 
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={18} />
          {post.comments?.length || 0}
        </button>
        <button className="action-btn">
          <Share2 size={18} />
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {post.comments?.map((comment, index) => (
            <div key={index} className="comment">
              <img 
                src={comment.user?.avatar || 'https://ui-avatars.com/api/?name=User'} 
                alt={comment.user?.username}
                className="comment-avatar"
              />
              <div className="comment-content">
                <span className="comment-author">{comment.user?.username}</span>
                <p>{comment.text}</p>
              </div>
            </div>
          ))}
          <div className="comment-input">
            <input
              type="text"
              placeholder="Ajouter un commentaire..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
            />
            <button onClick={handleSubmitComment}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feed;
