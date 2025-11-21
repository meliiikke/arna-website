import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { apiGet, normalizeImageUrl } from '../utils/api';
import './ValueSection.css';

const ValueSection = () => {
  const [valueContent, setValueContent] = useState({
    subtitle: 'OUR VALUE',
    title: 'Promoting responsible use of petroleum resources',
    description: 'Habitant mollis mauris natoque justo hac nibh convallis fermentum integer turpis quisque. Adipiscing vulputate malesuada commodo nisl massa vestibulum habitant mus in elementum. Venenatis aptent sodales dapibus justo nam interdum neque.',
    image_url: null
  });
  const [valueItems, setValueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchValueData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use Promise.all to fetch both APIs simultaneously for better performance
      const [contentResponse, statisticsResponse] = await Promise.all([
        apiGet('/api/value-section/content'),
        apiGet('/api/value-section/statistics')
      ]);
      
      // Process value content
      if (contentResponse && !contentResponse.error) {
        const normalizedImageUrl = contentResponse.image_url ? normalizeImageUrl(contentResponse.image_url) : null;
        console.log('Value Section Image Debug:', {
          original: contentResponse.image_url,
          normalized: normalizedImageUrl
        });
        
        setValueContent({
          subtitle: contentResponse.subtitle || 'OUR VALUE',
          title: contentResponse.title || 'Promoting responsible use of petroleum resources',
          description: contentResponse.description || 'Habitant mollis mauris natoque justo hac nibh convallis fermentum integer turpis quisque. Adipiscing vulputate malesuada commodo nisl massa vestibulum habitant mus in elementum. Venenatis aptent sodales dapibus justo nam interdum neque.',
          image_url: normalizedImageUrl
        });
      }
      
      // Process value statistics
      if (statisticsResponse && !statisticsResponse.error && Array.isArray(statisticsResponse) && statisticsResponse.length > 0) {
        setValueItems(statisticsResponse);
      } else {
        // Use fallback data
        setValueItems([
          { id: 1, title: 'Cleaner', percentage: 90, display_order: 1, is_active: true },
          { id: 2, title: 'Stronger', percentage: 75, display_order: 2, is_active: true },
          { id: 3, title: 'Better', percentage: 82, display_order: 3, is_active: true }
        ]);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching value section data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchValueData();
  }, [fetchValueData]);

  // Memoize filtered and sorted value items for better performance
  const processedValueItems = useMemo(() => {
    if (!valueItems || valueItems.length === 0) return [];
    
    return valueItems
      .filter(item => item.is_active)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }, [valueItems]);

  if (loading) {
    return (
      <section className="value-section animate-on-scroll">
        <div className="value-container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading value section...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="value-section animate-on-scroll">
      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}
      
      
      <div className="value-container">
        <div className="value-layout">
          {/* Left Side - Images */}
          <div className="value-left">
            <div className="value-images">
              <div className="main-image">
                <img
                  src={valueContent.image_url || require('../images/aaa.jpg')}
                  alt="Value Section"
                  className="main-image-img"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.src = require('../images/aaa.jpg');
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Side - Text and Progress Bars */}
          <div className="value-right">
            <div className="value-content">
              <div className="value-subtitle">{valueContent.subtitle}</div>
              <h2 className="value-title">{valueContent.title}</h2>
              <p className="value-description">
                {valueContent.description}
              </p>
              
              <div className="value-progress">
                {processedValueItems && processedValueItems.length > 0 ? (
                  processedValueItems.map((item, index) => (
                    <motion.div
                      key={item.id || item.title || index}
                      className="progress-item"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      <div className="progress-label">{item.title}</div>
                      <div className="progress-bar-container">
                        <motion.div
                          className="progress-bar"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1.5, delay: 0.3 + (index * 0.2), ease: "easeInOut" }}
                          viewport={{ once: true, amount: 0.3 }}
                        >
                          <motion.div 
                            className="progress-dot"
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 1.8 + (index * 0.2) }}
                            viewport={{ once: true, amount: 0.3 }}
                          ></motion.div>
                        </motion.div>
                      </div>
                      <div className="progress-percentage">
                        {item.percentage}%
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    <p>No statistics available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueSection;
