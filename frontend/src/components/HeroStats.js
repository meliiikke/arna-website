import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiGet } from '../utils/api';
import { normalizeImageUrl } from '../config/api';
import './HeroStats.css';

const HeroStats = () => {
  const [content, setContent] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching hero stats data...');
        
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
          setStats(statisticsResponse);
          console.log('✅ Statistics set:', statisticsResponse);
        } else {
          console.log('⚠️ Statistics response has error or is null:', statisticsResponse);
          throw new Error('Statistics API failed');
        }
        
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching hero stats data:', err);
        setError('Failed to load hero stats data');
        
        // Fallback to static data if API fails
        console.log('🔄 Using fallback static data');
        setContent({
          id: 1,
          subtitle: 'LET\'S BE GREAT TOGETHER',
          title: 'Powerful solutions for a sustainable future',
          description: 'Join us in building a cleaner, more sustainable world. Together, we can create innovative energy solutions that power progress while protecting our planet for future generations.',
          button_text: 'DISCOVER MORE',
          button_link: '#contact',
          background_image_url: require('../images/ccc.jpg'),
          is_active: true
        });
        
        setStats([
          { id: 1, title: 'Refining Capacity', percentage: 75, display_order: 1, is_active: true },
          { id: 2, title: 'Crude Oil Prod', percentage: 87, display_order: 2, is_active: true },
          { id: 3, title: 'Satisfied Clients', percentage: 95, display_order: 3, is_active: true },
          { id: 4, title: 'Project Successful', percentage: 92, display_order: 4, is_active: true }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="hero-stats elementor-component">
        <div className="hero-stats-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading hero stats...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && !content) {
    return (
      <section className="hero-stats elementor-component">
        <div className="hero-stats-content">
          <div className="error-container">
            <p>Error loading hero stats: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-stats elementor-component animate-on-scroll">
      <div className="hero-stats-background">
        <img
          src={content?.background_image_url ? normalizeImageUrl(content.background_image_url) : require('../images/ccc.jpg')}
          alt="Industrial Background"
          className="hero-bg-image"
        />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-stats-content">
        <div className="hero-stats-layout">
          {/* Left Side - Text and Button */}
          <motion.div 
            className="hero-stats-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div
              className="hero-text-content"
            >
              <div className="hero-subtitle">{content?.subtitle || 'Let\'s Be Great Together'}</div>
              <h1 className="hero-title">{content?.title || 'Powerful solutions for a sustainable future'}</h1>
              <p className="hero-description">
                {content?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus.'}
              </p>
              <a
                href={content?.button_link || '#contact'}
                className="hero-cta-button"
              >
                {content?.button_text || 'DISCOVER MORE'}
              </a>
            </div>
          </motion.div>

          {/* Right Side - Circular Progress Indicators */}
          <motion.div 
            className="hero-stats-right"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id || index}
                  className="stats-item1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className="stats-circular-progress1">
                    <svg className="stats-progress-ring1" viewBox="0 0 120 120" width="100" height="100">
                      <circle
                        className="stats-progress-ring-circle-bg1"
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="3"
                        fill="transparent"
                        r="45"
                        cx="60"
                        cy="60"
                      />
                      <motion.circle
                        className="stats-progress-ring-circle1"
                        stroke="var(--primary-gold)"
                        strokeWidth="3"
                        fill="transparent"
                        r="45"
                        cx="60"
                        cy="60"
                        strokeDasharray="282.74"
                        initial={{ strokeDashoffset: 282.74 }}
                        whileInView={{ strokeDashoffset: 282.74 * (1 - stat.percentage / 100) }}
                        transition={{ duration: 2, delay: index * 0.2, ease: "easeInOut" }}
                        viewport={{ once: true, amount: 0.3 }}
                      />
                    </svg>
                    <div className="stats-progress-percentage1">
                      {stat.percentage}%
                    </div>
                  </div>
                  <div className="stats-info1">
                    <h3 className="stats-title1">{stat.title}</h3>
                    <p className="stats-description1">{stat.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroStats;
