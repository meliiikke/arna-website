import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './BrandTrust.css';
import { apiGet } from '../utils/api';
import { normalizeImageUrl } from '../config/api';

const BrandTrust = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [brandTrustData, setBrandTrustData] = useState({
    title: 'Trusted by 30,000 world-class brands and organizations of all sizes',
    logos: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch brand trust data from backend
  const fetchBrandTrustData = async () => {
    try {
      setLoading(true);
      
      // Fetch brand trust content from backend
      const contentResponse = await apiGet('/api/brand-trust/content');
      let title = 'Trusted by 30,000 world-class brands and organizations of all sizes';
      
      if (contentResponse && !contentResponse.error && contentResponse.title) {
        title = contentResponse.title;
        console.log('✅ Brand trust content loaded from backend:', contentResponse);
      } else {
        console.log('⚠️ Using fallback brand trust content');
      }

      // Fetch brand trust logos from backend
      const logosResponse = await apiGet('/api/brand-trust/logos');
      let logos = [];
      
      if (logosResponse && !logosResponse.error && Array.isArray(logosResponse)) {
        logos = logosResponse;
        console.log('✅ Brand trust logos loaded from backend:', logosResponse);
      } else {
        console.log('⚠️ Using fallback brand trust logos');
        // Fallback to static data if backend fails
        logos = [
          { id: 1, brand_name: 'ARNA Energy', logo_url: require('../images/logo.jpg') },
          { id: 2, brand_name: 'ARNA Energy', logo_url: require('../images/logo.jpg') },
          { id: 3, brand_name: 'ARNA Energy', logo_url: require('../images/logo.jpg') }
        ];
      }

      setBrandTrustData({
        title: title,
        logos: logos
      });
    } catch (error) {
      console.error('❌ Error fetching brand trust data:', error);
      // Fallback data on error
      setBrandTrustData({
        title: 'Trusted by 30,000 world-class brands and organizations of all sizes',
        logos: [
          { id: 1, brand_name: 'ARNA Energy', logo_url: require('../images/logo.jpg') },
          { id: 2, brand_name: 'ARNA Energy', logo_url: require('../images/logo.jpg') },
          { id: 3, brand_name: 'ARNA Energy', logo_url: require('../images/logo.jpg') }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Fetch brand trust data
    fetchBrandTrustData();

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <section className="brand-trust animate-on-scroll">
      <div className="container">
        <motion.div 
          className="brand-trust-content"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="brand-trust-layout">
            {/* Fixed text on the left */}
            <div className="brand-trust-title">
              {loading ? 'Loading...' : brandTrustData.title}
            </div>
            
            {/* Marquee container on the right */}
            <div className="marquee-box">
              <div className="marquee">
                {loading ? (
                  <div style={{ padding: '20px', color: '#666' }}>Loading logos...</div>
                ) : (
                  <>
                    {/* First set of logos */}
                    {brandTrustData.logos && brandTrustData.logos.length > 0 ? brandTrustData.logos.map((brand, index) => (
                        <motion.div
                          key={`first-${brand.id}`}
                          className="brand-logo"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                          viewport={{ once: true, amount: 0.3 }}
                        >
                        <img 
                          src={normalizeImageUrl(brand.logo_url)} 
                          srcSet={`${normalizeImageUrl(brand.logo_url)} 1x, ${normalizeImageUrl(brand.logo_url)} 2x`}
                          sizes="350px"
                          alt={brand.brand_name} 
                          className="brand-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </motion.div>
                    )) : null}
                    {/* Duplicate set for seamless scrolling */}
                    {brandTrustData.logos && brandTrustData.logos.length > 0 ? brandTrustData.logos.map((brand, index) => (
                        <motion.div
                          key={`duplicate-${brand.id}`}
                          className="brand-logo"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: (index + brandTrustData.logos.length) * 0.03, ease: "easeOut" }}
                          viewport={{ once: true, amount: 0.3 }}
                        >
                        <img 
                          src={normalizeImageUrl(brand.logo_url)} 
                          srcSet={`${normalizeImageUrl(brand.logo_url)} 1x, ${normalizeImageUrl(brand.logo_url)} 2x`}
                          sizes="350px"
                          alt={brand.brand_name} 
                          className="brand-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </motion.div>
                    )) : null}
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandTrust;
