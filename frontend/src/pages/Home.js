import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HeroStats from '../components/HeroStats';
import Leadership from '../components/Leadership';
import Projects from '../components/Projects';
import NewsInsight from '../components/NewsInsight';
import BrandTrust from '../components/BrandTrust';
import WhoWeAre from '../components/WhoWeAre';
import PreserveConserve from '../components/PreserveConserve';
import ValueSection from '../components/ValueSection';
import Statistics from '../components/Statistics';
import OurProducts from '../components/OurProducts';
import FAQ from '../components/FAQ';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

const Home = () => {
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    // Ensure page loads at top
    window.scrollTo(0, 0);
    
    // Prevent layout shifts during initial render
    const handlePageReady = () => {
      // Wait for critical components to mount
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsPageReady(true);
        });
      });
    };

    // Handle different document ready states
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handlePageReady);
    } else {
      handlePageReady();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', handlePageReady);
    };
  }, []);

  return (
    <div className={`home-page smooth-enter ${isPageReady ? 'page-ready' : 'page-loading'}`}>
      <Header />
      <div id="home">
        <Hero />
      </div>
      <BrandTrust />
      <div id="about">
        <WhoWeAre />
      </div>
      {isPageReady && (
        <>
          <PreserveConserve />
          <OurProducts />
          <Statistics />
          <div id="projects">
            <Projects />
          </div>
          <ValueSection />
          <HeroStats />
          <Leadership />
          <FAQ />
          <NewsInsight />
          <Newsletter />
          <div id="footer">
            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
