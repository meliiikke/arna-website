import React, { useState, useEffect } from 'react';
import { normalizeImageUrl, API_BASE_URL } from '../config/api';
import { apiGet } from '../utils/api';
import './Services.css';

const Services = () => {
  console.log('🎯 Services component rendered');

  const [services, setServices] = useState([]);
  const [servicesContent, setServicesContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        console.log('🚀 Starting Services data fetch...');

        console.log('🌐 API Base URL:', process.env.REACT_APP_API_BASE_URL || 'https://api.arna.one/api');
        
        // Fetch services content (header section) - try admin endpoint first
        console.log('🌐 Making API call to: /api/services/content');
        let contentResponse = await apiGet('/api/services/content');
        console.log('🔍 Services content API response:', contentResponse);
        
        // If no content, try admin endpoint
        if (!contentResponse || contentResponse.error) {
          console.log('🌐 Trying admin endpoint for content: /api/services/admin/content');
          contentResponse = await apiGet('/api/services/admin/content');
          console.log('🔍 Services content admin API response:', contentResponse);
        }
        
        // Fetch services list (individual services) - try admin endpoint first
        console.log('🌐 Making API call to: /api/services');
        let servicesResponse = await apiGet('/api/services');
        console.log('🔍 Services list API response:', servicesResponse);
        
        // If no services, try admin endpoint
        if (!servicesResponse || servicesResponse.error || (Array.isArray(servicesResponse) && servicesResponse.length === 0)) {
          console.log('🌐 Trying admin endpoint for services: /api/services/admin/services');
          servicesResponse = await apiGet('/api/services/admin/services');
          console.log('🔍 Services list admin API response:', servicesResponse);
        }
        
        // Process services content
        let content = null;
        if (contentResponse && !contentResponse.error && contentResponse.title) {
          console.log('✅ Services content loaded from backend:', contentResponse);
          content = contentResponse;
        } else {
          console.log('⚠️ No content from backend, using fallback data');
          content = {
            id: 1,
            title: 'Leading Energy Solutions',
            subtitle: 'Our Services',
            description: 'We provide comprehensive energy solutions that meet the demands of today while building a sustainable tomorrow.',
            is_active: 1
          };
        }
        
        // Process services list
        let servicesArray = [];
        if (servicesResponse && !servicesResponse.error && Array.isArray(servicesResponse) && servicesResponse.length > 0) {
          console.log('✅ Services list loaded from backend:', servicesResponse);
          servicesArray = servicesResponse;
        } else {
          console.log('⚠️ No services from backend, using fallback data');
          servicesArray = [
            {
              id: 1,
              title: 'Carbon Capture & Storage',
              description: 'Advanced CCS technology to reduce carbon emissions and create a sustainable energy future.',
              image_url: null,
              display_order: 1,
              is_active: 1
            },
            {
              id: 2,
              title: 'Renewable Energy Solutions',
              description: 'Comprehensive renewable energy systems including solar, wind, and hydroelectric power.',
              image_url: null,
              display_order: 2,
              is_active: 1
            },
            {
              id: 3,
              title: 'Energy Storage Systems',
              description: 'Cutting-edge battery and storage technologies for reliable energy supply.',
              image_url: null,
              display_order: 3,
              is_active: 1
            },
            {
              id: 4,
              title: 'Smart Grid Technology',
              description: 'Intelligent grid systems for efficient energy distribution and management.',
              image_url: null,
              display_order: 4,
              is_active: 1
            }
          ];
        }
        
        setServicesContent(content);
        setServices(servicesArray);
        
        console.log('✅ Services data set successfully');

      } catch (error) {
        console.error('❌ Error fetching services data:', error);
        console.error('❌ Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
        
        // Use fallback data on error
        console.log('⚠️ Using fallback services data due to error');
        const fallbackContent = {
          id: 1,
          title: 'Leading Energy Solutions',
          subtitle: 'Our Services',
          description: 'We provide comprehensive energy solutions that meet the demands of today while building a sustainable tomorrow.',
          is_active: 1
        };
        
        const fallbackServices = [
          {
            id: 1,
            title: 'Carbon Capture & Storage',
            description: 'Advanced CCS technology to reduce carbon emissions and create a sustainable energy future.',
            image_url: null,
            display_order: 1,
            is_active: 1
          },
          {
            id: 2,
            title: 'Renewable Energy Solutions',
            description: 'Comprehensive renewable energy systems including solar, wind, and hydroelectric power.',
            image_url: null,
            display_order: 2,
            is_active: 1
          },
          {
            id: 3,
            title: 'Energy Storage Systems',
            description: 'Cutting-edge battery and storage technologies for reliable energy supply.',
            image_url: null,
            display_order: 3,
            is_active: 1
          },
          {
            id: 4,
            title: 'Smart Grid Technology',
            description: 'Intelligent grid systems for efficient energy distribution and management.',
            image_url: null,
            display_order: 4,
            is_active: 1
          }
        ];
        
        setServicesContent(fallbackContent);
        setServices(fallbackServices);
        setError(null); // Clear error since we have fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
    initRevealOnScroll();
  }, []);

  // Listen for storage events to refresh data when admin panel updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'servicesUpdated') {
        console.log('Services updated, refreshing data...');
        window.location.reload(); // Simple refresh for now
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events
    const handleCustomEvent = () => {
      console.log('Services custom event received, refreshing data...');
      window.location.reload(); // Simple refresh for now
    };

    window.addEventListener('servicesUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('servicesUpdated', handleCustomEvent);
    };
  }, []);

  console.log('🎯 Services Render - Services:', services);
  console.log('🎯 Services Render - Services length:', services.length);
  console.log('🎯 Services Render - Loading:', loading);
  console.log('🎯 Services Render - Error:', error);

  if (loading) {
    return (
      <section id="services" className="services section bg-light">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="services section bg-light">
        <div className="container">
          <div className="error-message" style={{padding: '20px', textAlign: 'center', color: '#e74c3c'}}>
            <h2>⚠️ Services Loading Error</h2>
            <p>Error: {error}</p>
            <p>Please check the console for more details.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="services section bg-light">
      <div className="container">
        <div 
          className="section-header"
        >
          <div className="section-header-left">
            <motion.span className="section-subtitle" initial={{opacity:0, x:-12}} whileInView={{opacity:1, x:0}} transition={{duration:0.25, ease:'easeOut'}} viewport={{once:true, amount:0.25}}>
              {servicesContent?.subtitle || 'Our Services'}
            </motion.span>
            <motion.h2 className="section-title20" initial={{opacity:0, x:-12}} whileInView={{opacity:1, x:0}} transition={{duration:0.25, ease:'easeOut'}} viewport={{once:true, amount:0.25}}>
              {servicesContent?.title || 'Leading Energy Solutions'}
            </motion.h2>
          </div>
          <motion.p className="section-description2" initial={{opacity:0, x:12}} whileInView={{opacity:1, x:0}} transition={{duration:0.25, ease:'easeOut'}} viewport={{once:true, amount:0.25}}>
            {servicesContent?.description || 'We provide comprehensive energy solutions that meet the demands of today while building a sustainable tomorrow.'}
          </motion.p>
        </div>

        <div className="services-grid">
          {services && Array.isArray(services) && services.length > 0 ? services.map((service, index) => (
            <motion.div
              key={service.id || index}
              className="service-card reveal reveal-up"
              initial={{opacity:0, y:12}}
              whileInView={{opacity:1, y:0}}
              transition={{duration:0.25, ease:'easeOut'}}
              viewport={{once:true, amount:0.25}}
            >
              {service.image_url && (
                <div className="service-image">
                  <img src={normalizeImageUrl(service.image_url)} alt={service.title} />
                </div>
              )}
              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            </motion.div>
          )) : (
            <div className="no-services">
              <p>No services available. Please check the admin panel or contact support.</p>
              <p>Debug: Services array length: {services.length}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;
