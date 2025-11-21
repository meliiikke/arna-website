import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../utils/api';
import './Contact.css';

const Contact = () => {
  const [contactInfo, setContactInfo] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    fetchContactInfo();
    generateCaptcha();
  }, []);

  // Contact bilgilerini sadece bir kez yükle
  // Auto-refresh kaldırıldı - gereksiz API çağrılarını önlemek için

  const fetchContactInfo = async () => {
    try {
      console.log('🔄 Fetching contact info from: /api/contact-info');
      const data = await apiGet('/api/contact-info');
      
      if (data && Array.isArray(data)) {
        console.log('✅ Contact info data received:', data);
        
        // Convert array to object by field_name (priority) or field_type
        const contactData = {};
        data.forEach(item => {
          // Phone field
          if (item.field_name === 'phone' || item.field_type === 'phone') {
            contactData.phone = item.field_value;
          }
          // Email field
          else if (item.field_name === 'email' || item.field_type === 'email') {
            contactData.email = item.field_value;
          }
          // Address field
          else if (item.field_name === 'address' || item.field_type === 'address') {
            contactData.address = item.field_value;
            contactData.map_latitude = item.map_latitude;
            contactData.map_longitude = item.map_longitude;
          }
          // Working hours field
          else if (item.field_name === 'working_hours' || item.field_type === 'working_hours') {
            contactData.working_hours = item.field_value;
          }
          // WhatsApp field - öncelik field_name'e ver
          else if (item.field_name === 'whatsapp') {
            contactData.whatsapp = item.field_value;
          }
          // GSM field - öncelik field_name'e ver
          else if (item.field_name === 'gsm') {
            contactData.gsm = item.field_value;
          }
        });
        
        setContactInfo(contactData);
      } else {
        console.error('❌ Contact info fetch failed:', data);
        // Set fallback contact info
        setContactInfo({
          phone: '+90 555 55 55',
          email: 'info@arna.com.tr',
          address: 'Levent Mahallesi, Büyükdere Caddesi No:201 Şişli/İSTANBUL',
          working_hours: 'Monday - Friday: 09:00 - 18:00',
          map_latitude: '41.0781',
          map_longitude: '29.0173'
        });
      }
    } catch (error) {
      console.error('❌ Error fetching contact info:', error);
      // Set fallback contact info
      setContactInfo({
        phone: '+90 555 55 55',
        email: 'info@arna.com.tr',
        address: 'Levent Mahallesi, Büyükdere Caddesi No:201 Şişli/İSTANBUL',
        working_hours: 'Monday - Friday: 09:00 - 18:00',
        map_latitude: '41.0781',
        map_longitude: '29.0173'
      });
    }
  };



  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (captchaInput.toLowerCase() !== captcha.toLowerCase()) {
      setSubmitStatus('captcha_error');
      return;
    }

    console.log('📧 Form data being sent:', formData);

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      console.log('📧 Sending request to: /api/contact-messages/submit');
      console.log('📧 Request body:', JSON.stringify(formData));
      
      const data = await apiPost('/api/contact-messages/submit', formData);
      console.log('✅ Response data:', data);

      if (data && data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          subject: '',
          message: ''
        });
        setCaptchaInput('');
        generateCaptcha();
      } else {
        console.error('Server error:', data.error); // Debug log
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Harita URL'sini oluştur
  const getMapUrl = (address, lat, lng) => {
    // Varsayılan koordinatlar (Levent, Büyükdere Caddesi)
    const defaultLat = 41.0781;
    const defaultLng = 29.0173;
    
    const mapLat = parseFloat(lat) || defaultLat;
    const mapLng = parseFloat(lng) || defaultLng;
    
    // Google Maps Embed API kullanarak daha dinamik URL
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${mapLat},${mapLng}&center=${mapLat},${mapLng}&zoom=15`;
  };

  return (
    <div className="contact-page" id="contact">
      <div className="contact-container">
        {/* Header Section */}
        <section className="contact-header-section">
          <div className="contact-header-content">
            <div className="section-header">
              <span className="section-subtitle contact-subtitle">CONTACT</span>
            </div>
          </div>
        </section>

        {/* Top Section - Google Maps */}
        <section className="contact-map-section">
          <div className="map-container">
            <iframe
              key={`${contactInfo.map_latitude}-${contactInfo.map_longitude}`}
              src={getMapUrl(contactInfo.address, contactInfo.map_latitude, contactInfo.map_longitude)}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps - ARNA Energy Location"
            ></iframe>
          </div>
        </section>

        {/* Bottom Section - Contact Info and Form */}
        <section className="contact-content-section">
          <div className="contact-content-container">
          {/* Left Column - Contact Information */}
          <div className="contact-info-column">
            <div className="contact-info-item">
              <div className="contact-icon">📞</div>
              <div className="contact-content">
                <h4>Call Us</h4>
                <p>{contactInfo.phone || '+90 (850) 512 0 222'}</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">💬</div>
              <div className="contact-content">
                <h4>WhatsApp</h4>
                <p>{contactInfo.whatsapp || '+90 (532) 216 46 68'}</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">📱</div>
              <div className="contact-content">
                <h4>GSM</h4>
                <p>{contactInfo.gsm || '+90 212 555 12 34'}</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">✉️</div>
              <div className="contact-content">
                <h4>Email Us</h4>
                <p>{contactInfo.email || 'info@arna.com.tr'}</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">📍</div>
              <div className="contact-content">
                <h4>Location</h4>
                <p>{contactInfo.address || 'Levent Mahallesi, Büyükdere Caddesi No:201 Şişli/İSTANBUL'}</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">🕒</div>
              <div className="contact-content">
                <h4>Working Hours</h4>
                <p>{contactInfo.working_hours || 'Monday - Friday: 09:00 - 18:00'}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="contact-form-column">
            <div className="form-header">
              <h3>Contact Form</h3>
              <div className="form-info">
                <i className="fas fa-info-circle"></i>
                <span>You can send us a message using the contact form</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Name *"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject *"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message *"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                ></textarea>
              </div>

              <div className="captcha-section">
                <div className="captcha-display">
                  <span>{captcha}</span>
                </div>
                <button 
                  type="button" 
                  onClick={generateCaptcha}
                  className="captcha-refresh-btn"
                  title="Refresh Captcha"
                >
                  🔄
                </button>
                <input
                  type="text"
                  placeholder="Captcha"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="captcha-input"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SENDING...' : 'SEND'}
              </button>

              {submitStatus === 'success' && (
                <div className="success-message">
                  Your message has been sent successfully! We will get back to you as soon as possible.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="error-message">
                  An error occurred while sending the message. Please try again.
                </div>
              )}

              {submitStatus === 'captcha_error' && (
                <div className="error-message">
                  Captcha verification failed. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Contact;
