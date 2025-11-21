import React, { useEffect } from 'react';
import Header from '../components/Header';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const ContactPage = () => {
  useEffect(() => {
    // Ensure page loads at top
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="contact-page smooth-enter">
      <Header />
      <Contact />
      <Footer />
    </div>
  );
};

export default ContactPage;
