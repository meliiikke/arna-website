import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiGet } from '../utils/api';
import { normalizeImageUrl } from '../config/api';
import './LetsBeGreatTogether.css';

const LetsBeGreatTogether = () => {
  const [content, setContent] = useState(null);
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching lets be great together data...');
        
        // Fetch content from API
        const contentResponse = await apiGet('/api/lets-be-great/content');
        console.log('📥 Content response:', contentResponse);
        if (contentResponse && !contentResponse.error) {
          setContent(contentResponse);
          console.log('✅ Content set:', contentResponse);
        } else {
          console.log('⚠️ Content response has error or is null:', contentResponse);
          throw new Error('Content API failed');
        }
        
        // Fetch statistics from API
        const statisticsResponse = await apiGet('/api/lets-be-great/statistics');
        console.log('📊 Statistics response:', statisticsResponse);
        if (statisticsResponse && !statisticsResponse.error) {
          setStatistics(statisticsResponse);
          console.log('✅ Statistics set:', statisticsResponse);
        } else {
          console.log('⚠️ Statistics response has error or is null:', statisticsResponse);
          throw new Error('Statistics API failed');
        }
        
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching lets be great together data:', err);
        setError('Failed to load lets be great together data');
        
        // Fallback to static data if API fails
        console.log('🔄 Using fallback static data');
        setContent({
          id: 1,
          subtitle: 'LET\'S BE GREAT TOGETHER',
          title: 'Powerful solutions for a sustainable future',
          description: 'Join us in building a cleaner, more sustainable world. Together, we can create innovative energy solutions that power progress while protecting our planet for future generations.',
          button_text: 'DISCOVER MORE',
          button_link: '#contact',
          background_image_url: require('../images/arkaplan.jpg'),
          is_active: true
        });
        
        setStatistics([
          { id: 1, title: 'Refining Capacity', percentage: 75, display_order: 1, is_active: true },
          { id: 2, title: 'Crude Oil Prod', percentage: 87, display_order: 2, is_active: true },
          { id: 3, title: 'Satisfied Clients', percentage: 95, display_order: 3, is_active: true },
          { id: 4, title: 'Project Successful', percentage: 92, display_order: 4, is_active: true }
        ]);
        
        // Clear error since we have fallback data
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="lets-be-great" className="lets-be-great section">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading lets be great together section...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && !content) {
    return (
      <section id="lets-be-great" className="lets-be-great section">
        <div className="container">
          <div className="error-container">
            <p>Error loading lets be great together section: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Debug log to see if component is rendering
  console.log('🎯 LetsBeGreatTogether component rendered', { content, statistics, loading, error });
  console.log('🎯 Content details:', content);
  console.log('🎯 Statistics details:', statistics);
  console.log('🎯 Loading state:', loading);
  console.log('🎯 Error state:', error);

  return (
    <section id="lets-be-great" className="lets-be-great section">
      {/* Background Image */}
      {content?.background_image_url && (
        <div className="lets-be-great-bg">
          <img 
            src={normalizeImageUrl(content.background_image_url)} 
            alt="Lets Be Great Together Background"
            className="bg-image"
          />
          <div className="bg-overlay"></div>
        </div>
      )}

      <div className="container">
        <div className="lets-be-great-content">
          {/* Left Side - Text Content */}
          <motion.div 
            className="lets-be-great-text"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Subtitle */}
            <div className="lets-be-great-subtitle">
              <span className="subtitle-text">
                {content?.subtitle || 'LET\'S BE GREAT TOGETHER'}
              </span>
              <div className="subtitle-line"></div>
            </div>

            {/* Title */}
            <h2 className="lets-be-great-title">
              {content?.title || 'Powerful solutions for a sustainable future'}
            </h2>

            {/* Description */}
            <p className="lets-be-great-description">
              {content?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus.'}
            </p>

            {/* Button */}
            <motion.a 
              href={content?.button_link || '#contact'}
              className="lets-be-great-button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {content?.button_text || 'DISCOVER MORE'}
            </motion.a>
          </motion.div>

          {/* Right Side - Statistics */}
          <motion.div 
            className="lets-be-great-stats"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="stats-grid">
              {statistics.map((stat, index) => (
                <motion.div 
                  key={stat.id}
                  className="stat-circle"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                  viewport={{ once: true }}
                >
                  <div className="stat-circle-inner">
                    <div className="stat-percentage">
                      {stat.percentage}%
                    </div>
                    <div className="stat-title">
                      {stat.title}
                    </div>
                  </div>
                  <svg className="stat-circle-svg" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="var(--primary-gold, #d4af37)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 283" }}
                      whileInView={{ strokeDasharray: `${(stat.percentage * 283) / 100} 283` }}
                      transition={{ duration: 2, delay: 0.6 + (index * 0.2) }}
                      viewport={{ once: true }}
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                  </svg>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LetsBeGreatTogether;
