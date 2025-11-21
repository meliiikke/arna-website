import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { apiGet, apiPost, normalizeImageUrl } from '../utils/api';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newsletterContent, setNewsletterContent] = useState({
    title: 'Newsletter',
    subtitle: '',
    description: 'Sign up our newsletter to get update news and article about company.',
    image_url: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewsletterContent = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching newsletter content...');
      const response = await apiGet('/api/newsletter/content');
      console.log('Newsletter response:', response);
      
      if (response && !response.error && response.title) {
        setNewsletterContent({
          title: response.title || 'Newsletter',
          subtitle: response.subtitle || '',
          description: response.description || 'Sign up our newsletter to get update news and article about company.',
          image_url: response.image_url ? normalizeImageUrl(response.image_url) : null
        });
      } else {
        // Use fallback content
        setNewsletterContent({
          title: 'Newsletter',
          subtitle: '',
          description: 'Sign up our newsletter to get update news and article about company.',
          image_url: null
        });
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching newsletter content:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsletterContent();
  }, [fetchNewsletterContent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      console.log('Subscribing to newsletter with email:', email);
      const response = await apiPost('/api/newsletter/subscribe', { email });
      console.log('Newsletter subscription response:', response);
      
      if (response && !response.error) {
        setIsSubscribed(true);
        setEmail('');
        console.log('Successfully subscribed to newsletter');
      } else {
        console.error('Newsletter subscription failed:', response?.error);
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="newsletter-section elementor-component animate-on-scroll">
        <div className="newsletter-content">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading newsletter...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="newsletter-section elementor-component animate-on-scroll">
      {newsletterContent.image_url && (
        <div className="newsletter-background">
          <img 
            src={newsletterContent.image_url} 
            alt="Newsletter Background" 
            className="newsletter-bg-image"
            loading="lazy"
            decoding="async"
          />
          <div className="newsletter-overlay"></div>
        </div>
      )}
      
      <div className="newsletter-content">
        <div className="newsletter-text">
          <h2 className="newsletter-title">{newsletterContent.title}</h2>
          {newsletterContent.subtitle && (
            <h3 className="newsletter-subtitle">{newsletterContent.subtitle}</h3>
          )}
          <p className="newsletter-description">
            {newsletterContent.description}
          </p>
        </div>
        
        {isSubscribed ? (
          <div className="newsletter-success">
            <p>Thank you for subscribing to our newsletter!</p>
          </div>
        ) : (
          <form 
            className="newsletter-form" 
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email your email"
              className="newsletter-input"
              required
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="newsletter-button"
              disabled={isLoading}
            >
              {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
