import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { normalizeImageUrl } from '../config/api';
import { apiGet } from '../utils/api';
import './About.css';

const About = () => {
  const [aboutContent, setAboutContent] = useState(null);
  const [aboutFeatures, setAboutFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set static about content
        setAboutContent({
          id: 1,
          subtitle: 'Who We Are',
          title: 'Providing affordable and reliable energy',
          content: 'We are a leading energy company committed to delivering sustainable and innovative solutions. Our mission is to provide clean, reliable, and affordable energy while protecting our environment for future generations. With decades of experience in the energy sector, we continue to lead the transition towards a more sustainable future.',
          image_url: require('../images/about.jpg'),
          button_text: 'Learn More About Us'
        });
        
        // Set static about features
        setAboutFeatures([
          {
            id: 1,
            title: 'Clean energy for a bright future'
          },
          {
            id: 2,
            title: 'Sustainable development'
          },
          {
            id: 3,
            title: 'Improving access to energy'
          }
        ]);

      } catch (error) {
        console.error('Error setting static about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Only run once on mount

  if (loading) {
    return (
      <section id="about" className="about section">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="about elementor-component">
      <div className="container">
        <motion.div 
          className="about-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div 
            className="about-text"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div className="section-header" >
              <motion.span 
                className="section-subtitle"
              >
                {aboutContent?.subtitle || 'Who We Are'}
              </motion.span>
              <motion.h2 
                className="section-title"
              >
                {aboutContent?.title || 'Providing affordable and reliable energy'}
              </motion.h2>
            </motion.div>

            <motion.div className="about-description" >
              <p>{aboutContent?.content || ''}</p>
            </motion.div>

            <motion.div className="about-features" >
              <div className="feature-list">
                {Array.isArray(aboutFeatures) && aboutFeatures.length > 0 ? (
                  aboutFeatures.map((feature, index) => (
                    <motion.div 
                      key={feature.id} 
                      className="feature-item"
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="feature-icon">✓</div>
                      <span>{feature.title}</span>
                    </motion.div>
                  ))
                ) : null}
              </div>
            </motion.div>

            {aboutContent?.button_text && (
              <motion.div className="about-actions" >
                <button className="btn btn-primary">
                  {aboutContent.button_text} <i className="fas fa-arrow-right"></i>
                </button>
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            className="about-image"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="image-container">
              <div className="main-image">
                {aboutContent?.image_url && (
                  <img 
                    src={aboutContent.image_url} 
                    alt={aboutContent.title || 'About Us'}
                    className="about-main-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="play-button">
                  <div className="play-icon">▶</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
