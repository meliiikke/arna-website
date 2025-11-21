import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { apiGet } from '../utils/api';
import './FAQ.css';

const FAQ = () => {
  const [faqData, setFaqData] = useState([]);
  const [faqContent, setFaqContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openIndex, setOpenIndex] = useState(-1); // Tüm sorular kapalı olsun

  const fetchFAQData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching FAQ data...');

      // Use Promise.all to fetch both APIs simultaneously for better performance
      const [faqResponse, contentResponse] = await Promise.all([
        apiGet('/api/faq'),
        apiGet('/api/faq-content').catch(() => null) // Catch error for optional content
      ]);

      console.log('📥 FAQ response:', faqResponse);
      console.log('📥 FAQ content response:', contentResponse);
      
      // Process FAQ questions
      if (faqResponse && !faqResponse.error && Array.isArray(faqResponse)) {
        setFaqData(faqResponse);
        console.log('✅ FAQ data set:', faqResponse);
      } else {
        console.log('⚠️ FAQ response has error or is null:', faqResponse);
        throw new Error('FAQ API failed');
      }

      // Process FAQ content
      if (contentResponse && !contentResponse.error && contentResponse.title) {
        setFaqContent(contentResponse);
        console.log('✅ FAQ content set:', contentResponse);
      } else {
        console.log('⚠️ FAQ content response has error or is null:', contentResponse);
        // Set fallback content
        setFaqContent({
          title: 'Merak Edilen Sorular',
          subtitle: 'Size yardımcı olmak için buradayız',
          image_url: null
        });
      }

      setError(null);
    } catch (err) {
      console.error('❌ Error fetching FAQ data:', err);
      setError('Failed to load FAQ data');

      // Fallback to static data if API fails
      console.log('🔄 Using fallback static FAQ data');
      setFaqData([
        {
          id: 1,
          question: 'Hangi ülkelerle çalışıyorsunuz?',
          answer: 'Başta Türkiye ve Almanya olmak üzere, Fransa, İngiltere, İtalya, Portekiz, Hindistan, Mısır, Güney Afrika, Amerika, Kanada, Güney Amerika ülkeleri ve uzak doğu ülkeleri.',
          display_order: 1,
          is_active: true
        },
        {
          id: 2,
          question: 'Ürünlerinizin uluslararası üretim sertifikaları var mı?',
          answer: 'Evet, tüm ürünlerimiz uluslararası standartlara uygun olarak üretilmekte ve gerekli sertifikalara sahiptir. ISO 9001, ISO 14001 ve diğer uluslararası kalite standartlarına uygunluk belgelerimiz mevcuttur.',
          display_order: 2,
          is_active: true
        },
        {
          id: 3,
          question: 'Hangi alanda inşaat hizmetleri sağlıyorsunuz?',
          answer: 'Petrol ve doğalgaz sektöründe kapsamlı inşaat hizmetleri sunuyoruz. Rafineri tesisleri, boru hatları, depolama tankları, işleme tesisleri ve enerji altyapı projelerinde uzmanız.',
          display_order: 3,
          is_active: true
        },
        {
          id: 4,
          question: 'Projelerinizde hangi teknolojileri kullanıyorsunuz?',
          answer: 'En son teknolojileri kullanarak projelerimizi gerçekleştiriyoruz. CCUS teknolojisi, yenilenebilir enerji sistemleri, akıllı grid teknolojileri ve sürdürülebilir enerji çözümleri alanlarında uzmanız.',
          display_order: 4,
          is_active: true
        },
        {
          id: 5,
          question: 'Çevre dostu uygulamalarınız nelerdir?',
          answer: 'Sürdürülebilir enerji çözümleri geliştiriyor, karbon ayak izimizi minimize ediyor ve çevre dostu teknolojiler kullanıyoruz. Tüm projelerimizde çevresel etki değerlendirmesi yapıyoruz.',
          display_order: 5,
          is_active: true
        }
      ]);

      setFaqContent({
        title: 'Merak Edilen Sorular',
        subtitle: 'Size yardımcı olmak için buradayız',
        image_url: null
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFAQData();
  }, [fetchFAQData]);

  // Memoize filtered and sorted FAQ items for better performance
  const processedFaqData = useMemo(() => {
    if (!faqData || faqData.length === 0) return [];
    
    return faqData
      .filter(faq => faq.is_active)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }, [faqData]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  if (loading) {
    return (
      <section className="faq-section elementor-component animate-on-scroll">
        <div className="faq-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading FAQ section...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && faqData.length === 0) {
    return (
      <section className="faq-section elementor-component animate-on-scroll">
        <div className="faq-container">
          <div className="error-container">
            <p>Error loading FAQ section: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="faq-section elementor-component animate-on-scroll">
      <div className="faq-container">
        <div className="faq-content">
          {/* Sol taraf - Görsel */}
          <div className="faq-visual">
            <div className="faq-image-container">
              {faqContent && faqContent.image_url ? (
                <img 
                  src={faqContent.image_url} 
                  alt="FAQ Visual" 
                  className="faq-main-image"
                />
              ) : (
                <div className="faq-image-placeholder">
                  <div className="faq-placeholder-text">
                    <p>Resim yüklemek için admin panelden FAQ Image düzenleyin</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sağ taraf - FAQ Listesi */}
          <div className="faq-list-container">
            <div className="faq-header">
              <h2 className="faq-title">{faqContent ? faqContent.title : 'Merak Edilen Sorular'}</h2>
              <p className="faq-subtitle">{faqContent ? faqContent.subtitle : 'Sıkça sorulan sorular ve cevapları'}</p>
            </div>

            <div className="faq-list">
              {processedFaqData && processedFaqData.length > 0 ? (
                processedFaqData.map((faq, index) => (
                    <div
                      key={faq.id || index}
                      className={`faq-item ${openIndex === index ? 'active' : ''}`}
                    >
                      <button
                        className="faq-question"
                        onClick={() => toggleFAQ(index)}
                      >
                        <span className="faq-question-text">{faq.question}</span>
                        <span
                          className="faq-icon"
                          style={{ transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)' }}
                        >
                          ✓
                        </span>
                      </button>
                      
                      <div>
                        {openIndex === index && (
                          <div className="faq-answer">
                            <div className="faq-answer-content">
                              {faq.answer}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="empty-faq">
                  <p>Henüz soru bulunmuyor.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
