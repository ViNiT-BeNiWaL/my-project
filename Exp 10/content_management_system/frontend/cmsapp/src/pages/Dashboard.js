// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { User, BarChart3, FileText, DollarSign } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [metrics, setMetrics] = useState({
    likes: 0,
    rating: null, 
    earnings: null,
    share: null,
    piePercent: null,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const res = await API.get('/dashboard-data');
        const { rating, earnings, share, piePercent, chart } = res.data;

        setMetrics((prev) => ({
          ...prev,
          rating,
          earnings,
          share,
          piePercent,
        }));

        setChartData(chart);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

const fetchUserPosts = async () => {
  try {
    const res = await API.get('/posts');
    console.log('User:', user);
    console.log('Fetched posts:', res.data);

    let filteredPosts = [];

    if (user?._id) {
      // Fix: use post.author instead of post.user
      filteredPosts = res.data.filter(post => post.author?._id === user._id);
    }

    // Optional fallback to username match if _id is missing
    if (filteredPosts.length === 0 && user?.username) {
      filteredPosts = res.data.filter(post => post.author?.username === user.username);
    }

    console.log('Filtered posts:', filteredPosts);
    setPosts(filteredPosts);

    // Calculate total likes
    const totalLikes = filteredPosts.reduce(
      (sum, post) => sum + (Array.isArray(post.likes) ? post.likes.length : 0),
      0
    );
    setMetrics(prev => ({ ...prev, likes: totalLikes }));
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
};




    fetchDashboardData();
    fetchUserPosts();
  }, [user]);

  const handleDeletePost = (deletedPostId) => {
    setPosts((prev) => {
      const updatedPosts = prev.filter(post => post._id !== deletedPostId);
      const totalLikes = updatedPosts.reduce(
        (sum, post) => sum + (Array.isArray(post.likes) ? post.likes.length : 0),
        0
      );

      setMetrics((prev) => ({
        ...prev,
        likes: totalLikes,
      }));

      return updatedPosts;
    });
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6"><h2>Please log in to see your dashboard.</h2></div>;

  const COLORS = ['#ffb74d', '#0d47a1'];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="dashboard-main"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.h1 className="dashboard-title" variants={cardVariants}>Welcome back, {user.username} 👋</motion.h1>

      {/* Metric Cards */}
      <motion.div className="dashboard-cards" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        <motion.div className="dashboard-card dark" variants={cardVariants}>
          <FileText className="icon" />
          <div>
            <p>Total Posts</p>
            <p className="value">{posts.length}</p>
          </div>
        </motion.div>
        <motion.div className="dashboard-card" variants={cardVariants}>
          <User className="icon blue" />
          <div>
            <p>Likes</p>
            <p className="value blue">{metrics.likes ?? '—'}</p>
          </div>
        </motion.div>
        <motion.div className="dashboard-card" variants={cardVariants}>
          <BarChart3 className="icon blue" />
          <div>
            <p>Rating</p>
            <p className="value blue">{metrics.rating ?? '—'}</p>
          </div>
        </motion.div>
        <motion.div className="dashboard-card" variants={cardVariants}>
          <DollarSign className="icon blue" />
          <div>
            <p>Earnings</p>
            <p className="value blue">{metrics.earnings ? `$${metrics.earnings}` : '—'}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Bar Chart */}
      <motion.div className="dashboard-chart" variants={cardVariants}>
        <h2>Engagement Overview</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="2019" fill={COLORS[0]} />
            <Bar dataKey="2020" fill={COLORS[1]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Line + Pie Charts */}
      <motion.div className="dashboard-row" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        <motion.div className="line-chart-container" variants={cardVariants}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="2019" stroke={COLORS[0]} strokeWidth={2} />
              <Line type="monotone" dataKey="2020" stroke={COLORS[1]} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="pie-chart-container" variants={cardVariants}>
          <PieChart width={200} height={200}>
            <Pie
              data={[
                { value: metrics.piePercent ?? 0 },
                { value: 100 - (metrics.piePercent ?? 0) }
              ]}
              cx="50%" cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
            >
              {COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
          </PieChart>
          <p className="pie-value">{metrics.piePercent ? `${metrics.piePercent}%` : '—'}</p>
          <p className="pie-label">Content completion rate</p>
        </motion.div>
      </motion.div>

      {/* Posts Section */}
      <motion.div className="posts-section" variants={cardVariants}>
        <h2>Your Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <motion.div className="posts-grid" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            {posts.map(post => (
              <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
