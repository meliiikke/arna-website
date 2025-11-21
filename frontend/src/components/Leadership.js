import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { apiGet, normalizeImageUrl } from '../utils/api';
import './Leadership.css';

const Leadership = () => {
  const [leadershipContent, setLeadershipContent] = useState({
    subtitle: 'Meet Our Leadership',
    title: 'We talk a lot about hope helping and teamwork.',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
    button_text: 'DISCOVER MORE',
    button_link: '#contact',
    background_image_url: null
  });
  const [teamMembers, setTeamMembers] = useState([
    {
      name: 'Jason Ramos',
      position: 'Managing Director',
      image_url: require('../images/ekip.png')
    },
    {
      name: 'Charles Bernardi',
      position: 'Head of Operation',
      image_url: require('../images/ekip.png')
    },
    {
      name: 'Corrie Deegan',
      position: 'Customer Relation',
      image_url: require('../images/ekip.png')
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeadershipData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching leadership data...');

      // Use Promise.all to fetch both APIs simultaneously for better performance
      const [contentResponse, membersResponse] = await Promise.all([
        apiGet('/api/leadership/content'),
        apiGet('/api/leadership/members')
      ]);

      console.log('📥 Leadership content response:', contentResponse);
      console.log('👥 Leadership members response:', membersResponse);

      // Process content response
      if (contentResponse && !contentResponse.error && contentResponse.title) {
        setLeadershipContent({
          subtitle: contentResponse.subtitle || 'Meet Our Leadership',
          title: contentResponse.title || 'We talk a lot about hope helping and teamwork.',
          description: contentResponse.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
          button_text: contentResponse.button_text || 'DISCOVER MORE',
          button_link: contentResponse.button_link || '#contact',
          background_image_url: contentResponse.background_image_url ? normalizeImageUrl(contentResponse.background_image_url) : null
        });
        console.log('✅ Leadership content set:', contentResponse);
      } else {
        console.log('⚠️ Leadership content response has error or is null:', contentResponse);
        throw new Error('Leadership content API failed');
      }

      // Process members response
      if (membersResponse && !membersResponse.error && Array.isArray(membersResponse) && membersResponse.length > 0) {
        setTeamMembers(membersResponse);
        console.log('✅ Leadership members set:', membersResponse);
      } else {
        console.log('⚠️ Leadership members response has error or is null:', membersResponse);
        throw new Error('Leadership members API failed');
      }

      setError(null);
    } catch (err) {
      console.error('❌ Error fetching leadership data:', err);
      setError('Failed to load leadership data');

      // Fallback to static data if API fails
      console.log('🔄 Using fallback static data');
      setLeadershipContent({
        subtitle: 'Meet Our Leadership',
        title: 'We talk a lot about hope helping and teamwork.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
        button_text: 'DISCOVER MORE',
        button_link: '#contact',
        background_image_url: null
      });

      setTeamMembers([
        {
          id: 1,
          name: 'Jason Ramos',
          position: 'Managing Director',
          image_url: require('../images/ekip.png'),
          bio: 'Experienced leader with 15+ years in energy sector',
          linkedin_url: null,
          twitter_url: null,
          facebook_url: null,
          instagram_url: null,
          display_order: 1,
          is_active: true
        },
        {
          id: 2,
          name: 'Charles Bernardi',
          position: 'Head of Operation',
          image_url: require('../images/ekip.png'),
          bio: 'Operations expert focused on efficiency and sustainability',
          linkedin_url: null,
          twitter_url: null,
          facebook_url: null,
          instagram_url: null,
          display_order: 2,
          is_active: true
        },
        {
          id: 3,
          name: 'Corrie Deegan',
          position: 'Customer Relation',
          image_url: require('../images/ekip.png'),
          bio: 'Customer success specialist with passion for service',
          linkedin_url: null,
          twitter_url: null,
          facebook_url: null,
          instagram_url: null,
          display_order: 3,
          is_active: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeadershipData();
  }, [fetchLeadershipData]);

  // Memoize filtered and sorted team members for better performance
  const processedTeamMembers = useMemo(() => {
    if (!teamMembers || teamMembers.length === 0) return [];
    
    return teamMembers
      .filter(member => member.is_active)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }, [teamMembers]);

  if (loading) {
    return (
      <section className="leadership-section elementor-component">
        <div className="leadership-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading leadership section...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && !leadershipContent.title) {
    return (
      <section className="leadership-section elementor-component">
        <div className="leadership-container">
          <div className="error-container">
            <p>Error loading leadership section: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="leadership-section elementor-component animate-on-scroll">
      <div className="leadership-container">
        <div className="leadership-layout">
          {/* Left Side - Text Content */}
          <div className="leadership-left">
            <div className="leadership-content">
              <span className="leadership-subtitle">{leadershipContent.subtitle}</span>
              <h2 className="leadership-title">{leadershipContent.title}</h2>
              <p className="leadership-description">
                {leadershipContent.description}
              </p>
              <button
                className="leadership-cta-button"
                onClick={() => window.location.href = leadershipContent.button_link}
              >
                {leadershipContent.button_text}
              </button>
            </div>
          </div>

          {/* Right Side - Team Members Grid */}
          <div className="leadership-right">
            <div className="team-grid">
              {processedTeamMembers && processedTeamMembers.length > 0 ? (
                processedTeamMembers.map((member, index) => (
                  <div
                    key={member.id || index}
                    className="team-member-card"
                  >
                    <div className="member-image">
                      <img
                        src={member.image_url ? normalizeImageUrl(member.image_url) : require('../images/ekip.png')}
                        alt={member.name}
                        className="member-photo"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="member-info">
                      <h3 className="member-name">{member.name}</h3>
                      <p className="member-title">{member.position}</p>
                      <div className="member-social">
                        {member.facebook_url && (
                          <a href={member.facebook_url} target="_blank" rel="noopener noreferrer" className="social-btn">
                            <FaFacebookF />
                          </a>
                        )}
                        {member.twitter_url && (
                          <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="social-btn">
                            <FaTwitter />
                          </a>
                        )}
                        {member.linkedin_url && (
                          <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-btn">
                            <FaLinkedinIn />
                          </a>
                        )}
                        {member.instagram_url && (
                          <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="social-btn">
                            <FaInstagram />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  <p>No team members available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leadership;
