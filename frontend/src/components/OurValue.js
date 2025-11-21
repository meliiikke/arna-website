import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiGet } from '../utils/api';
import { normalizeImageUrl } from '../config/api';
import './OurValue.css';

const OurValue = () => {
  const [valueContent, setValueContent] = useState(null);
  const [valueStatistics, setValueStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Set static value content with image from images folder
        setValueContent({
          id: 1,
          subtitle: 'OUR VALUE',
          title: 'Promoting responsible use of petroleum resources',
          description: 'We are committed to sustainable energy practices that balance economic growth with environmental responsibility. Our innovative approaches ensure efficient resource utilization while minimizing environmental impact for future generations.',
          image_url: require('../images/mission.jpg'),
          is_active: true
        });
        
        // Set static value statistics
        setValueStatistics([
          { id: 1, title: 'Cleaner', percentage: 90, display_order: 1, is_active: true },
          { id: 2, title: 'Stronger', percentage: 75, display_order: 2, is_active: true },
          { id: 3, title: 'Better', percentage: 82, display_order: 3, is_active: true }
        ]);
        
        setError(null);
      } catch (err) {
        console.error('Error setting static value section data:', err);
        setError('Failed to load value section data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="our-value" className="our-value section">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading value section...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && !valueContent) {
    return (
      <section id="our-value" className="our-value section">
        <div className="container">
          <div className="error-container">
            <p>Error loading value section: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="our-value" className="our-value section">
      <div className="container">
        <div className="our-value-content">
          {/* Left Side - Image */}
          <motion.div 
            className="our-value-image"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {valueContent?.image_url && (
              <img 
                src={normalizeImageUrl(valueContent.image_url)} 
                alt={valueContent.title || 'Our Value'}
                className="value-image"
              />
            )}
          </motion.div>

          {/* Right Side - Content */}
          <motion.div 
            className="our-value-text"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Header */}
            <div className="value-header">
              <span className="value-subtitle">
                {valueContent?.subtitle || 'OUR VALUE'}
              </span>
            </div>

            {/* Title */}
            <h2 className="value-title">
              {valueContent?.title || 'Promoting responsible use of petroleum resources'}
            </h2>

            {/* Description */}
            <p className="value-description">
              {valueContent?.description || 'Habitant mollis mauris natoque justo hac nibh convallis fermentum integer turpis quisque. Adipiscing vulputate malesuada commodo nisl massa vestibulum habitant mus in elementum. Venenatis aptent sodales dapibus justo nam interdum neque.'}
            </p>

            {/* Statistics */}
            <div className="value-statistics">
              {valueStatistics && valueStatistics.length > 0 ? valueStatistics.map((stat, index) => (
                <motion.div 
                  key={stat.id}
                  className="stat-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                  viewport={{ once: true }}
                >
                  <div className="stat-header">
                    <span className="stat-title">{stat.title}</span>
                    <span className="stat-percentage">{stat.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div 
                      className="progress-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stat.percentage}%` }}
                      transition={{ duration: 1.5, delay: 0.6 + (index * 0.2) }}
                      viewport={{ once: true }}
                    />
                  </div>
                </motion.div>
              )) : (
                <div className="no-data">No statistics available</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurValue;
