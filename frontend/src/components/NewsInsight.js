import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiGet, normalizeImageUrl } from '../utils/api';
import './NewsInsight.css';

const NewsInsight = () => {
  const navigate = useNavigate();
  const [newsContent, setNewsContent] = useState({
    title: 'News & Insight',
    subtitle: 'Venenatis inceptos molestie consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.'
  });
  const [featuredArticle, setFeaturedArticle] = useState({
    title: 'Changing crude flows are creating opportunities in the US Gulf Coast',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
    image_url: require('../images/aaa.jpg'),
    article_tag: 'CRUDE FLOWS',
    article_date: 'July 10, 2025',
    comments_count: 0
  });
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewsData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching news insight data...');

      // Use Promise.all to fetch both APIs simultaneously for better performance
      const [contentResponse, articlesResponse] = await Promise.all([
        apiGet('/api/news-insight/content'),
        apiGet('/api/news-insight/articles')
      ]);

      console.log('📥 News content response:', contentResponse);
      console.log('📰 News articles response:', articlesResponse);

      // Process content response
      if (contentResponse && !contentResponse.error && contentResponse.title) {
        setNewsContent({
          title: contentResponse.title || 'News & Insight',
          subtitle: contentResponse.subtitle || 'Venenatis inceptos molestie consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.'
        });
        console.log('✅ News content set:', contentResponse);
      } else {
        console.log('⚠️ News content response has error or is null:', contentResponse);
        throw new Error('News content API failed');
      }

      // Process articles response
      if (articlesResponse && !articlesResponse.error && Array.isArray(articlesResponse) && articlesResponse.length > 0) {
        // Set first article as featured
        setFeaturedArticle(articlesResponse[0]);
        // Set remaining articles as news list
        setNewsArticles(articlesResponse.slice(1));
        console.log('✅ News articles set:', articlesResponse);
      } else {
        console.log('⚠️ News articles response has error or is null:', articlesResponse);
        throw new Error('News articles API failed');
      }

      setError(null);
    } catch (err) {
      console.error('❌ Error fetching news data:', err);
      setError('Failed to load news data');

      // Fallback to static data if API fails
      console.log('🔄 Using fallback static data');
      setNewsContent({
        title: 'News & Insight',
        subtitle: 'Venenatis inceptos molestie consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.'
      });

      setFeaturedArticle({
        id: 1,
        title: 'Changing crude flows are creating opportunities in the US Gulf Coast',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
        image_url: require('../images/aaa.jpg'),
        article_tag: 'CRUDE FLOWS',
        article_date: 'July 10, 2025',
        comments_count: 0,
        button_text: 'READ MORE',
        button_link: '#article1',
        display_order: 1,
        is_active: true
      });

      setNewsArticles([
        {
          id: 2,
          title: 'Ethanol and corn markets: Impact from the E15 gasoline waiver',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          image_url: require('../images/bbb.jpg'),
          article_date: 'July 10, 2025',
          comments_count: 0,
          button_text: 'READ MORE',
          button_link: '#article2',
          display_order: 2,
          is_active: true
        },
        {
          id: 3,
          title: 'Ending the zero-sum game in offshore drilling',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          image_url: require('../images/ccc.jpg'),
          article_date: 'July 10, 2025',
          comments_count: 0,
          button_text: 'READ MORE',
          button_link: '#article3',
          display_order: 3,
          is_active: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsData();
  }, [fetchNewsData]);

  // Memoize filtered and sorted articles for better performance
  const processedArticles = useMemo(() => {
    if (!newsArticles || newsArticles.length === 0) return [];
    
    return newsArticles
      .filter(article => article.is_active)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }, [newsArticles]);

  if (loading) {
    return (
      <section className="news-insight-section elementor-component animate-on-scroll">
        <div className="news-insight-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading news section...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && !newsContent.title) {
    return (
      <section className="news-insight-section elementor-component animate-on-scroll">
        <div className="news-insight-container">
          <div className="error-container">
            <p>Error loading news section: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="news-insight-section elementor-component animate-on-scroll">
      <div className="news-insight-container">
        <div className="news-insight-layout">
          {/* Left Column - Featured Article */}
          <div className="news-left">
            <div
              className="featured-article"
              onClick={() => navigate(`/news-insight-detail/${featuredArticle.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="featured-image">
                <img
                  src={featuredArticle.image_url ? normalizeImageUrl(featuredArticle.image_url) : require('../images/aaa.jpg')}
                  alt={featuredArticle.title}
                  className="featured-photo"
                  loading="lazy"
                  decoding="async"
                />
                <div className="article-tag">
                  {featuredArticle.article_tag}
                </div>
              </div>
              <div className="featured-content">
                <h2 className="featured-title">{featuredArticle.title}</h2>
                <p className="featured-description">{featuredArticle.description}</p>
                <div className="featured-meta">
                  <span className="article-date">{featuredArticle.article_date}</span>
                  <span className="article-comments">{featuredArticle.comments_count} Comments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - News & Insight List */}
          <div className="news-right">
            <div className="news-list">
              <div className="news-header">
                <h2 className="news-title">{newsContent.title}</h2>
                <p className="news-intro">
                  {newsContent.subtitle}
                </p>
              </div>
              
              <div className="articles-list">
                {processedArticles && processedArticles.length > 0 ? (
                  processedArticles.map((article, index) => (
                    <div
                      key={article.id || index}
                      className="article-item"
                      onClick={() => window.location.href = `/news-insight-detail/${article.id}`}
                    >
                      <div className="article-thumbnail">
                        <img
                          src={article.image_url ? normalizeImageUrl(article.image_url) : require('../images/aaa.jpg')}
                          alt={article.title}
                          className="thumbnail-photo"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="article-info">
                        <h3 className="article-title">{article.title}</h3>
                        <div className="article-meta">
                          <span className="article-date">{article.article_date}</span>
                          <span className="article-comments">{article.comments_count} Comments</span>
                        </div>
                        <p className="article-description">{article.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    <p>No articles available</p>
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

export default NewsInsight;
