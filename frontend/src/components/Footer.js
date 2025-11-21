import React, { useState, useEffect } from 'react';
import { apiGet } from '../utils/api';
import './Footer.css';



const Footer = () => {
  const [contactInfo, setContactInfo] = useState({});
  const [missionContent, setMissionContent] = useState(null);
  const [projects, setProjects] = useState([]);
  const [footerBottomLinks, setFooterBottomLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch contact info from API
      try {
        const contactData = await apiGet('/api/contact-info');
        if (contactData && !contactData.error) {
          // Contact info array'ini object'e çevir
          const contactMap = {};
          contactData.forEach(item => {
            if (item.field_type === 'phone') {
              contactMap.phone = item.field_value;
            } else if (item.field_type === 'email') {
              contactMap.email = item.field_value;
            } else if (item.field_type === 'address') {
              contactMap.address = item.field_value;
            } else if (item.field_type === 'working_hours') {
              contactMap.working_hours = item.field_value;
            }
          });
          setContactInfo(contactMap);
        } else {
          // Fallback static contact info
          setContactInfo({
            phone: '+90 212 555 0123',
            email: 'info@arna.com.tr',
            address: 'Levent Mahallesi, Büyükdere Caddesi No:201 Şişli/İSTANBUL',
            working_hours: 'Pazartesi - Cuma: 09:00 - 18:00'
          });
        }
      } catch (contactError) {
        console.warn('Could not fetch contact info for footer:', contactError);
        // Fallback static contact info
        setContactInfo({
          phone: '+90 212 555 0123',
          email: 'info@arna.com.tr',
          address: 'Levent Mahallesi, Büyükdere Caddesi No:201 Şişli/İSTANBUL',
          working_hours: 'Pazartesi - Cuma: 09:00 - 18:00'
        });
      }
      
      // Fetch footer info from API
      try {
        const footerData = await apiGet('/api/footer-info');
        if (footerData && !footerData.error) {
          console.log('✅ Footer info loaded from backend:', footerData);
          setMissionContent({
            content: footerData.company_description || 'Leading the way in sustainable energy solutions for a better tomorrow. We are committed to providing clean, reliable, and affordable energy while protecting our environment.',
            description: footerData.company_description || 'Leading the way in sustainable energy solutions for a better tomorrow. We are committed to providing clean, reliable, and affordable energy while protecting our environment.'
          });
        } else {
          console.log('⚠️ No footer info from backend, using fallback data');
          setMissionContent({
            content: 'Leading the way in sustainable energy solutions for a better tomorrow. We are committed to providing clean, reliable, and affordable energy while protecting our environment.',
            description: 'Leading the way in sustainable energy solutions for a better tomorrow. We are committed to providing clean, reliable, and affordable energy while protecting our environment.'
          });
        }
      } catch (footerError) {
        console.warn('Could not fetch footer info:', footerError);
        setMissionContent({
          content: 'Leading the way in sustainable energy solutions for a better tomorrow. We are committed to providing clean, reliable, and affordable energy while protecting our environment.',
          description: 'Leading the way in sustainable energy solutions for a better tomorrow. We are committed to providing clean, reliable, and affordable energy while protecting our environment.'
        });
      }

      // Fetch projects for footer from API
      try {
        console.log('🔍 Footer Projects: Fetching from API...');
        const projectsData = await apiGet('/api/projects');
        console.log('🔍 Footer Projects: API Response:', projectsData);
        if (projectsData && projectsData.length > 0) {
          // Transform projects data for footer display
          const footerProjects = projectsData.slice(0, 5).map(project => ({
            id: project.id,
            title: project.title,
            button_link: project.button_link || '#projects'
          }));
          setProjects(footerProjects);
        } else {
          // Fallback static projects
          setProjects([
            { id: 1, title: 'Waste Heat Recovery', button_link: '#projects' },
            { id: 2, title: 'Crude Flexibility', button_link: '#projects' },
            { id: 3, title: 'Unconventional Gas', button_link: '#projects' },
            { id: 4, title: 'Energy Storage', button_link: '#projects' },
            { id: 5, title: 'Carbon Management', button_link: '#projects' }
          ]);
        }
      } catch (projectsError) {
        console.warn('Could not fetch projects for footer:', projectsError);
        // Fallback static projects
        setProjects([
          { id: 1, title: 'Waste Heat Recovery', button_link: '#projects' },
          { id: 2, title: 'Crude Flexibility', button_link: '#projects' },
          { id: 3, title: 'Unconventional Gas', button_link: '#projects' },
          { id: 4, title: 'Energy Storage', button_link: '#projects' },
          { id: 5, title: 'Carbon Management', button_link: '#projects' }
        ]);
      }

      // Set static footer bottom links
      setFooterBottomLinks([
        { title: 'Privacy Policy', link: '/privacy' },
        { title: 'Terms of Service', link: '/terms' },
        { title: 'Cookie Policy', link: '/cookies' }
      ]);
      
    } catch (error) {
      console.error('Error setting static footer data:', error);
      setContactInfo({});
      setMissionContent({});
      setProjects([]);
      setFooterBottomLinks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Listen for projects updates
  useEffect(() => {
    const handleProjectsUpdate = () => {
      console.log('Footer: Projects updated, refreshing data...');
      fetchData();
    };

    window.addEventListener('projectsUpdated', handleProjectsUpdate);
    
    return () => {
      window.removeEventListener('projectsUpdated', handleProjectsUpdate);
    };
  }, []);

  if (loading) {
    return (
      <footer className="footer bg-dark">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer id="contact" className="footer bg-dark">
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <img 
                  src="/arna-logo.png" 
                  alt="ARNA Energy" 
                  className="logo-image-only"
                />
              </div>
              <p className="footer-description">
                {missionContent?.content || missionContent?.description || 'Leading the way in sustainable energy solutions for a better tomorrow. We are committed to providing clean, reliable, and affordable energy while protecting our environment.'}
              </p>
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Projects</h3>
              <ul className="footer-links">
                {projects.map((project, index) => (
                  <li key={project.id || index}>
                    <a href={project.button_link || "#projects"}>{project.title}</a>
                  </li>
                ))}
                {projects.length === 0 && (
                  <>
                    <li><a href="#projects">Waste Heat Recovery</a></li>
                    <li><a href="#projects">Crude Flexibility</a></li>
                    <li><a href="#projects">Unconventional Gas</a></li>
                  </>
                )}
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Contact Info</h3>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>{contactInfo.phone || '+90 555 55 55'}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>{contactInfo.email || 'info@arna.com.tr'}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>{contactInfo.address || 'Levent Mahallesi, Büyükdere Caddesi No:201 Şişli/İSTANBUL'}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🕒</span>
                <span>{contactInfo.working_hours || 'Pazartesi - Cuma: 09:00 - 18:00'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; 2025 ARNA. All rights reserved.</p>
            <div className="footer-bottom-links">
              {footerBottomLinks.map((link, index) => (
                <a key={index} href={link.link}>{link.title}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
