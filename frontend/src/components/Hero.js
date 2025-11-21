import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import { gsap } from 'gsap';
import { normalizeImageUrl } from '../config/api';
import { apiGet } from '../utils/api';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import './Hero.css';

const Hero = () => {
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isHeroReady, setIsHeroReady] = useState(false);
  const swiperRef = useRef(null);
  const contentRefs = useRef([]);
  
  // Dynamic slider data from database
  const [sliderData, setSliderData] = useState([]);

  // Preload image function
  const preloadImage = useCallback((imageUrl) => {
    if (!imageUrl) return Promise.resolve();
    
    const normalizedUrl = normalizeImageUrl(imageUrl);
    
    // Check if image is already loaded
    if (imagesLoaded[normalizedUrl] !== undefined) {
      return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        setImagesLoaded(prev => ({ ...prev, [normalizedUrl]: true }));
        resolve();
      };
      img.onerror = () => {
        setImagesLoaded(prev => ({ ...prev, [normalizedUrl]: false }));
        resolve(); // Resolve anyway to not block loading
      };
      img.src = normalizedUrl;
    });
  }, [imagesLoaded]);

  // Animate slide content with GSAP - smooth and slow
  const animateSlideContent = useCallback((slideIndex) => {
    const contentElement = contentRefs.current[slideIndex];
    if (!contentElement) return;

    // Immediately set initial state to avoid first-frame jump
    gsap.set(contentElement.children, { opacity: 0, y: 24, scale: 0.99 });

    // Animate in
    gsap.to(contentElement.children, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
      delay: 0.05
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hero slides from backend
        const slidesResponse = await apiGet('/api/hero-slides');
        if (slidesResponse && !slidesResponse.error && Array.isArray(slidesResponse)) {
          setSliderData(slidesResponse);
          
          // Preload slider images
          const imagePromises = slidesResponse
            .filter(slide => slide.image_url)
            .map(slide => preloadImage(slide.image_url));
          
          await Promise.all(imagePromises);
          
          // Mark hero as ready after data and images loaded
          setTimeout(() => {
            setIsHeroReady(true);
            animateSlideContent(0); // Animate first slide
          }, 100);
        } else {
          // Fallback to static data if backend fails
          setSliderData([
            {
              id: 1,
              title: 'Meeting Future Demand In A Sustainable Way',
              content: 'We\'re doing our part in that regard with greener practices that don\'t harm the environment.',
              image_url: require('../images/slide1.png')
            },
            {
              id: 2,
              title: 'Meeting Future Demand In A Sustainable Way',
              content: 'We\'re doing our part in that regard with greener practices that don\'t harm the environment.',
              image_url: require('../images/about.jpg')
            }
          ]);
          
          // Mark hero as ready for fallback data
          setTimeout(() => {
            setIsHeroReady(true);
            animateSlideContent(0); // Animate first slide
          }, 50);
        }

      } catch (error) {
        console.error('❌ Error fetching hero data:', error);
        // Use fallback data on error
        setSliderData([
          {
            id: 1,
            title: 'Meeting Future Demand In A Sustainable Way',
            content: 'We\'re doing our part in that regard with greener practices that don\'t harm the environment.',
            image_url: require('../images/slide1.png')
          }
        ]);
        
        // Mark hero as ready even on error
        setTimeout(() => {
          setIsHeroReady(true);
          animateSlideContent(0); // Animate first slide
        }, 50);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [preloadImage, animateSlideContent]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSlideChange = (swiper) => {
    const newIndex = swiper.realIndex; // Use realIndex for looped slider
    setCurrentSlide(newIndex);
    animateSlideContent(newIndex);
    
    // Restart zoom animation for the new active slide
    setTimeout(() => {
      const activeSlide = document.querySelector('.hero-swiper .swiper-slide-active .hero-image');
      if (activeSlide) {
        activeSlide.style.animation = 'none';
        // Trigger reflow to reset animation
        void activeSlide.offsetHeight;
        activeSlide.style.animation = 'heroImageZoom 3s ease-in-out';
      }
    }, 100);
  };

  if (loading) {
    return (
      <section className="hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="hero-image hero-loading-image"></div>
        </div>
        <div className="hero-loading">
          <div className="loading-content">
            <div className="loading-logo">
              <div className="logo-placeholder"></div>
            </div>
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <div className="loading-text">Yükleniyor...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className={`hero hero-slider ${isHeroReady ? 'hero-ready' : 'hero-loading'}`}>
      <Swiper
        ref={swiperRef}
        modules={[EffectFade, Autoplay]}
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false
        }}
        speed={300}
        loop={true}
        onSlideChange={handleSlideChange}
        className="hero-swiper"
      >
        {sliderData.map((slide, index) => (
          <SwiperSlide key={slide.id || index}>
            <div className="hero-slide">
              <div className="hero-background">
                <div className="hero-overlay"></div>
                <div 
                  className="hero-image"
                  style={{
                    backgroundImage: slide.image_url 
                      ? `linear-gradient(135deg, rgba(26, 26, 26, 0.7) 0%, rgba(197, 165, 114, 0.1) 50%, rgba(26, 26, 26, 0.8) 100%), url(${normalizeImageUrl(slide.image_url)})` 
                      : undefined
                  }}
                  data-slide-index={index}
                ></div>
              </div>
              
              <div className="container">
                <div className="hero-content">
                  <div 
                    className="hero-text"
                    ref={el => contentRefs.current[index] = el}
                  >
                    <h1 className="hero-title">
                      {slide.title || 'Meeting Future Demand In A Sustainable Way'}
                    </h1>
                    
                    {slide.subtitle && (
                      <h2 className="hero-subtitle">
                        {slide.subtitle}
                      </h2>
                    )}
                    
                    {slide.content && (
                      <p className="hero-description">
                        {slide.content}
                      </p>
                    )}

                    <div className="hero-actions">
                      <button 
                        className="btn btn-primary hero-btn"
                        onClick={() => {
                          if (slide.button_link) {
                            if (slide.button_link.startsWith('#')) {
                              scrollToSection(slide.button_link.substring(1));
                            } else {
                              window.open(slide.button_link, '_blank');
                            }
                          } else {
                            scrollToSection('about');
                          }
                        }}
                      >
                        {slide.button_text || 'DISCOVER MORE'} <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Dots */}
      <div className="slider-dots">
        {sliderData.map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => {
              if (swiperRef.current) {
                swiperRef.current.swiper.slideToLoop(index);
              }
            }}
          >
            {index === currentSlide && (
              <div className="progress-ring">
                <svg className="progress-circle" width="20" height="20">
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="rgba(197, 165, 114, 0.3)"
                    strokeWidth="2"
                  />
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill="none"
                    stroke="var(--primary-gold)"
                    strokeWidth="2"
                    strokeDasharray="50.26"
                    strokeDashoffset="50.26"
                    className="progress-bar"
                    style={{
                      animation: 'progressAnimation 4s linear infinite'
                    }}
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
