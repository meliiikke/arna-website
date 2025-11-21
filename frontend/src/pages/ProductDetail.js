import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, normalizeImageUrl } from '../utils/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure page loads at top
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      
      // Add a minimum delay to prevent flickering on fast connections
        const response = await apiGet(`/api/product-details/${id}`);
      
      if (response && !response.error) {
        setProduct(response);
      } else {
        // Fallback data
        setProduct({
          id: id,
          title: 'Ürün Detayı',
          description: 'Bu ürün hakkında detaylı bilgi için lütfen bizimle iletişime geçin.',
          image_url: null,
          wysiwyg_content: '',
          content_sections: []
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Ürün yüklenirken hata oluştu.');
    } finally {
      // Add a small delay before removing loading to smooth transition
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="product-detail-container">
          <div className="skeleton-container">
            {/* Back button skeleton */}
            <div className="skeleton skeleton-line" style={{ width: '100px', height: '40px' }}></div>
            
            {/* Title skeleton */}
            <div className="skeleton skeleton-title"></div>
            
            {/* Content skeleton */}
            <div className="skeleton skeleton-paragraph"></div>
            <div className="skeleton skeleton-paragraph"></div>
            <div className="skeleton skeleton-paragraph"></div>
            <div className="skeleton skeleton-paragraph"></div>
            
            {/* Image skeleton */}
            <div className="skeleton skeleton-image"></div>
            
            {/* More content skeleton */}
            <div className="skeleton skeleton-paragraph"></div>
            <div className="skeleton skeleton-paragraph"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="product-detail-container">
          <div className="error">
            <p>{error}</p>
            <button onClick={goBack} className="btn-back">
              ← Geri Dön
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Content sections render fonksiyonu
  const renderContentSections = () => {
    if (!product.content_sections) return null;
    
    let contentSections = [];
    try {
      const parsed = typeof product.content_sections === 'string' 
        ? JSON.parse(product.content_sections) 
        : product.content_sections;
      
      if (Array.isArray(parsed)) {
        contentSections = parsed;
      }
    } catch (e) {
      console.error('Error parsing content_sections:', e);
      return null;
    }

    if (contentSections.length === 0) return null;

    return contentSections.map((section, index) => {
      if (section.type === 'text') {
        return (
          <div key={index} className="content-text-section" style={{ 
            color: section.color || '#e9ecef',
            margin: '20px 0',
            lineHeight: '1.6',
            padding: '15px',
            backgroundColor: section.backgroundColor || 'transparent',
            borderRadius: section.backgroundColor ? '8px' : '0'
          }}>
            <p style={{ margin: 0 }}>{section.content}</p>
          </div>
        );
      } else if (section.type === 'image') {
        return (
          <div key={index} className="content-image-section" style={{
            textAlign: section.position === 'left' ? 'left' : 
                     section.position === 'right' ? 'right' : 'center',
            margin: '20px 0'
          }}>
            <img 
              src={normalizeImageUrl(section.content)} 
              alt="Product content"
              style={{
                maxWidth: section.width || '100%',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                display: 'block',
                margin: '0 auto'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="product-detail-page smooth-enter">
      <Header />
      
      <div className="product-detail-container">
        {/* Back Button */}
        <div className="product-detail-header">
          <button onClick={goBack} className="btn-back">
            ← Geri Dön
          </button>
        </div>

        {/* Product Content */}
        <div className="product-detail-content">
          <h1 className="product-detail-title">{product.title}</h1>
          
          {/* WYSIWYG İçerik */}
          {product.wysiwyg_content ? (
            <div 
              className="wysiwyg-content-display"
              dangerouslySetInnerHTML={{ __html: product.wysiwyg_content }}
            />
          ) : (
            /* Fallback: Eski content_sections sistemi */
            <div className="content-sections-fallback">
              {renderContentSections()}
              
              {/* Eğer hiç içerik yoksa description göster */}
              {(!product.wysiwyg_content && (!product.content_sections || JSON.parse(product.content_sections || '[]').length === 0)) && (
                <div className="product-description">
                  <p>{product.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Ana Resim */}
          {product.image_url && (
            <div className="product-main-image">
              <img 
                src={normalizeImageUrl(product.image_url)} 
                alt={product.title}
                style={{
                  width: '100%',
                  maxWidth: '800px',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  margin: '20px auto',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
