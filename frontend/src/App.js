import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import ContactPage from './pages/ContactPage';
import ProductDetail from './pages/ProductDetail';
import ProjectDetail from './pages/ProjectDetail';
import NewsInsightDetail from './pages/NewsInsightDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboardNew';
import FrontendApiTest from './components/FrontendApiTest';

// Remove GSAP animations, using Framer Motion instead
import './App.css';

function App() {
  useEffect(() => {
    // Sayfa yüklendiğinde veya yenilendiğinde en başa scroll
    window.scrollTo(0, 0);
    
    // Sayfa yenilendiğinde de scroll'u sıfırla
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/project-detail/:id" element={<ProjectDetail />} />
            <Route path="/news-insight-detail/:id" element={<NewsInsightDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/test" element={<FrontendApiTest />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
