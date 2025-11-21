import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../utils/api';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [contactInfo, setContactInfo] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const data = await apiGet('/api/contact-info');
        if (data && !data.error) {
          // Contact info array'ini object'e çevir
          const contactMap = {};
          data.forEach(item => {
            if (item.field_type === 'phone') {
              contactMap.phone = item.field_value;
            } else if (item.field_type === 'email') {
              contactMap.email = item.field_value;
            }
          });
          setContactInfo(contactMap);
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };

    fetchContactInfo();
  }, []);

  // Menü açıkken body scroll'unu engelle
  useEffect(() => {
    if (isMenuOpen) {
      // Scroll pozisyonunu kaydet
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      document.body.classList.add('menu-open');
    } else {
      // Scroll pozisyonunu geri yükle
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.classList.remove('menu-open');
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    // Önce menüyü kapat
    closeMenu();
    
    // Eğer contact sayfasındaysak, önce home sayfasına git
    if (window.location.pathname !== '/') {
      navigate('/');
      // Home sayfasına gittikten sonra scroll işlemini yap
      setTimeout(() => {
        scrollToElement(sectionId);
      }, 100);
    } else {
      // Zaten home sayfasındaysak direkt scroll yap
      setTimeout(() => {
        scrollToElement(sectionId);
      }, 300);
    }
  };

  const scrollToElement = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Smooth scroll için offset hesapla
      const headerHeight = window.innerWidth <= 768 ? 70 : 90; // Responsive header yüksekliği
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      {/* Top Bar - Contact Info */}
      <div className="header-top-bar">
        <div className="container">
          <div className="top-bar-content">
            <div className="contact-info">
              <span className="contact-text">
                <i className="fas fa-phone"></i>
                {contactInfo.phone || '228-2000-2012'}
              </span>
              <span className="contact-text">
                <i className="fas fa-envelope"></i>
                {contactInfo.email || 'hello@yourdomain.tld'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="header-main">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <img 
                src={require('../images/logo.png')} 
                alt="Logo" 
                className="logo-image"
              />
            </div>

            <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
              <ul className="nav-list">
                <li className="nav-item">
                  <button 
                    className="nav-link" 
                    onClick={() => scrollToSection('home')}
                  >
                    HOME
                  </button>
                </li>
                <li className="nav-item dropdown">
                  <button 
                    className="nav-link" 
                    onClick={() => scrollToSection('about')}
                  >
                    ABOUT US <i className="fas fa-chevron-down"></i>
                  </button>
                </li>
                <li className="nav-item dropdown">
                  <button 
                    className="nav-link" 
                    onClick={() => scrollToSection('services')}
                  >
                    SERVICES <i className="fas fa-chevron-down"></i>
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className="nav-link" 
                    onClick={() => scrollToSection('projects')}
                  >
                    PROJECTS
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className="nav-link" 
                    onClick={() => {
                      closeMenu();
                      navigate('/contact');
                    }}
                  >
                    CONTACT US
                  </button>
                </li>
                <li className="nav-item dropdown">
                  <button 
                    className="nav-link" 
                    onClick={() => scrollToSection('footer')}
                  >
                    PAGES <i className="fas fa-chevron-down"></i>
                  </button>
                </li>
              </ul>
            </nav>

            <div className="header-actions">
              <button className={`menu-toggle ${isMenuOpen ? 'menu-open' : ''}`} onClick={toggleMenu}>
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;
