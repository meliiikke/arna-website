import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { apiGet, normalizeImageUrl } from '../utils/api';
import { containerVariants, itemVariants, viewportSettings } from '../utils/animations';
import './OurProducts.css';

const OurProducts = () => {
  const [content, setContent] = useState({
    title: 'Ürünlerimiz',
    subtitle: 'Ürün kategorilerimizi tıklayarak tüm ürünleri detaylı görebilirsiniz',
    products: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOurProducts = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching our products...');
      const response = await apiGet('/api/our-products/content');
      console.log('Our products response:', response);
      
      if (response && !response.error) {
        setContent({
          title: response.title || 'Ürünlerimiz',
          subtitle: response.subtitle || 'Ürün kategorilerimizi tıklayarak tüm ürünleri detaylı görebilirsiniz',
          products: response.products || []
        });
      } else {
        // Fallback data
        setContent({
          title: 'Ürünlerimiz',
          subtitle: 'Ürün kategorilerimizi tıklayarak tüm ürünleri detaylı görebilirsiniz',
          products: [
          {
            id: 1,
            title: 'Tahıl Ürünleri',
            description: 'Yüksek kaliteli tahıl ürünleri ve hububat çeşitleri',
            icon_url: null
          },
          {
            id: 2,
            title: 'Bitkisel Yağlar',
            description: 'Doğal ve organik bitkisel yağ çeşitleri',
            icon_url: null
          },
          {
            id: 3,
            title: 'Metalik Madenler',
            description: 'Endüstriyel metalik maden ürünleri',
            icon_url: null
          },
          {
            id: 4,
            title: 'Mermer',
            description: 'Doğal mermer ve taş ürünleri',
            icon_url: null
          },
          {
            id: 5,
            title: 'Meyve',
            description: 'Taze ve kaliteli meyve çeşitleri',
            icon_url: null
          },
          {
            id: 6,
            title: 'Sebze',
            description: 'Organik ve taze sebze ürünleri',
            icon_url: null
          },
          {
            id: 7,
            title: 'Değerli Madenler',
            description: 'Altın, gümüş ve değerli maden ürünleri',
            icon_url: null
          },
          {
            id: 8,
            title: 'Petrol Ürünleri',
            description: 'Rafine edilmiş petrol ve yakıt ürünleri',
            icon_url: null
          },
          {
            id: 9,
            title: 'Ayakkabı',
            description: 'Kaliteli ayakkabı ve deri ürünleri',
            icon_url: null
          },
          {
            id: 10,
            title: 'Tekstil',
            description: 'Pamuk, yün ve tekstil ürünleri',
            icon_url: null
          }
          ]
        });
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching our products:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOurProducts();
  }, [fetchOurProducts]);

  // Memoize products for better performance
  const memoizedProducts = useMemo(() => {
    return content.products || [];
  }, [content.products]);

  // Ürün detay sayfasına yönlendirme
  const goToProductDetail = (product) => {
    navigate(`/product/${product.id}`);
  };

  if (loading) {
  return (
    <section className="our-products-section elementor-component">
      <div className="our-products-container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading our products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="our-products-section elementor-component">
      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}
      
      <div className="our-products-container">
        <div className="our-products-header">
          <h2 className="our-products-title">{content.title}</h2>
          <p className="our-products-subtitle">
            {content.subtitle}
          </p>
          <div className="our-products-divider"></div>
        </div>
        
        <div className="our-products-grid">
          {memoizedProducts && memoizedProducts.length > 0 ? (
            memoizedProducts.map((product, index) => (
              <div
                key={product.id}
                className="our-product-card"
                onClick={() => goToProductDetail(product)}
              >
                <div className="product-icon15">
                  {product.icon_url ? (
                    <img
                      src={normalizeImageUrl(product.icon_url)}
                      srcSet={`${normalizeImageUrl(product.icon_url)} 1x, ${normalizeImageUrl(product.icon_url)} 2x`}
                      sizes="56px"
                      alt={product.title}
                      className="product-icon-img"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        console.log('Icon load error:', product.icon_url);
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="product-icon-placeholder">
                      <span className="icon-text">{product.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <h3 className="product-title">{product.title}</h3>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              <p>No products available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OurProducts;
