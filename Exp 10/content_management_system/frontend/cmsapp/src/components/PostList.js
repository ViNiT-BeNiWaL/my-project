import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from './PostCard';
import { useAuth } from '../context/AuthContext';
import './PostList.css';

export default function PostList({ onEdit }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/posts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const userPosts = res.data.filter(post => post.author === user?.username);
        setPosts(userPosts);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [user]);

  async function handleDelete(id) {
    try {
      await axios.delete(`/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="post-list-container">
      <h2 className="post-list-heading">Your Posts</h2>
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="no-posts-message">No posts yet. Start by creating one!</p>
      ) : (
        <motion.div
          className="post-list"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {posts.map(post => (
              <motion.div key={post._id} exit={{ opacity: 0, y: -20 }}>
                <PostCard
                  post={post}
                  onEdit={() => onEdit(post)}
                  onDelete={() => handleDelete(post._id)}
                  currentUser={user}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
