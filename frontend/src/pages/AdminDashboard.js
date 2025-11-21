import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiGetAuth, apiPutAuth, apiPostAuth, apiDeleteAuth } from '../utils/api';
import { normalizeImageUrl } from '../config/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('hero-slides');
  const [heroSlides, setHeroSlides] = useState([]);
  const [heroFeatures, setHeroFeatures] = useState([]);
  const [brandLogos, setBrandLogos] = useState([]);
  const [brandContent, setBrandContent] = useState(null);
  const [whoWeAreContent, setWhoWeAreContent] = useState(null);
  const [whoWeAreFeatures, setWhoWeAreFeatures] = useState([]);
  const [preserveConserveContent, setPreserveConserveContent] = useState(null);
  const [preserveConserveFeatures, setPreserveConserveFeatures] = useState([]);
  const [servicesContent, setServicesContent] = useState(null);
  const [services, setServices] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [mapPoints, setMapPoints] = useState([]);
  const [globalPresenceContent, setGlobalPresenceContent] = useState(null);
  const [valueContent, setValueContent] = useState(null);
  const [valueStatistics, setValueStatistics] = useState([]);
  const [letsBeGreatContent, setLetsBeGreatContent] = useState(null);
  const [letsBeGreatStatistics, setLetsBeGreatStatistics] = useState([]);
  const [heroStatsStatistics, setHeroStatsStatistics] = useState([]);
  
  // Leadership states
  const [leadershipContent, setLeadershipContent] = useState(null);
  const [leadershipMembers, setLeadershipMembers] = useState([]);
  const [showLeadershipContentForm, setShowLeadershipContentForm] = useState(false);
  const [showLeadershipMemberForm, setShowLeadershipMemberForm] = useState(false);
  const [editingLeadershipContent, setEditingLeadershipContent] = useState(null);
  const [editingLeadershipMember, setEditingLeadershipMember] = useState(null);

  // Projects states
  const [projectsContent, setProjectsContent] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showProjectsContentForm, setShowProjectsContentForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProjectsContent, setEditingProjectsContent] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // NewsInsight states
  const [newsInsightContent, setNewsInsightContent] = useState(null);
  const [newsInsightArticles, setNewsInsightArticles] = useState([]);
  const [showNewsInsightContentForm, setShowNewsInsightContentForm] = useState(false);
  const [showNewsInsightArticleForm, setShowNewsInsightArticleForm] = useState(false);
  const [editingNewsInsightContent, setEditingNewsInsightContent] = useState(null);
  const [editingNewsInsightArticle, setEditingNewsInsightArticle] = useState(null);

  // Newsletter states
  const [newsletter, setNewsletter] = useState(null);
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState([]);
  const [showNewsletterForm, setShowNewsletterForm] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState(null);

  // Contact Info states
  const [contactInfo, setContactInfo] = useState(null);
  const [showContactInfoForm, setShowContactInfoForm] = useState(false);
  const [editingContactInfo, setEditingContactInfo] = useState(null);

  // Footer Info states
  const [footerInfo, setFooterInfo] = useState(null);
  const [showFooterInfoForm, setShowFooterInfoForm] = useState(false);
  const [editingFooterInfo, setEditingFooterInfo] = useState(null);

  // Contact Messages states
  const [contactMessages, setContactMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadSubscriptions, setUnreadSubscriptions] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSlideForm, setShowSlideForm] = useState(false);
  const [showFeatureForm, setShowFeatureForm] = useState(false);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showBrandContentForm, setShowBrandContentForm] = useState(false);
  const [showWhoWeAreContentForm, setShowWhoWeAreContentForm] = useState(false);
  const [showWhoWeAreFeatureForm, setShowWhoWeAreFeatureForm] = useState(false);
  const [showPreserveConserveContentForm, setShowPreserveConserveContentForm] = useState(false);
  const [showPreserveConserveFeatureForm, setShowPreserveConserveFeatureForm] = useState(false);
  const [showServicesContentForm, setShowServicesContentForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showStatisticsForm, setShowStatisticsForm] = useState(false);
  const [showMapPointsForm, setShowMapPointsForm] = useState(false);
  const [showGlobalPresenceContentForm, setShowGlobalPresenceContentForm] = useState(false);
  const [showValueContentForm, setShowValueContentForm] = useState(false);
  const [showValueStatisticsForm, setShowValueStatisticsForm] = useState(false);
  const [showLetsBeGreatContentForm, setShowLetsBeGreatContentForm] = useState(false);
  const [showLetsBeGreatStatisticsForm, setShowLetsBeGreatStatisticsForm] = useState(false);
  const [showHeroStatsStatisticsForm, setShowHeroStatsStatisticsForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [editingFeature, setEditingFeature] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);
  const [editingBrandContent, setEditingBrandContent] = useState(null);
  const [editingWhoWeAreContent, setEditingWhoWeAreContent] = useState(null);
  const [editingWhoWeAreFeature, setEditingWhoWeAreFeature] = useState(null);
  const [editingPreserveConserveContent, setEditingPreserveConserveContent] = useState(null);
  const [editingPreserveConserveFeature, setEditingPreserveConserveFeature] = useState(null);
  const [editingServicesContent, setEditingServicesContent] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editingStatistic, setEditingStatistic] = useState(null);
  const [editingMapPoint, setEditingMapPoint] = useState(null);
  const [editingGlobalPresenceContent, setEditingGlobalPresenceContent] = useState(null);
  const [editingValueContent, setEditingValueContent] = useState(null);
  const [editingValueStatistic, setEditingValueStatistic] = useState(null);
  const [editingLetsBeGreatContent, setEditingLetsBeGreatContent] = useState(null);
  const [editingLetsBeGreatStatistic, setEditingLetsBeGreatStatistic] = useState(null);
  const [editingHeroStatsStatistic, setEditingHeroStatsStatistic] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  // Auth kontrolü
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Hero slides'ları yükle
  const loadHeroSlides = async () => {
    try {
      const data = await apiGetAuth('api/hero-slides/admin');
      if (!data.error) {
        setHeroSlides(data);
      }
      } catch (error) {
      console.error('Error loading hero slides:', error);
    }
  };

  // Hero features'ları yükle
  const loadHeroFeatures = async () => {
    try {
      const data = await apiGetAuth('api/hero-features/admin');
      if (!data.error) {
        setHeroFeatures(data);
      }
      } catch (error) {
      console.error('Error loading hero features:', error);
    }
  };

  // Brand logos'ları yükle
  const loadBrandLogos = async () => {
    try {
      const data = await apiGetAuth('api/brand-trust');
      if (!data.error && Array.isArray(data)) {
        setBrandLogos(data);
      }
    } catch (error) {
      console.error('Error loading brand logos:', error);
    }
  };

  // Brand content'i yükle
  const loadBrandContent = async () => {
    try {
      const data = await apiGetAuth('api/brand-trust-content');
      if (!data.error && data) {
        setBrandContent(data);
      }
    } catch (error) {
      console.error('Error loading brand content:', error);
    }
  };

  // Who We Are content'i yükle
  const loadWhoWeAreContent = async () => {
    try {
      console.log('🔍 Loading Who We Are content...');
      const data = await apiGetAuth('api/who-we-are-content/admin');
      console.log('📊 Who We Are content API response:', data);
      if (!data.error && data) {
        setWhoWeAreContent(data);
        console.log('✅ Who We Are content loaded successfully');
      } else {
        console.log('❌ Error in Who We Are content response:', data);
        setWhoWeAreContent(null);
      }
    } catch (error) {
      console.error('Error loading who we are content:', error);
      setWhoWeAreContent(null);
    }
  };

  // Who We Are features'ları yükle
  const loadWhoWeAreFeatures = async () => {
    try {
      console.log('🔍 Loading Who We Are features...');
      const data = await apiGetAuth('api/who-we-are-features/admin');
      console.log('📊 Who We Are features API response:', data);
      if (!data.error && data) {
        setWhoWeAreFeatures(data);
        console.log('✅ Who We Are features loaded successfully');
      } else {
        console.log('❌ Error in Who We Are features response:', data);
        setWhoWeAreFeatures([]);
      }
    } catch (error) {
      console.error('Error loading who we are features:', error);
      setWhoWeAreFeatures([]);
    }
  };

  // Preserve & Conserve content'ı yükle
  const loadPreserveConserveContent = async () => {
    try {
      const data = await apiGetAuth('/api/preserve-conserve/admin/content');
      if (!data.error) {
        setPreserveConserveContent(data[0] || null);
      }
    } catch (error) {
      console.error('Error loading preserve & conserve content:', error);
    }
  };

  // Preserve & Conserve features'ları yükle
  const loadPreserveConserveFeatures = async () => {
    try {
      const data = await apiGetAuth('/api/preserve-conserve/admin/features');
      if (!data.error) {
        setPreserveConserveFeatures(data);
      }
    } catch (error) {
      console.error('Error loading preserve & conserve features:', error);
    }
  };

  // Services content'ı yükle
  const loadServicesContent = async () => {
    try {
      const data = await apiGetAuth('api/services/admin/content');
      if (!data.error) {
        setServicesContent(data);
      }
    } catch (error) {
      console.error('Error loading services content:', error);
    }
  };

  // Services'ları yükle
  const loadServices = async () => {
    try {
      const data = await apiGetAuth('api/services/admin/services');
      if (!data.error) {
        setServices(data);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      const data = await apiGetAuth('api/statistics/admin');
      if (!data.error) {
        setStatistics(data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const loadMapPoints = async () => {
    try {
      const data = await apiGetAuth('api/map-points/admin');
      if (!data.error) {
        setMapPoints(data);
      }
    } catch (error) {
      console.error('Error loading map points:', error);
    }
  };

  const loadGlobalPresenceContent = async () => {
    try {
      const data = await apiGetAuth('api/global-presence/admin/content');
      if (!data.error) {
        setGlobalPresenceContent(data);
      }
    } catch (error) {
      console.error('Error loading global presence content:', error);
    }
  };

  const loadValueContent = async () => {
    try {
      console.log('🔄 Loading value content...');
      const data = await apiGet('/api/value-section/admin/content');
      console.log('✅ Value content loaded:', data);
      if (data.error) {
        console.error('❌ Error in response:', data.error);
        setValueContent(null);
      } else {
        setValueContent(data);
      }
    } catch (error) {
      console.error('❌ Error loading value content:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      setValueContent(null);
    }
  };

  const loadValueStatistics = async () => {
    try {
      console.log('🔄 Loading value statistics...');
      const data = await apiGet('/api/value-section/admin/statistics');
      console.log('✅ Value statistics loaded:', data);
      if (data.error) {
        console.error('❌ Error in response:', data.error);
        setValueStatistics([]);
      } else {
        setValueStatistics(data);
      }
    } catch (error) {
      console.error('❌ Error loading value statistics:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      setValueStatistics([]);
    }
  };

  const loadLetsBeGreatContent = async () => {
    try {
      const data = await apiGetAuth('api/lets-be-great-content/admin');
      if (!data.error) {
        setLetsBeGreatContent(data);
      }
    } catch (error) {
      console.error('Error loading lets be great content:', error);
    }
  };

  const loadLetsBeGreatStatistics = async () => {
    try {
      const data = await apiGetAuth('api/lets-be-great-statistics/admin');
      if (!data.error) {
        setLetsBeGreatStatistics(data);
      }
    } catch (error) {
      console.error('Error loading lets be great statistics:', error);
    }
  };

  const loadHeroStatsStatistics = async () => {
    try {
      const data = await apiGetAuth('api/lets-be-great-statistics/admin');
      if (!data.error) {
        setHeroStatsStatistics(data);
      }
    } catch (error) {
      console.error('Error loading hero stats statistics:', error);
    }
  };

  const loadLeadershipContent = async () => {
    try {
      const data = await apiGetAuth('api/leadership-content/admin');
      if (!data.error) {
        setLeadershipContent(data);
      }
    } catch (error) {
      console.error('Error loading leadership content:', error);
    }
  };

  const loadLeadershipMembers = async () => {
    try {
      const data = await apiGetAuth('api/leadership-members/admin');
      if (!data.error) {
        setLeadershipMembers(data);
      }
    } catch (error) {
      console.error('Error loading leadership members:', error);
    }
  };

  // Projects load functions
  const loadProjectsContent = async () => {
    try {
      const data = await apiGetAuth('api/projects-content/admin');
      if (!data.error) {
        setProjectsContent(data);
      }
    } catch (error) {
      console.error('Error loading projects content:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await apiGetAuth('api/projects/admin');
      if (!data.error) {
        setProjects(data);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  // NewsInsight load functions
  const loadNewsInsightContent = async () => {
    try {
      const data = await apiGetAuth('api/news-insight-content/admin');
      if (!data.error) {
        setNewsInsightContent(data);
      }
    } catch (error) {
      console.error('Error loading news insight content:', error);
    }
  };

  const loadNewsInsightArticles = async () => {
    try {
      const data = await apiGetAuth('api/news-insight-articles/admin');
      if (!data.error) {
        setNewsInsightArticles(data);
      }
    } catch (error) {
      console.error('Error loading news insight articles:', error);
    }
  };

  // Newsletter load functions
  const loadNewsletter = async () => {
    try {
      const data = await apiGetAuth('api/newsletter/admin');
      if (!data.error) {
        setNewsletter(data);
      }
    } catch (error) {
      console.error('Error loading newsletter:', error);
    }
  };

  const loadNewsletterSubscriptions = async () => {
    try {
      const data = await apiGetAuth('api/newsletter/subscriptions/admin');
      if (!data.error) {
        setNewsletterSubscriptions(data);
      }
    } catch (error) {
      console.error('Error loading newsletter subscriptions:', error);
    }
  };

  // Contact Info load functions
  const loadContactInfo = async () => {
    try {
      const data = await apiGetAuth('api/contact-info/admin');
      if (!data.error) {
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
    }
  };

  // Footer Info load functions
  const loadFooterInfo = async () => {
    try {
      const data = await apiGetAuth('api/footer-info/admin');
      if (!data.error) {
        setFooterInfo(data);
      }
    } catch (error) {
      console.error('Error loading footer info:', error);
    }
  };

  // Contact Messages load functions
  const loadContactMessages = async () => {
    try {
      const data = await apiGetAuth('api/contact-messages/admin');
      if (!data.error) {
        setContactMessages(data);
        // Count unread messages
        const unread = data.filter(msg => !msg.is_read).length;
        setUnreadMessages(unread);
      }
    } catch (error) {
      console.error('Error loading contact messages:', error);
    }
  };

  // Load notification counts
  const loadNotificationCounts = async () => {
    try {
      const [messagesData, subscriptionsData] = await Promise.all([
        apiGetAuth('api/contact-messages/admin'),
        apiGetAuth('api/newsletter/subscriptions/admin')
      ]);
      
      if (!messagesData.error) {
        const unread = messagesData.filter(msg => !msg.is_read).length;
        setUnreadMessages(unread);
      }
      
      if (!subscriptionsData.error) {
        setUnreadSubscriptions(subscriptionsData.length);
      }
      } catch (error) {
      console.error('Error loading notification counts:', error);
    }
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-buttons')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Update notification counts periodically (disabled for now to prevent 404 errors)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     loadNotificationCounts();
  //   }, 30000); // Update every 30 seconds

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    // Load notification counts on component mount
    loadNotificationCounts();
    
    if (activeTab === 'hero-slides') {
      loadHeroSlides();
    } else if (activeTab === 'hero-features') {
      loadHeroFeatures();
    } else if (activeTab === 'brand-logos') {
      loadBrandLogos();
      loadBrandContent();
    } else if (activeTab === 'who-we-are') {
      loadWhoWeAreContent();
      loadWhoWeAreFeatures();
    } else if (activeTab === 'preserve-conserve-content') {
      loadPreserveConserveContent();
    } else if (activeTab === 'preserve-conserve-features') {
      loadPreserveConserveFeatures();
    } else if (activeTab === 'services') {
      loadServicesContent();
      loadServices();
    } else if (activeTab === 'statistics') {
      loadStatistics();
    } else if (activeTab === 'map-points') {
      loadMapPoints();
    } else if (activeTab === 'global-presence') {
      loadGlobalPresenceContent();
    } else if (activeTab === 'value-section') {
      loadValueContent();
    } else if (activeTab === 'value-statistics') {
      loadValueStatistics();
    } else if (activeTab === 'lets-be-great-content') {
      loadLetsBeGreatContent();
    } else if (activeTab === 'lets-be-great-statistics') {
      loadLetsBeGreatStatistics();
    } else if (activeTab === 'hero-stats-statistics') {
      loadHeroStatsStatistics();
    } else if (activeTab === 'leadership-content') {
      loadLeadershipContent();
    } else if (activeTab === 'leadership-members') {
      loadLeadershipMembers();
    } else if (activeTab === 'projects-content') {
      loadProjectsContent();
    } else if (activeTab === 'projects') {
      loadProjects();
    } else if (activeTab === 'news-insight-content') {
      loadNewsInsightContent();
    } else if (activeTab === 'news-insight-articles') {
      loadNewsInsightArticles();
    } else if (activeTab === 'newsletter') {
      loadNewsletter();
    } else if (activeTab === 'newsletter-subscriptions') {
      loadNewsletterSubscriptions();
    } else if (activeTab === 'contact-info') {
      loadContactInfo();
    } else if (activeTab === 'footer-info') {
      loadFooterInfo();
    } else if (activeTab === 'contact-messages') {
      loadContactMessages();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const toggleSlideStatus = async (id) => {
    try {
      const data = await apiPutAuth(`api/hero-slides/${id}/toggle`, {});
      if (!data.error) {
        loadHeroSlides();
      }
    } catch (error) {
      console.error('Error toggling slide:', error);
    }
  };

  const toggleFeatureStatus = async (id) => {
    try {
      const data = await apiPutAuth(`api/hero-features/${id}/toggle`, {});
      if (!data.error) {
        loadHeroFeatures();
      }
      } catch (error) {
      console.error('Error toggling feature:', error);
    }
  };

  // Image upload handler
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      const data = await response.json();
      if (data.imageUrl) {
        return data.imageUrl;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    return null;
  };

  // Image preview handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Slide form handlers
  const handleSlideSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    // is_active değerini düzelt
    form.set("is_active", form.get("is_active") === "on" ? 1 : 0);

    // Resim varsa ekle
    if (selectedImage) {
      form.append("image", selectedImage);
    }

    try {
      if (editingSlide) {
        await apiPutAuth(`api/hero-slides/${editingSlide.id}`, form, true);
      } else {
        await apiPostAuth("api/hero-slides", form, true);
      }

      setShowSlideForm(false);
      setEditingSlide(null);
      setSelectedImage(null);
      setImagePreview(null);
      loadHeroSlides();
    } catch (error) {
      console.error("Error saving slide:", error);
    }
  };

  // Feature form handlers
  const handleFeatureSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    // is_active değerini düzelt
    form.set("is_active", form.get("is_active") === "on" ? 1 : 0);

    try {
      if (editingFeature) {
        await apiPutAuth(`api/hero-features/${editingFeature.id}`, form, true);
      } else {
        await apiPostAuth("api/hero-features", form, true);
      }

      setShowFeatureForm(false);
      setEditingFeature(null);
      loadHeroFeatures();
    } catch (error) {
      console.error("Error saving feature:", error);
    }
  };

  // Delete handlers
  const deleteSlide = async (id) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      try {
        await apiDeleteAuth(`api/hero-slides/${id}`);
        loadHeroSlides();
      } catch (error) {
        console.error('Error deleting slide:', error);
      }
    }
  };

  const deleteFeature = async (id) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      try {
        await apiDeleteAuth(`api/hero-features/${id}`);
        loadHeroFeatures();
      } catch (error) {
        console.error('Error deleting feature:', error);
      }
    }
  };

  // Edit handlers
  const editSlide = (slide) => {
    setEditingSlide(slide);
    setShowSlideForm(true);
  };

  const editFeature = (feature) => {
    setEditingFeature(feature);
    setShowFeatureForm(true);
  };

  // Brand logo handlers
  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    // is_active değerini düzelt
    form.set("is_active", form.get("is_active") === "on" ? 1 : 0);

    // Resim varsa ekle
    if (selectedImage) {
      form.append("image", selectedImage);
    }

    try {
      if (editingBrand) {
        await apiPutAuth(`api/brand-trust/${editingBrand.id}`, form, true);
      } else {
        await apiPostAuth("api/brand-trust", form, true);
      }

      setShowBrandForm(false);
      setEditingBrand(null);
      setSelectedImage(null);
      setImagePreview(null);
      loadBrandLogos();
    } catch (error) {
      console.error("Error saving brand logo:", error);
    }
  };

  const deleteBrand = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand logo?')) {
      try {
        await apiDeleteAuth(`api/brand-trust/${id}`);
        loadBrandLogos();
      } catch (error) {
        console.error('Error deleting brand logo:', error);
      }
    }
  };

  const editBrand = (brand) => {
    setEditingBrand(brand);
    setShowBrandForm(true);
  };

  // Brand content handlers
  const handleBrandContentSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    // is_active değerini düzelt
    form.set("is_active", form.get("is_active") === "on" ? 1 : 0);

    try {
      if (editingBrandContent) {
        await apiPutAuth(`api/brand-trust-content/${editingBrandContent.id}`, form, true);
      } else {
        await apiPostAuth("api/brand-trust-content", form, true);
      }

      setShowBrandContentForm(false);
      setEditingBrandContent(null);
      loadBrandContent();
    } catch (error) {
      console.error("Error saving brand content:", error);
    }
  };

  const editBrandContent = (content) => {
    setEditingBrandContent(content);
    setShowBrandContentForm(true);
  };

  // Who We Are handlers
  const handleWhoWeAreContentSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    // is_active değerini düzelt
    form.set("is_active", form.get("is_active") === "on" ? 1 : 0);

    // Resim varsa ekle
    if (selectedImage) {
      form.append("image", selectedImage);
    }

    try {
      console.log('💾 Submitting Who We Are content...', {
        editing: !!editingWhoWeAreContent,
        id: editingWhoWeAreContent?.id
      });
      
      let response;
      if (editingWhoWeAreContent) {
        response = await apiPutAuth(`api/who-we-are-content/${editingWhoWeAreContent.id}`, form, true);
      } else {
        response = await apiPostAuth("api/who-we-are-content", form, true);
      }
      
      console.log('📊 Who We Are content submit response:', response);

      setShowWhoWeAreContentForm(false);
      setEditingWhoWeAreContent(null);
      setSelectedImage(null);
      setImagePreview(null);
      loadWhoWeAreContent();
    } catch (error) {
      console.error("Error saving who we are content:", error);
    }
  };

  const handleWhoWeAreFeatureSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    // is_active değerini düzelt
    form.set("is_active", form.get("is_active") === "on" ? 1 : 0);

    try {
      console.log('💾 Submitting Who We Are feature...', {
        editing: !!editingWhoWeAreFeature,
        id: editingWhoWeAreFeature?.id
      });
      
      let response;
      if (editingWhoWeAreFeature) {
        response = await apiPutAuth(`api/who-we-are-features/${editingWhoWeAreFeature.id}`, form, true);
      } else {
        response = await apiPostAuth("api/who-we-are-features", form, true);
      }
      
      console.log('📊 Who We Are feature submit response:', response);

      setShowWhoWeAreFeatureForm(false);
      setEditingWhoWeAreFeature(null);
      loadWhoWeAreFeatures();
    } catch (error) {
      console.error("Error saving who we are feature:", error);
    }
  };

  const deleteWhoWeAreFeature = async (id) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      try {
        await apiDeleteAuth(`api/who-we-are-features/${id}`);
        loadWhoWeAreFeatures();
      } catch (error) {
        console.error('Error deleting who we are feature:', error);
      }
    }
  };

  const editWhoWeAreContent = (content) => {
    setEditingWhoWeAreContent(content);
    setShowWhoWeAreContentForm(true);
  };

  const editWhoWeAreFeature = (feature) => {
    setEditingWhoWeAreFeature(feature);
    setShowWhoWeAreFeatureForm(true);
  };

  // Preserve & Conserve handlers
  const handlePreserveConserveContentSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    // is_active değerini düzelt
    form.set("is_active", form.get("is_active") === "on" ? 1 : 0);

    // Resim varsa ekle
    if (selectedImage) {
      form.append("background_image", selectedImage);
    }

    try {
      if (editingPreserveConserveContent) {
        await apiPutAuth(`/api/preserve-conserve/admin/content/${editingPreserveConserveContent.id}`, form, true);
      } else {
        await apiPostAuth("/api/preserve-conserve/admin/content", form, true);
      }

      setShowPreserveConserveContentForm(false);
      setEditingPreserveConserveContent(null);
      setSelectedImage(null);
      setImagePreview(null);
      loadPreserveConserveContent();
    } catch (error) {
      console.error("Error saving preserve & conserve content:", error);
    }
  };

  const handlePreserveConserveFeatureSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Handle file upload for icon
    if (selectedImage) {
      formData.append('icon', selectedImage);
    }

    const featureData = {
      title: formData.get('title'),
      description: formData.get('description'),
      display_order: parseInt(formData.get('display_order')),
      is_active: formData.get('is_active') === 'on'
    };

    try {
      if (editingPreserveConserveFeature) {
        await apiPutAuth(`/api/preserve-conserve/admin/features/${editingPreserveConserveFeature.id}`, featureData, true);
      } else {
        await apiPostAuth('/api/preserve-conserve/admin/features', featureData, true);
      }

      setShowPreserveConserveFeatureForm(false);
      setEditingPreserveConserveFeature(null);
      setSelectedImage(null);
      setImagePreview(null);
      loadPreserveConserveFeatures();
    } catch (error) {
      console.error('Error saving preserve & conserve feature:', error);
    }
  };

  const deletePreserveConserveFeature = async (id) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      try {
        await apiDeleteAuth(`/api/preserve-conserve/admin/features/${id}`);
        loadPreserveConserveFeatures();
      } catch (error) {
        console.error('Error deleting preserve & conserve feature:', error);
      }
    }
  };

  const editPreserveConserveContent = (content) => {
    setEditingPreserveConserveContent(content);
    setShowPreserveConserveContentForm(true);
  };

  const editPreserveConserveFeature = (feature) => {
    setEditingPreserveConserveFeature(feature);
    setShowPreserveConserveFeatureForm(true);
  };

  // Services handlers
  const handleServicesContentSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const contentData = {
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      description: formData.get('description'),
      is_active: formData.get('is_active') === 'on'
    };

    try {
      if (editingServicesContent) {
        await apiPutAuth(`api/services/admin/content/${editingServicesContent.id}`, contentData);
      }

      setShowServicesContentForm(false);
      setEditingServicesContent(null);
      loadServicesContent();
      
      // Notify frontend components about the update
      localStorage.setItem('servicesUpdated', Date.now().toString());
      window.dispatchEvent(new CustomEvent('servicesUpdated'));
    } catch (error) {
      console.error('Error saving services content:', error);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    // is_active değerini düzelt
    const isActiveValue = form.get("is_active") === "on" ? 1 : 0;
    form.set("is_active", isActiveValue);
    
    console.log('🔧 Service Submit - is_active checkbox value:', form.get("is_active"));
    console.log('🔧 Service Submit - is_active processed:', isActiveValue);
    console.log('🔧 Service Submit - is editing:', !!editingService);

    // Resim varsa ekle
    if (selectedImage) {
      form.append("image", selectedImage);
    }

    try {
      if (editingService) {
        await apiPutAuth(`api/services/admin/services/${editingService.id}`, form, true);
      } else {
        await apiPostAuth("api/services/admin/services", form, true);
      }

      setShowServiceForm(false);
      setEditingService(null);
      setSelectedImage(null);
      setImagePreview(null);
      loadServices();
      
      // Notify frontend components about the update
      localStorage.setItem('servicesUpdated', Date.now().toString());
      window.dispatchEvent(new CustomEvent('servicesUpdated'));
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const deleteService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await apiDeleteAuth(`api/services/admin/services/${id}`);
        loadServices();
        
        // Notify frontend components about the update
        localStorage.setItem('servicesUpdated', Date.now().toString());
        window.dispatchEvent(new CustomEvent('servicesUpdated'));
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const editServicesContent = (content) => {
    setEditingServicesContent(content);
    setShowServicesContentForm(true);
  };

  const editService = (service) => {
    setEditingService(service);
    setShowServiceForm(true);
  };

  // Statistics handlers
  const handleStatisticSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const statisticData = {
      title: formData.get('title'),
      value: formData.get('value'),
      description: formData.get('description'),
      icon: formData.get('icon'),
      display_order: parseInt(formData.get('display_order')) || 1,
      is_active: formData.get('is_active') === 'on'
    };

    try {
      if (editingStatistic) {
        await apiPutAuth(`api/statistics/${editingStatistic.id}`, statisticData);
      } else {
        await apiPostAuth('api/statistics', statisticData);
      }
      loadStatistics();
      setShowStatisticsForm(false);
      setEditingStatistic(null);
    } catch (error) {
      console.error('Error saving statistic:', error);
    }
  };

  const deleteStatistic = async (id) => {
    if (window.confirm('Are you sure you want to delete this statistic?')) {
      try {
        await apiDeleteAuth(`api/statistics/${id}`);
        loadStatistics();
      } catch (error) {
        console.error('Error deleting statistic:', error);
      }
    }
  };

  const editStatistic = (statistic) => {
    setEditingStatistic(statistic);
    setShowStatisticsForm(true);
  };

  // Map Points handlers
  const handleMapPointSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const mapPointData = {
      title: formData.get('title'),
      description: formData.get('description'),
      latitude: parseFloat(formData.get('latitude')),
      longitude: parseFloat(formData.get('longitude')),
      marker_type: formData.get('marker_type'),
      display_order: parseInt(formData.get('display_order')) || 1,
      is_active: formData.get('is_active') === 'on'
    };

    try {
      if (editingMapPoint) {
        await apiPutAuth(`api/map-points/${editingMapPoint.id}`, mapPointData);
      } else {
        await apiPostAuth('api/map-points', mapPointData);
      }
      loadMapPoints();
      setShowMapPointsForm(false);
      setEditingMapPoint(null);
    } catch (error) {
      console.error('Error saving map point:', error);
    }
  };

  const deleteMapPoint = async (id) => {
    if (window.confirm('Are you sure you want to delete this map point?')) {
      try {
        await apiDeleteAuth(`api/map-points/${id}`);
        loadMapPoints();
      } catch (error) {
        console.error('Error deleting map point:', error);
      }
    }
  };

  const editMapPoint = (mapPoint) => {
    setEditingMapPoint(mapPoint);
    setShowMapPointsForm(true);
  };

  // Global Presence Content handlers
  const handleGlobalPresenceContentSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const contentData = {
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      description: formData.get('description'),
      is_active: formData.get('is_active') === 'on'
    };

    try {
      if (editingGlobalPresenceContent) {
        await apiPutAuth(`api/global-presence-content/${editingGlobalPresenceContent.id}`, contentData);
      }
      loadGlobalPresenceContent();
      setShowGlobalPresenceContentForm(false);
      setEditingGlobalPresenceContent(null);
    } catch (error) {
      console.error('Error saving global presence content:', error);
    }
  };

  // Our Value Content handlers
  const handleValueContentSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Add image file if selected
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
    
    // Add other fields
    formData.append('subtitle', formData.get('subtitle'));
    formData.append('title', formData.get('title'));
    formData.append('description', formData.get('description'));
    formData.append('is_active', formData.get('is_active') === 'on');

    try {
      if (editingValueContent) {
        await apiPutAuth(`api/value-content/${editingValueContent.id}`, formData);
      } else {
        await apiPostAuth('api/value-content', formData);
      }
      loadValueContent();
      setShowValueContentForm(false);
      setEditingValueContent(null);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error saving value content:', error);
    }
  };

  const editValueContent = (content) => {
    setEditingValueContent(content);
    setShowValueContentForm(true);
  };

  // Our Value Statistics handlers
  const handleValueStatisticSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const statData = {
      title: formData.get('title'),
      percentage: parseInt(formData.get('percentage')),
      display_order: parseInt(formData.get('display_order')),
      is_active: formData.get('is_active') === 'on'
    };

    try {
      if (editingValueStatistic) {
        await apiPutAuth(`/api/value-section/admin/statistics/${editingValueStatistic.id}`, statData);
      } else {
        await apiPostAuth('/api/value-section/admin/statistics', statData);
      }
      loadValueStatistics();
      setShowValueStatisticsForm(false);
      setEditingValueStatistic(null);
    } catch (error) {
      console.error('Error saving value statistic:', error);
    }
  };

  const deleteValueStatistic = async (id) => {
    if (window.confirm('Are you sure you want to delete this value statistic?')) {
      try {
        await apiDeleteAuth(`/api/value-section/admin/statistics/${id}`);
        loadValueStatistics();
      } catch (error) {
        console.error('Error deleting value statistic:', error);
      }
    }
  };

  const editValueStatistic = (statistic) => {
    setEditingValueStatistic(statistic);
    setShowValueStatisticsForm(true);
  };

  const editGlobalPresenceContent = (content) => {
    setEditingGlobalPresenceContent(content);
    setShowGlobalPresenceContentForm(true);
  };


  const handleLetsBeGreatContentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      
      // Resim varsa ekle
      if (selectedImage) {
        formData.append("background_image", selectedImage);
      }
      
      if (editingLetsBeGreatContent) {
        await apiPutAuth(`api/lets-be-great-content/${editingLetsBeGreatContent.id}`, formData, true);
      } else {
        await apiPostAuth('api/lets-be-great-content', formData, true);
      }
      
      loadLetsBeGreatContent();
      setShowLetsBeGreatContentForm(false);
      setEditingLetsBeGreatContent(null);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error saving lets be great content:', error);
      setError('Failed to save lets be great content');
      } finally {
        setLoading(false);
      }
    };

  const handleLetsBeGreatStatisticsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      
      if (editingLetsBeGreatStatistic) {
        await apiPutAuth(`api/lets-be-great-statistics/${editingLetsBeGreatStatistic.id}`, formData);
      } else {
        await apiPostAuth('api/lets-be-great-statistics', formData);
      }
      
      loadLetsBeGreatStatistics();
      setShowLetsBeGreatStatisticsForm(false);
      setEditingLetsBeGreatStatistic(null);
    } catch (error) {
      console.error('Error saving lets be great statistic:', error);
      setError('Failed to save lets be great statistic');
    } finally {
      setLoading(false);
    }
  };

  const handleHeroStatsStatisticsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      
      if (editingHeroStatsStatistic) {
        await apiPutAuth(`api/lets-be-great-statistics/${editingHeroStatsStatistic.id}`, formData);
      } else {
        await apiPostAuth('api/lets-be-great-statistics', formData);
      }
      
      loadHeroStatsStatistics();
      setShowHeroStatsStatisticsForm(false);
      setEditingHeroStatsStatistic(null);
    } catch (error) {
      console.error('Error saving hero stats statistic:', error);
      setError('Failed to save hero stats statistic');
    } finally {
      setLoading(false);
    }
  };

  const deleteLetsBeGreatStatistic = async (id) => {
    if (window.confirm('Are you sure you want to delete this lets be great statistic?')) {
      try {
        await apiDeleteAuth(`api/lets-be-great-statistics/${id}`);
        loadLetsBeGreatStatistics();
      } catch (error) {
        console.error('Error deleting lets be great statistic:', error);
      }
    }
  };

  const deleteHeroStatsStatistic = async (id) => {
    if (window.confirm('Are you sure you want to delete this hero stats statistic?')) {
      try {
        await apiDeleteAuth(`api/lets-be-great-statistics/${id}`);
        loadHeroStatsStatistics();
      } catch (error) {
        console.error('Error deleting hero stats statistic:', error);
      }
    }
  };

  const editLetsBeGreatStatistic = (statistic) => {
    setEditingLetsBeGreatStatistic(statistic);
    setShowLetsBeGreatStatisticsForm(true);
  };

  const editHeroStatsStatistic = (statistic) => {
    setEditingHeroStatsStatistic(statistic);
    setShowHeroStatsStatisticsForm(true);
  };

  const handleLeadershipContentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      
      if (editingLeadershipContent) {
        await apiPutAuth(`api/leadership-content/${editingLeadershipContent.id}`, formData, true);
      } else {
        await apiPostAuth('api/leadership-content', formData, true);
      }
      
      loadLeadershipContent();
      setShowLeadershipContentForm(false);
      setEditingLeadershipContent(null);
    } catch (error) {
      console.error('Error saving leadership content:', error);
      setError('Failed to save leadership content');
    } finally {
      setLoading(false);
    }
  };

  const handleLeadershipMemberSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      
      // Resim varsa ekle
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      
      if (editingLeadershipMember) {
        await apiPutAuth(`api/leadership-members/${editingLeadershipMember.id}`, formData, true);
      } else {
        await apiPostAuth('api/leadership-members', formData, true);
      }
      
      loadLeadershipMembers();
      setShowLeadershipMemberForm(false);
      setEditingLeadershipMember(null);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error saving leadership member:', error);
      setError('Failed to save leadership member');
    } finally {
      setLoading(false);
    }
  };

  const deleteLeadershipMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this leadership member?')) {
      try {
        await apiDeleteAuth(`api/leadership-members/${id}`);
        loadLeadershipMembers();
      } catch (error) {
        console.error('Error deleting leadership member:', error);
        setError('Failed to delete leadership member');
      }
    }
  };

  // Projects handlers
  const handleProjectsContentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      
      if (editingProjectsContent) {
        await apiPutAuth(`api/projects-content/${editingProjectsContent.id}`, formData, true);
      } else {
        await apiPostAuth('api/projects-content', formData, true);
      }
      
      loadProjectsContent();
      setShowProjectsContentForm(false);
      setEditingProjectsContent(null);
    } catch (error) {
      console.error('Error saving projects content:', error);
      setError('Failed to save projects content');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      
      // Resim varsa ekle
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      
      if (editingProject) {
        await apiPutAuth(`api/projects/${editingProject.id}`, formData, true);
      } else {
        await apiPostAuth('api/projects', formData, true);
      }
      
      loadProjects();
      setShowProjectForm(false);
      setEditingProject(null);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await apiDeleteAuth(`api/projects/${id}`);
        loadProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        setError('Failed to delete project');
      }
    }
  };

  // NewsInsight handlers
  const handleNewsInsightContentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      
      if (editingNewsInsightContent) {
        await apiPutAuth(`api/news-insight-content/${editingNewsInsightContent.id}`, formData, true);
      } else {
        await apiPostAuth('api/news-insight-content', formData, true);
      }
      
      loadNewsInsightContent();
      setShowNewsInsightContentForm(false);
      setEditingNewsInsightContent(null);
    } catch (error) {
      console.error('Error saving news insight content:', error);
      setError('Failed to save news insight content');
    } finally {
      setLoading(false);
    }
  };

  const handleNewsInsightArticleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      
      // Resim varsa ekle
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      
      if (editingNewsInsightArticle) {
        await apiPutAuth(`api/news-insight-articles/${editingNewsInsightArticle.id}`, formData, true);
      } else {
        await apiPostAuth('api/news-insight-articles', formData, true);
      }
      
      loadNewsInsightArticles();
      setShowNewsInsightArticleForm(false);
      setEditingNewsInsightArticle(null);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error saving news insight article:', error);
      setError('Failed to save news insight article');
    } finally {
      setLoading(false);
    }
  };

  const deleteNewsInsightArticle = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await apiDeleteAuth(`api/news-insight-articles/${id}`);
        loadNewsInsightArticles();
      } catch (error) {
        console.error('Error deleting news insight article:', error);
        setError('Failed to delete news insight article');
      }
    }
  };

  // Newsletter handlers
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      
      // Resim varsa ekle
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      
      if (editingNewsletter) {
        await apiPutAuth(`api/newsletter/${editingNewsletter.id}`, formData, true);
      } else {
        await apiPostAuth('api/newsletter', formData, true);
      }
      
      loadNewsletter();
      setShowNewsletterForm(false);
      setEditingNewsletter(null);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error saving newsletter:', error);
      setError('Failed to save newsletter');
    } finally {
      setLoading(false);
    }
  };

  // Contact Info handlers
  const handleContactInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      
      if (editingContactInfo) {
        await apiPutAuth(`api/contact-info/${editingContactInfo.id}`, formData, true);
      } else {
        await apiPostAuth('api/contact-info', formData, true);
      }
      
      loadContactInfo();
      setShowContactInfoForm(false);
      setEditingContactInfo(null);
    } catch (error) {
      console.error('Error saving contact info:', error);
      setError('Failed to save contact info');
    } finally {
      setLoading(false);
    }
  };

  // Footer Info handlers
  const handleFooterInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      
      if (editingFooterInfo) {
        await apiPutAuth(`api/footer-info/${editingFooterInfo.id}`, formData, true);
      } else {
        await apiPostAuth('api/footer-info', formData, true);
      }
      
      loadFooterInfo();
      setShowFooterInfoForm(false);
      setEditingFooterInfo(null);
    } catch (error) {
      console.error('Error saving footer info:', error);
      setError('Failed to save footer info');
    } finally {
      setLoading(false);
    }
  };

  // Contact Messages handlers
  const markMessageAsRead = async (id) => {
    try {
      await apiPutAuth(`api/contact-messages/${id}/read`);
      loadContactMessages();
      // Update notification counts
      loadNotificationCounts();
    } catch (error) {
      console.error('Error marking message as read:', error);
      setError('Failed to mark message as read');
    }
  };

  const deleteContactMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await apiDeleteAuth(`api/contact-messages/${id}`);
        loadContactMessages();
        // Update notification counts
        loadNotificationCounts();
      } catch (error) {
        console.error('Error deleting contact message:', error);
        setError('Failed to delete contact message');
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">A</div>
            <span>ARNA Admin</span>
          </div>
        </div>
        <div className="header-right">
          <div className="notification-buttons">
            <button 
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <span className="notification-icon">🔔</span>
              {(unreadMessages > 0 || unreadSubscriptions > 0) && (
                <span className="notification-badge">
                  {unreadMessages + unreadSubscriptions}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Notifications</h4>
                  <button 
                    className="close-notifications"
                    onClick={() => setShowNotifications(false)}
                  >
                    ×
                  </button>
          </div>
                
                <div className="notification-items">
                  <div 
                    className="notification-item"
                    onClick={() => {
                      setActiveTab('contact-messages');
                      setShowNotifications(false);
                    }}
                  >
                    <div className="notification-icon">📧</div>
                    <div className="notification-content">
                      <div className="notification-title">Contact Messages</div>
                      <div className="notification-count">
                        {unreadMessages} unread message{unreadMessages !== 1 ? 's' : ''}
                      </div>
                    </div>
                    {unreadMessages > 0 && <div className="unread-indicator"></div>}
                  </div>
                  
                  <div 
                    className="notification-item"
                    onClick={() => {
                      setActiveTab('newsletter-subscriptions');
                      setShowNotifications(false);
                    }}
                  >
                    <div className="notification-icon">📬</div>
                    <div className="notification-content">
                      <div className="notification-title">Newsletter Subscriptions</div>
                      <div className="notification-count">
                        {unreadSubscriptions} new subscription{unreadSubscriptions !== 1 ? 's' : ''}
                      </div>
                    </div>
                    {unreadSubscriptions > 0 && <div className="unread-indicator"></div>}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="sidebar">
          <nav className="admin-nav">
            <button 
              className={`nav-item ${activeTab === 'hero-slides' ? 'active' : ''}`}
              onClick={() => setActiveTab('hero-slides')}
            >
              Hero Slides
            </button>
            <button 
              className={`nav-item ${activeTab === 'hero-features' ? 'active' : ''}`}
              onClick={() => setActiveTab('hero-features')}
            >
              Hero Features
            </button>
            <button 
              className={`nav-item ${activeTab === 'brand-logos' ? 'active' : ''}`}
              onClick={() => setActiveTab('brand-logos')}
            >
              Brand Logos
            </button>
            <button 
              className={`nav-item ${activeTab === 'who-we-are' ? 'active' : ''}`}
              onClick={() => setActiveTab('who-we-are')}
            >
              Who We Are
            </button>
            <button 
              className={`nav-item ${activeTab === 'preserve-conserve-content' ? 'active' : ''}`}
              onClick={() => setActiveTab('preserve-conserve-content')}
            >
              Preserve & Conserve Content
            </button>
            <button 
              className={`nav-item ${activeTab === 'preserve-conserve-features' ? 'active' : ''}`}
              onClick={() => setActiveTab('preserve-conserve-features')}
            >
              Preserve & Conserve Features
            </button>
            <button 
              className={`nav-item ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              Services
            </button>
            <button 
              className={`nav-item ${activeTab === 'statistics' ? 'active' : ''}`}
              onClick={() => setActiveTab('statistics')}
            >
              Statistics
            </button>
            <button 
              className={`nav-item ${activeTab === 'map-points' ? 'active' : ''}`}
              onClick={() => setActiveTab('map-points')}
            >
              Map Points
            </button>
            <button 
              className={`nav-item ${activeTab === 'global-presence' ? 'active' : ''}`}
              onClick={() => setActiveTab('global-presence')}
            >
              Global Presence
            </button>
            <button 
              className={`nav-item ${activeTab === 'value-section' ? 'active' : ''}`}
              onClick={() => setActiveTab('value-section')}
            >
              Value Section
            </button>
            <button 
              className={`nav-item ${activeTab === 'value-statistics' ? 'active' : ''}`}
              onClick={() => setActiveTab('value-statistics')}
            >
              Value Statistics
            </button>
            <button 
              className={`nav-item ${activeTab === 'lets-be-great-content' ? 'active' : ''}`}
              onClick={() => setActiveTab('lets-be-great-content')}
            >
              Let's Be Great Content
            </button>
            <button 
              className={`nav-item ${activeTab === 'lets-be-great-statistics' ? 'active' : ''}`}
              onClick={() => setActiveTab('lets-be-great-statistics')}
            >
              Let's Be Great Statistics
            </button>
            <button 
              className={`nav-item ${activeTab === 'hero-stats-statistics' ? 'active' : ''}`}
              onClick={() => setActiveTab('hero-stats-statistics')}
            >
              Hero Stats Statistics
            </button>
            <button 
              className={`nav-item ${activeTab === 'leadership-content' ? 'active' : ''}`}
              onClick={() => setActiveTab('leadership-content')}
            >
              Leadership Content
            </button>
            <button 
              className={`nav-item ${activeTab === 'leadership-members' ? 'active' : ''}`}
              onClick={() => setActiveTab('leadership-members')}
            >
              Leadership Members
            </button>
            <button 
              className={`nav-item ${activeTab === 'projects-content' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects-content')}
            >
              Projects Content
            </button>
            <button 
              className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Projects
            </button>
            <button 
              className={`nav-item ${activeTab === 'news-insight-content' ? 'active' : ''}`}
              onClick={() => setActiveTab('news-insight-content')}
            >
              NewsInsight Content
            </button>
            <button 
              className={`nav-item ${activeTab === 'news-insight-articles' ? 'active' : ''}`}
              onClick={() => setActiveTab('news-insight-articles')}
            >
              NewsInsight Articles
            </button>
            <button 
              className={`nav-item ${activeTab === 'newsletter' ? 'active' : ''}`}
              onClick={() => setActiveTab('newsletter')}
            >
              Newsletter
            </button>
            <button 
              className={`nav-item ${activeTab === 'newsletter-subscriptions' ? 'active' : ''}`}
              onClick={() => setActiveTab('newsletter-subscriptions')}
            >
              Newsletter Subscriptions
            </button>
            <button 
              className={`nav-item ${activeTab === 'contact-info' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact-info')}
            >
              Contact Info
            </button>
            <button 
              className={`nav-item ${activeTab === 'footer-info' ? 'active' : ''}`}
              onClick={() => setActiveTab('footer-info')}
            >
              Footer Info
            </button>
            <button 
              className={`nav-item ${activeTab === 'contact-messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact-messages')}
            >
              Contact Messages
            </button>
          </nav>
                </div>

        <div className="main-content">
          {activeTab === 'hero-slides' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Hero Slides Management</h2>
                <button 
                  className="add-btn"
                  onClick={() => {
                    setEditingSlide(null);
                    setShowSlideForm(true);
                  }}
                >
                  Add New Slide
                </button>
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Content</th>
                      <th>Button Text</th>
                      <th>Order</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heroSlides && Array.isArray(heroSlides) && heroSlides.map((slide) => (
                      <tr key={slide.id}>
                        <td>
                          {slide.image_url ? (
                            <img 
                              src={`${process.env.REACT_APP_API_BASE_URL}${slide.image_url}`} 
                              alt="Slide" 
                              className="slide-thumbnail"
                            />
                          ) : (
                            <span className="no-image">No Image</span>
                          )}
                        </td>
                        <td>{slide.title}</td>
                        <td>{slide.content?.substring(0, 50)}...</td>
                        <td>{slide.button_text}</td>
                        <td>{slide.slide_order}</td>
                        <td>
                          <span className={`status ${slide.is_active ? 'active' : 'inactive'}`}>
                            {slide.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="edit-btn"
                              onClick={() => editSlide(slide)}
                            >
                              Edit
                            </button>
                            <button 
                              className="toggle-btn"
                              onClick={() => toggleSlideStatus(slide.id)}
                            >
                              {slide.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => deleteSlide(slide.id)}
                            >
                              Delete
                            </button>
                </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                </div>
          )}

          {activeTab === 'hero-features' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Hero Features Management</h2>
                <button 
                  className="add-btn"
                  onClick={() => {
                    setEditingFeature(null);
                    setShowFeatureForm(true);
                  }}
                >
                  Add New Feature
                </button>
            </div>
            
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Icon</th>
                      <th>Order</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heroFeatures && Array.isArray(heroFeatures) && heroFeatures.map((feature) => (
                      <tr key={feature.id}>
                        <td>{feature.title}</td>
                        <td>{feature.description?.substring(0, 50)}...</td>
                        <td>{feature.icon}</td>
                        <td>{feature.order_index}</td>
                        <td>
                          <span className={`status ${feature.is_active ? 'active' : 'inactive'}`}>
                            {feature.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
              <button 
                              className="edit-btn"
                              onClick={() => editFeature(feature)}
                            >
                              Edit
                            </button>
                            <button 
                              className="toggle-btn"
                              onClick={() => toggleFeatureStatus(feature.id)}
                            >
                              {feature.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => deleteFeature(feature.id)}
                            >
                              Delete
              </button>
            </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
          </div>
            </div>
          )}

          {activeTab === 'brand-logos' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Brand Trust Management</h2>
                <div className="header-actions">
                  <button
                    className="edit-btn"
                    onClick={() => editBrandContent(brandContent)}
                    disabled={!brandContent}
                  >
                    Edit Title
                  </button>
                  <button 
                    className="add-btn"
                    onClick={() => setShowBrandForm(true)}
                  >
                    Add New Brand Logo
                  </button>
                </div>
              </div>
              
              {/* Brand Content Section */}
              <div className="brand-content-section">
                <h3>Brand Trust Title</h3>
                <div className="content-display">
                  <p className="current-title">
                    {brandContent ? brandContent.title : 'Loading...'}
                  </p>
                  <span className={`status ${brandContent?.is_active ? 'active' : 'inactive'}`}>
                    {brandContent?.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Logo</th>
                      <th>Brand Name</th>
                      <th>Display Order</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brandLogos && Array.isArray(brandLogos) && brandLogos.map((brand) => (
                      <tr key={brand.id}>
                        <td>
                          {brand.logo_url ? (
                            <img 
                              src={brand.logo_url} 
                              alt={brand.brand_name}
                              className="brand-logo-thumbnail"
                            />
                          ) : (
                            <span className="no-image">No Logo</span>
                          )}
                        </td>
                        <td>{brand.brand_name}</td>
                        <td>{brand.display_order}</td>
                        <td>
                          <span className={`status ${brand.is_active ? 'active' : 'inactive'}`}>
                            {brand.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="edit-btn"
                              onClick={() => editBrand(brand)}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => deleteBrand(brand.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'who-we-are' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Who We Are Management</h2>
                <div className="header-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => {
                      if (whoWeAreContent) {
                        editWhoWeAreContent(whoWeAreContent);
                      } else {
                        setEditingWhoWeAreContent(null);
                        setShowWhoWeAreContentForm(true);
                      }
                    }}
                  >
                    {whoWeAreContent ? 'Edit Content' : 'Add Content'}
                  </button>
                  <button 
                    className="add-btn"
                    onClick={() => setShowWhoWeAreFeatureForm(true)}
                  >
                    Add New Feature
                  </button>
            </div>
          </div>

              {/* Who We Are Content Section */}
              <div className="brand-content-section">
                <h3>Who We Are Content</h3>
                {whoWeAreContent ? (
                  <div className="content-display">
                    <div className="content-info">
                      <p><strong>Title:</strong> {whoWeAreContent.title}</p>
                      <p><strong>Subtitle:</strong> {whoWeAreContent.subtitle}</p>
                      <p><strong>Description:</strong> {whoWeAreContent.description?.substring(0, 100)}...</p>
                      <p><strong>Highlight:</strong> {whoWeAreContent.highlight_text}</p>
                      <p><strong>Button:</strong> {whoWeAreContent.button_text}</p>
                      <p><strong>Video:</strong> {whoWeAreContent.video_url || 'No video'}</p>
                      <p><strong>Image:</strong> {whoWeAreContent.image_url ? '✓ Uploaded' : 'No image'}</p>
                    </div>
                    <span className={`status ${whoWeAreContent.is_active ? 'active' : 'inactive'}`}>
                      {whoWeAreContent.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ) : (
                  <div className="no-content">
                    <p>No Who We Are content found. Click "Add Content" to create one.</p>
                  </div>
                )}
              </div>

              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Feature Text</th>
                      <th>Display Order</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {whoWeAreFeatures && Array.isArray(whoWeAreFeatures) && whoWeAreFeatures.map((feature) => (
                      <tr key={feature.id}>
                        <td>{feature.feature_text}</td>
                        <td>{feature.display_order}</td>
                        <td>
                          <span className={`status ${feature.is_active ? 'active' : 'inactive'}`}>
                            {feature.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="edit-btn"
                              onClick={() => editWhoWeAreFeature(feature)}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => deleteWhoWeAreFeature(feature.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'preserve-conserve-content' && (
            <div className="content-section">
              <div className="section-header">
                <h2>PreserveConserve Content Management</h2>
                <div className="header-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => editPreserveConserveContent(preserveConserveContent)}
                    disabled={!preserveConserveContent}
                  >
                    Edit Content
                  </button>
                  <button 
                    className="add-btn"
                    onClick={() => {
                      setEditingPreserveConserveContent(null);
                      setShowPreserveConserveContentForm(true);
                    }}
                  >
                    Add New Content
                  </button>
                </div>
              </div>

              {/* PreserveConserve Content Section */}
              <div className="brand-content-section">
                <h3>PreserveConserve Content</h3>
                <div className="content-display">
                  <div className="content-info">
                    <p><strong>Title:</strong> {preserveConserveContent?.title || 'Loading...'}</p>
                    <p><strong>Subtitle:</strong> {preserveConserveContent?.subtitle || 'Loading...'}</p>
                    <p><strong>Description:</strong> {preserveConserveContent?.description?.substring(0, 100)}...</p>
                    <p><strong>Button Text:</strong> {preserveConserveContent?.button_text || 'Not set'}</p>
                    <p><strong>Button Link:</strong> {preserveConserveContent?.button_link || 'Not set'}</p>
                    <p><strong>Background Image:</strong> {preserveConserveContent?.background_image_url ? '✓ Uploaded' : 'No image'}</p>
                  </div>
                  <span className={`status ${preserveConserveContent?.is_active ? 'active' : 'inactive'}`}>
                    {preserveConserveContent?.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'preserve-conserve-features' && (
            <div className="content-section">
              <div className="section-header">
                <h2>PreserveConserveFeatures Management</h2>
                <div className="header-actions">
                  <button 
                    className="add-btn"
                    onClick={() => {
                      setEditingPreserveConserveFeature(null);
                      setShowPreserveConserveFeatureForm(true);
                    }}
                  >
                    Add New Feature
                  </button>
                </div>
              </div>

              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Icon</th>
                      <th>Display Order</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preserveConserveFeatures && Array.isArray(preserveConserveFeatures) && preserveConserveFeatures.map((feature) => (
                      <tr key={feature.id}>
                        <td>{feature.title}</td>
                        <td>{feature.description?.substring(0, 50)}...</td>
                        <td>{feature.icon_url ? '✓ Uploaded' : 'No icon'}</td>
                        <td>{feature.display_order}</td>
                        <td>
                          <span className={`status ${feature.is_active ? 'active' : 'inactive'}`}>
                            {feature.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="edit-btn"
                              onClick={() => editPreserveConserveFeature(feature)}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => deletePreserveConserveFeature(feature.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Services Management</h2>
                <div className="header-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => editServicesContent(servicesContent)}
                    disabled={!servicesContent}
                  >
                    Edit Content
                  </button>
                  <button 
                    className="add-btn"
                    onClick={() => setShowServiceForm(true)}
                  >
                    Add New Service
                  </button>
                </div>
              </div>

              {/* Services Content Section */}
              <div className="brand-content-section">
                <h3>Services Content</h3>
                <div className="content-display">
                  <div className="content-info">
                    <p><strong>Title:</strong> {servicesContent?.title || 'Loading...'}</p>
                    <p><strong>Subtitle:</strong> {servicesContent?.subtitle || 'Loading...'}</p>
                    <p><strong>Description:</strong> {servicesContent?.description?.substring(0, 100)}...</p>
                  </div>
                  <span className={`status ${servicesContent?.is_active ? 'active' : 'inactive'}`}>
                    {servicesContent?.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Button Text</th>
                      <th>Button Link</th>
                      <th>Display Order</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services && Array.isArray(services) && services.map((service) => (
                      <tr key={service.id}>
                        <td>{service.title}</td>
                        <td>{service.description?.substring(0, 50)}...</td>
                        <td>{service.button_text}</td>
                        <td>{service.button_link}</td>
                        <td>{service.display_order}</td>
                        <td>
                          <span className={`status ${service.is_active ? 'active' : 'inactive'}`}>
                            {service.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="edit-btn"
                              onClick={() => editService(service)}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => deleteService(service.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Statistics Management</h2>
                <button 
                  className="add-btn"
                  onClick={() => {
                    setEditingStatistic(null);
                    setShowStatisticsForm(true);
                  }}
                >
                  Add New Statistic
                </button>
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Icon</th>
                      <th>Title</th>
                      <th>Value</th>
                      <th>Description</th>
                      <th>Display Order</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics && Array.isArray(statistics) && statistics.map((statistic) => (
                      <tr key={statistic.id}>
                        <td>
                          <span className="icon-display">{statistic.icon}</span>
                        </td>
                        <td>{statistic.title}</td>
                        <td><strong>{statistic.value}</strong></td>
                        <td>{statistic.description}</td>
                        <td>{statistic.display_order}</td>
                        <td>
                          <span className={`status ${statistic.is_active ? 'active' : 'inactive'}`}>
                            {statistic.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="edit-btn"
                              onClick={() => editStatistic(statistic)}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => deleteStatistic(statistic.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'map-points' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Map Points Management</h2>
                <button 
                  className="add-btn"
                  onClick={() => {
                    setEditingMapPoint(null);
                    setShowMapPointsForm(true);
                  }}
                >
                  Add New Map Point
                </button>
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Latitude</th>
                      <th>Longitude</th>
                      <th>Marker Type</th>
                      <th>Display Order</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mapPoints && Array.isArray(mapPoints) && mapPoints.map((mapPoint) => (
                      <tr key={mapPoint.id}>
                        <td>{mapPoint.title}</td>
                        <td>{mapPoint.description}</td>
                        <td>{mapPoint.latitude}</td>
                        <td>{mapPoint.longitude}</td>
                        <td>
                          <span className={`marker-type ${mapPoint.marker_type}`}>
                            {mapPoint.marker_type}
                          </span>
                        </td>
                        <td>{mapPoint.display_order}</td>
                        <td>
                          <span className={`status ${mapPoint.is_active ? 'active' : 'inactive'}`}>
                            {mapPoint.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="edit-btn"
                              onClick={() => editMapPoint(mapPoint)}
                            >
                              Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => deleteMapPoint(mapPoint.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'global-presence' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Global Presence Content Management</h2>
                <button 
                  className="edit-btn"
                  onClick={() => editGlobalPresenceContent(globalPresenceContent)}
                  disabled={!globalPresenceContent}
                >
                  Edit Content
                </button>
              </div>
              
              <div className="brand-content-section">
                <h3>Global Presence Content</h3>
                <div className="content-display">
                  <div className="content-info">
                    <p><strong>Title:</strong> {globalPresenceContent?.title || 'Loading...'}</p>
                    <p><strong>Subtitle:</strong> {globalPresenceContent?.subtitle || 'Loading...'}</p>
                    <p><strong>Description:</strong> {globalPresenceContent?.description?.substring(0, 100)}...</p>
                  </div>
                  <span className={`status ${globalPresenceContent?.is_active ? 'active' : 'inactive'}`}>
                    {globalPresenceContent?.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'value-section' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Value Section Management</h2>
                <div className="header-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => {
                      if (valueContent) {
                        editValueContent(valueContent);
                      } else {
                        setEditingValueContent(null);
                        setShowValueContentForm(true);
                      }
                    }}
                  >
                    {valueContent ? 'Edit Content' : 'Add Content'}
                  </button>
                </div>
              </div>

              {/* Debug Information */}
              <div style={{ 
                background: '#f0f0f0', 
                padding: '10px', 
                margin: '10px 0', 
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                <strong>Debug Info:</strong><br/>
                Content loaded: {valueContent ? 'Yes' : 'No'}<br/>
                Content data: {JSON.stringify(valueContent)}<br/>
                <button onClick={loadValueContent} style={{marginTop: '5px', padding: '5px 10px'}}>
                  🔄 Reload Data
                </button>
              </div>

              {/* Value Content Section */}
              <div className="brand-content-section">
                <h3>Value Content</h3>
                {valueContent ? (
                  <div className="content-display">
                    <div className="content-info">
                      <p><strong>Subtitle:</strong> {valueContent.subtitle}</p>
                      <p><strong>Title:</strong> {valueContent.title}</p>
                      <p><strong>Description:</strong> {valueContent.description?.substring(0, 100)}...</p>
                      <p><strong>Image:</strong> {valueContent.image_url ? '✓ Uploaded' : 'No image'}</p>
                    </div>
                    <span className={`status ${valueContent.is_active ? 'active' : 'inactive'}`}>
                      {valueContent.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ) : (
                  <div className="no-content">
                    <p>No Value content found. Click "Add Content" to create one.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === 'value-statistics' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Value Statistics Management</h2>
                <button 
                  className="add-btn"
                  onClick={() => {
                    setEditingValueStatistic(null);
                    setShowValueStatisticsForm(true);
                  }}
                >
                  Add New Statistic
                </button>
              </div>

              {/* Debug Information */}
              <div style={{ 
                background: '#f0f0f0', 
                padding: '10px', 
                margin: '10px 0', 
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                <strong>Debug Info:</strong><br/>
                Statistics loaded: {valueStatistics ? valueStatistics.length : 0} items<br/>
                Statistics data: {JSON.stringify(valueStatistics)}<br/>
                <button onClick={loadValueStatistics} style={{marginTop: '5px', padding: '5px 10px'}}>
                  🔄 Reload Data
                </button>
              </div>

              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Percentage</th>
                      <th>Display Order</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {valueStatistics && Array.isArray(valueStatistics) && valueStatistics.length > 0 ? (
                      valueStatistics.map((stat) => (
                        <tr key={stat.id}>
                          <td>{stat.id}</td>
                          <td>{stat.title}</td>
                          <td>
                            <div className="percentage-display">
                              <span>{stat.percentage}%</span>
                              <div className="progress-bar-mini">
                                <div 
                                  className="progress-fill" 
                                  style={{width: `${stat.percentage}%`}}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td>{stat.display_order}</td>
                          <td>
                            <span className={`status ${stat.is_active ? 'active' : 'inactive'}`}>
                              {stat.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{new Date(stat.created_at).toLocaleDateString()}</td>
                          <td>{new Date(stat.updated_at).toLocaleDateString()}</td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="edit-btn"
                                onClick={() => editValueStatistic(stat)}
                                title="Düzenle"
                              >
                                ✏️
                              </button>
                              <button 
                                className="copy-btn"
                                onClick={() => {
                                  const newStat = {...stat, id: undefined};
                                  setEditingValueStatistic(newStat);
                                  setShowValueStatisticsForm(true);
                                }}
                                title="Kopyala"
                              >
                                📋
                              </button>
                              <button 
                                className="delete-btn"
                                onClick={() => deleteValueStatistic(stat.id)}
                                title="Sil"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>
                          No statistics found. Click "Add New Statistic" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'lets-be-great-content' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Let's Be Great Together Content Management</h2>
                <button 
                  className="add-btn"
                  onClick={() => {
                    setEditingLetsBeGreatContent(null);
                    setShowLetsBeGreatContentForm(true);
                  }}
                >
                  Edit Content
                </button>
              </div>
              
              {letsBeGreatContent && (
                <div className="content-display">
                  <div className="content-item">
                    <h3>Current Content</h3>
                    <div className="content-details">
                      <p><strong>Subtitle:</strong> {letsBeGreatContent.subtitle}</p>
                      <p><strong>Title:</strong> {letsBeGreatContent.title}</p>
                      <p><strong>Description:</strong> {letsBeGreatContent.description}</p>
                      <p><strong>Button Text:</strong> {letsBeGreatContent.button_text}</p>
                      <p><strong>Button Link:</strong> {letsBeGreatContent.button_link}</p>
                      <p><strong>Status:</strong> 
                        <span className={`status ${letsBeGreatContent.is_active ? 'active' : 'inactive'}`}>
                          {letsBeGreatContent.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </p>
                      {letsBeGreatContent.background_image_url && (
                        <div className="image-display">
                          <strong>Background Image:</strong>
                          <img 
                            src={`${process.env.REACT_APP_API_BASE_URL}${letsBeGreatContent.background_image_url}`} 
                            alt="Background" 
                            className="content-image"
                          />
                        </div>
                      )}
                    </div>
                    <div className="content-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => {
                          setEditingLetsBeGreatContent(letsBeGreatContent);
                          setShowLetsBeGreatContentForm(true);
                        }}
                      >
                        Edit Content
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'lets-be-great-statistics' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Let's Be Great Together Statistics Management</h2>
                <button 
                  className="add-btn"
                  onClick={() => {
                    setEditingLetsBeGreatStatistic(null);
                    setShowLetsBeGreatStatisticsForm(true);
                  }}
                >
                  Add New Statistic
                </button>
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Percentage</th>
                      <th>Description</th>
                      <th>Display Order</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {letsBeGreatStatistics && Array.isArray(letsBeGreatStatistics) && letsBeGreatStatistics.map((stat) => (
                      <tr key={stat.id}>
                        <td>{stat.title}</td>
                        <td>
                          <div className="percentage-display">
                            <span>{stat.percentage}%</span>
                            <div className="progress-bar-mini">
                              <div 
                                className="progress-fill" 
                                style={{width: `${stat.percentage}%`}}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="description-cell">
                            {stat.description ? (
                              <span title={stat.description}>
                                {stat.description.length > 50 
                                  ? `${stat.description.substring(0, 50)}...` 
                                  : stat.description
                                }
                              </span>
                            ) : (
                              <span className="no-description">No description</span>
                            )}
                          </div>
                        </td>
                        <td>{stat.display_order}</td>
                        <td>
                          <span className={`status ${stat.is_active ? 'active' : 'inactive'}`}>
                            {stat.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="edit-btn"
                            onClick={() => editLetsBeGreatStatistic(stat)}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => deleteLetsBeGreatStatistic(stat.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
            </div>
            
      {/* Slide Form Modal */}
      {showSlideForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingSlide ? 'Edit Slide' : 'Add New Slide'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowSlideForm(false);
                  setEditingSlide(null);
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSlideSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingSlide?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Subtitle:</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  defaultValue={editingSlide?.subtitle || ''}
                />
              </div>
              <div className="form-group">
                <label>Content:</label>
                <textarea 
                  name="content" 
                  defaultValue={editingSlide?.content || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Button Text:</label>
                <input 
                  type="text" 
                  name="button_text" 
                  defaultValue={editingSlide?.button_text || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Button Link:</label>
                <input 
                  type="text" 
                  name="button_link" 
                  defaultValue={editingSlide?.button_link || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Slide Order:</label>
                <input 
                  type="number" 
                  name="slide_order" 
                  defaultValue={editingSlide?.slide_order || 1}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Image:</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                )}
                {editingSlide?.image_url && !imagePreview && (
                  <img 
                    src={`${process.env.REACT_APP_API_BASE_URL}${editingSlide.image_url}`} 
                    alt="Current" 
                    className="image-preview" 
                  />
                )}
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingSlide?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingSlide ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowSlideForm(false);
                    setEditingSlide(null);
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature Form Modal */}
      {showFeatureForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingFeature ? 'Edit Feature' : 'Add New Feature'}</h3>
                  <button
                className="close-btn"
                onClick={() => {
                  setShowFeatureForm(false);
                  setEditingFeature(null);
                }}
              >
                ×
                  </button>
            </div>
            <form onSubmit={handleFeatureSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingFeature?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  defaultValue={editingFeature?.description || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Icon:</label>
                <input 
                  type="text" 
                  name="icon" 
                  defaultValue={editingFeature?.icon || ''}
                  placeholder="→"
                />
              </div>
              <div className="form-group">
                <label>Order Index:</label>
                <input 
                  type="number" 
                  name="order_index" 
                  defaultValue={editingFeature?.order_index || 1}
                  required 
                />
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingFeature?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingFeature ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowFeatureForm(false);
                    setEditingFeature(null);
                  }}
                >
                  Cancel
                </button>
          </div>
            </form>
          </div>
      </div>
      )}

      {/* Brand Form Modal */}
      {showBrandForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingBrand ? 'Edit Brand Logo' : 'Add New Brand Logo'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowBrandForm(false);
                  setEditingBrand(null);
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleBrandSubmit} className="admin-form">
              <div className="form-group">
                <label>Brand Name:</label>
                <input 
                  type="text" 
                  name="brand_name" 
                  defaultValue={editingBrand?.brand_name || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Logo Image:</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                {editingBrand?.logo_url && !imagePreview && (
                  <div className="current-image">
                    <p>Current logo:</p>
                    <img src={editingBrand.logo_url} alt="Current logo" />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Display Order:</label>
                <input 
                  type="number" 
                  name="display_order" 
                  defaultValue={editingBrand?.display_order || 1}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingBrand?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingBrand ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowBrandForm(false);
                    setEditingBrand(null);
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brand Content Form Modal */}
      {showBrandContentForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Brand Trust Title</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowBrandContentForm(false);
                  setEditingBrandContent(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleBrandContentSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <textarea 
                  name="title" 
                  defaultValue={editingBrandContent?.title || ''}
                  required 
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingBrandContent?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Update
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowBrandContentForm(false);
                    setEditingBrandContent(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Who We Are Content Form Modal */}
      {showWhoWeAreContentForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingWhoWeAreContent ? 'Edit Who We Are Content' : 'Add Who We Are Content'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowWhoWeAreContentForm(false);
                  setEditingWhoWeAreContent(null);
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleWhoWeAreContentSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingWhoWeAreContent?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Subtitle:</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  defaultValue={editingWhoWeAreContent?.subtitle || ''}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  defaultValue={editingWhoWeAreContent?.description || ''}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Highlight Text:</label>
                <input 
                  type="text" 
                  name="highlight_text" 
                  defaultValue={editingWhoWeAreContent?.highlight_text || ''}
                />
              </div>
              <div className="form-group">
                <label>Button Text:</label>
                <input 
                  type="text" 
                  name="button_text" 
                  defaultValue={editingWhoWeAreContent?.button_text || ''}
                />
              </div>
              <div className="form-group">
                <label>Button Link:</label>
                <input 
                  type="text" 
                  name="button_link" 
                  defaultValue={editingWhoWeAreContent?.button_link || ''}
                />
              </div>
              <div className="form-group">
                <label>Image Upload:</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                {editingWhoWeAreContent?.image_url && !imagePreview && (
                  <div className="current-image">
                    <p>Current image:</p>
                    <img src={normalizeImageUrl(editingWhoWeAreContent.image_url)} alt="Current image" />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Video URL:</label>
                <input 
                  type="url" 
                  name="video_url" 
                  defaultValue={editingWhoWeAreContent?.video_url || ''}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <small>Either upload an image or provide a video URL. If both are provided, image will be shown and video will play on click.</small>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingWhoWeAreContent?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Update
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowWhoWeAreContentForm(false);
                    setEditingWhoWeAreContent(null);
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Who We Are Feature Form Modal */}
      {showWhoWeAreFeatureForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingWhoWeAreFeature ? 'Edit Feature' : 'Add New Feature'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowWhoWeAreFeatureForm(false);
                  setEditingWhoWeAreFeature(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleWhoWeAreFeatureSubmit} className="admin-form">
              <div className="form-group">
                <label>Feature Text:</label>
                <input 
                  type="text" 
                  name="feature_text" 
                  defaultValue={editingWhoWeAreFeature?.feature_text || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Display Order:</label>
                <input 
                  type="number" 
                  name="display_order" 
                  defaultValue={editingWhoWeAreFeature?.display_order || 1}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingWhoWeAreFeature?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingWhoWeAreFeature ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowWhoWeAreFeatureForm(false);
                    setEditingWhoWeAreFeature(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preserve & Conserve Content Form Modal */}
      {showPreserveConserveContentForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Preserve & Conserve Content</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowPreserveConserveContentForm(false);
                  setEditingPreserveConserveContent(null);
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handlePreserveConserveContentSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingPreserveConserveContent?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Subtitle:</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  defaultValue={editingPreserveConserveContent?.subtitle || ''}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  defaultValue={editingPreserveConserveContent?.description || ''}
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label>Button Text:</label>
                <input 
                  type="text" 
                  name="button_text" 
                  defaultValue={editingPreserveConserveContent?.button_text || 'Discover More'}
                />
              </div>
              <div className="form-group">
                <label>Button Link:</label>
                <input 
                  type="text" 
                  name="button_link" 
                  defaultValue={editingPreserveConserveContent?.button_link || '#'}
                />
              </div>
              <div className="form-group">
                <label>Background Image Upload:</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                {editingPreserveConserveContent?.background_image_url && !imagePreview && (
                  <div className="current-image">
                    <p>Current image: {editingPreserveConserveContent.background_image_url}</p>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingPreserveConserveContent?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Update
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowPreserveConserveContentForm(false);
                    setEditingPreserveConserveContent(null);
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preserve & Conserve Feature Form Modal */}
      {showPreserveConserveFeatureForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingPreserveConserveFeature ? 'Edit Feature' : 'Add New Feature'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowPreserveConserveFeatureForm(false);
                  setEditingPreserveConserveFeature(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handlePreserveConserveFeatureSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingPreserveConserveFeature?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  defaultValue={editingPreserveConserveFeature?.description || ''}
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label>Icon Upload:</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                {editingPreserveConserveFeature?.icon_url && !imagePreview && (
                  <div className="current-image">
                    <p>Current icon: {editingPreserveConserveFeature.icon_url}</p>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Display Order:</label>
                <input 
                  type="number" 
                  name="display_order" 
                  defaultValue={editingPreserveConserveFeature?.display_order || 1}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingPreserveConserveFeature?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingPreserveConserveFeature ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowPreserveConserveFeatureForm(false);
                    setEditingPreserveConserveFeature(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Services Content Form Modal */}
      {showServicesContentForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Services Content</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowServicesContentForm(false);
                  setEditingServicesContent(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleServicesContentSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingServicesContent?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Subtitle:</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  defaultValue={editingServicesContent?.subtitle || ''}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  defaultValue={editingServicesContent?.description || ''}
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingServicesContent?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Update
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowServicesContentForm(false);
                    setEditingServicesContent(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Form Modal */}
      {showServiceForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowServiceForm(false);
                  setEditingService(null);
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleServiceSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingService?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  defaultValue={editingService?.description || ''}
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label>Button Text:</label>
                <input 
                  type="text" 
                  name="button_text" 
                  defaultValue={editingService?.button_text || 'Learn More'}
                />
              </div>
              <div className="form-group">
                <label>Button Link:</label>
                <input 
                  type="text" 
                  name="button_link" 
                  defaultValue={editingService?.button_link || '#contact'}
                />
              </div>
              <div className="form-group">
                <label>Image Upload:</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                {editingService?.image_url && !imagePreview && (
                  <div className="current-image">
                    <p>Current image: {editingService.image_url}</p>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Display Order:</label>
                <input 
                  type="number" 
                  name="display_order" 
                  defaultValue={editingService?.display_order || 1}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingService ? (editingService.is_active === 1 || editingService.is_active === true) : true}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingService ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowServiceForm(false);
                    setEditingService(null);
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statistics Form Modal */}
      {showStatisticsForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingStatistic ? 'Edit Statistic' : 'Add New Statistic'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowStatisticsForm(false);
                  setEditingStatistic(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleStatisticSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingStatistic?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Value:</label>
                <input 
                  type="text" 
                  name="value" 
                  defaultValue={editingStatistic?.value || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input 
                  type="text" 
                  name="description" 
                  defaultValue={editingStatistic?.description || ''}
                />
              </div>
              <div className="form-group">
                <label>Icon:</label>
                <input 
                  type="text" 
                  name="icon" 
                  defaultValue={editingStatistic?.icon || '📊'}
                  placeholder="📊"
                />
              </div>
              <div className="form-group">
                <label>Display Order:</label>
                <input 
                  type="number" 
                  name="display_order" 
                  defaultValue={editingStatistic?.display_order || 1}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingStatistic?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingStatistic ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowStatisticsForm(false);
                    setEditingStatistic(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Map Points Form Modal */}
      {showMapPointsForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingMapPoint ? 'Edit Map Point' : 'Add New Map Point'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowMapPointsForm(false);
                  setEditingMapPoint(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleMapPointSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingMapPoint?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  defaultValue={editingMapPoint?.description || ''}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Latitude:</label>
                <input 
                  type="number" 
                  step="any"
                  name="latitude" 
                  defaultValue={editingMapPoint?.latitude || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Longitude:</label>
                <input 
                  type="number" 
                  step="any"
                  name="longitude" 
                  defaultValue={editingMapPoint?.longitude || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Marker Type:</label>
                <select name="marker_type" defaultValue={editingMapPoint?.marker_type || 'gold'}>
                  <option value="gold">Gold</option>
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                </select>
              </div>
              <div className="form-group">
                <label>Display Order:</label>
                <input 
                  type="number" 
                  name="display_order" 
                  defaultValue={editingMapPoint?.display_order || 1}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingMapPoint?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingMapPoint ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowMapPointsForm(false);
                    setEditingMapPoint(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Presence Content Form Modal */}
      {showGlobalPresenceContentForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Global Presence Content</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowGlobalPresenceContentForm(false);
                  setEditingGlobalPresenceContent(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleGlobalPresenceContentSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingGlobalPresenceContent?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Subtitle:</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  defaultValue={editingGlobalPresenceContent?.subtitle || ''}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  defaultValue={editingGlobalPresenceContent?.description || ''}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingGlobalPresenceContent?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Update
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowGlobalPresenceContentForm(false);
                    setEditingGlobalPresenceContent(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Our Value Content Form Modal */}
      {showValueContentForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingValueContent ? 'Edit Our Value Content' : 'Add New Value Content'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowValueContentForm(false);
                  setEditingValueContent(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleValueContentSubmit} className="admin-form">
              <div className="form-group">
                <label>Subtitle:</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  defaultValue={editingValueContent?.subtitle || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingValueContent?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  defaultValue={editingValueContent?.description || ''}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Image:</label>
                <input 
                  type="file" 
                  name="image" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setSelectedImage(e.target.files[0]);
                      setImagePreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" style={{maxWidth: '200px', maxHeight: '200px'}} />
                  </div>
                )}
                {editingValueContent?.image_url && !imagePreview && (
                  <div className="current-image">
                    <p>Current image:</p>
                    <img 
                      src={editingValueContent.image_url} 
                      alt="Current" 
                      style={{maxWidth: '200px', maxHeight: '200px'}} 
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingValueContent?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingValueContent ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowValueContentForm(false);
                    setEditingValueContent(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Our Value Statistics Form Modal */}
      {showValueStatisticsForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingValueStatistic ? 'Edit Value Statistic' : 'Add New Value Statistic'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowValueStatisticsForm(false);
                  setEditingValueStatistic(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleValueStatisticSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingValueStatistic?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Percentage:</label>
                <input 
                  type="number" 
                  name="percentage" 
                  min="0" 
                  max="100" 
                  defaultValue={editingValueStatistic?.percentage || 0}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Display Order:</label>
                <input 
                  type="number" 
                  name="display_order" 
                  min="1" 
                  defaultValue={editingValueStatistic?.display_order || 1}
                  required 
                />
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingValueStatistic?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingValueStatistic ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowValueStatisticsForm(false);
                    setEditingValueStatistic(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
          )}

          {activeTab === 'hero-stats-statistics' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Hero Stats Statistics Management</h2>
                <button 
                  className="add-btn"
                  onClick={() => {
                    setEditingHeroStatsStatistic(null);
                    setShowHeroStatsStatisticsForm(true);
                  }}
                >
                  Add New Statistic
                </button>
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Percentage</th>
                      <th>Description</th>
                      <th>Display Order</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heroStatsStatistics && Array.isArray(heroStatsStatistics) && heroStatsStatistics.map((stat) => (
                      <tr key={stat.id}>
                        <td>{stat.title}</td>
                        <td>
                          <div className="percentage-display">
                            <span>{stat.percentage}%</span>
                            <div className="progress-bar-mini">
                              <div 
                                className="progress-fill" 
                                style={{width: `${stat.percentage}%`}}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="description-cell">
                            {stat.description ? (
                              <span title={stat.description}>
                                {stat.description.length > 50 
                                  ? `${stat.description.substring(0, 50)}...` 
                                  : stat.description
                                }
                              </span>
                            ) : (
                              <span className="no-description">No description</span>
                            )}
                          </div>
                        </td>
                        <td>{stat.display_order}</td>
                        <td>
                          <span className={`status ${stat.is_active ? 'active' : 'inactive'}`}>
                            {stat.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="edit-btn"
                            onClick={() => editHeroStatsStatistic(stat)}
                          >
                            Edit
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => deleteHeroStatsStatistic(stat.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'leadership-content' && (
        <div className="content-section">
          <h2>Leadership Content Management</h2>
          {leadershipContent ? (
            <div className="leadership-content-management">
              <div className="leadership-content-display">
                <h4>{leadershipContent.title}</h4>
                <p><strong>Subtitle:</strong> {leadershipContent.subtitle}</p>
                <p><strong>Description:</strong> {leadershipContent.description}</p>
                <p><strong>Status:</strong> {leadershipContent.is_active ? 'Active' : 'Inactive'}</p>
                <div className="leadership-content-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => {
                      setEditingLeadershipContent(leadershipContent);
                      setShowLeadershipContentForm(true);
                    }}
                  >
                    Edit Content
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p>No leadership content found.</p>
          )}
          <button 
            className="add-btn"
            onClick={() => setShowLeadershipContentForm(true)}
          >
            Add New Content
          </button>
        </div>
      )}

      {activeTab === 'leadership-members' && (
        <div className="content-section">
          <div className="leadership-members-management">
            <div className="leadership-members-header">
              <h3>Leadership Members Management</h3>
              <button 
                className="add-btn"
                onClick={() => {
                  setEditingLeadershipMember(null);
                  setShowLeadershipMemberForm(true);
                }}
              >
                Add New Member
              </button>
            </div>
            
            <table className="leadership-members-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Bio</th>
                  <th>Image</th>
                  <th>Display Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leadershipMembers && Array.isArray(leadershipMembers) && leadershipMembers.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.position}</td>
                    <td>{member.bio?.substring(0, 50)}...</td>
                    <td>
                      {member.image_url && (
                        <img 
                          src={member.image_url} 
                          alt={member.name}
                          className="leadership-member-image"
                        />
                      )}
                    </td>
                    <td>{member.display_order}</td>
                    <td>
                      <span className={`status ${member.is_active ? 'active' : 'inactive'}`}>
                        {member.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="leadership-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => {
                            setEditingLeadershipMember(member);
                            setShowLeadershipMemberForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteLeadershipMember(member.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Let's Be Great Together Content Form Modal */}
      {showLetsBeGreatContentForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingLetsBeGreatContent ? 'Edit Let\'s Be Great Content' : 'Add New Let\'s Be Great Content'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowLetsBeGreatContentForm(false);
                  setEditingLetsBeGreatContent(null);
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleLetsBeGreatContentSubmit} className="admin-form">
              <div className="form-group">
                <label>Subtitle:</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  defaultValue={editingLetsBeGreatContent?.subtitle || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingLetsBeGreatContent?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  defaultValue={editingLetsBeGreatContent?.description || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Button Text:</label>
                <input 
                  type="text" 
                  name="button_text" 
                  defaultValue={editingLetsBeGreatContent?.button_text || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Button Link:</label>
                <input 
                  type="text" 
                  name="button_link" 
                  defaultValue={editingLetsBeGreatContent?.button_link || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Background Image:</label>
                <input 
                  type="file" 
                  accept="image/*"
                  name="background_image"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                )}
                {editingLetsBeGreatContent?.background_image_url && !imagePreview && (
                  <img 
                    src={`${process.env.REACT_APP_API_BASE_URL}${editingLetsBeGreatContent.background_image_url}`} 
                    alt="Current" 
                    className="image-preview" 
                  />
                )}
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingLetsBeGreatContent?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingLetsBeGreatContent ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowLetsBeGreatContentForm(false);
                    setEditingLetsBeGreatContent(null);
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Let's Be Great Together Statistics Form Modal */}
      {showLetsBeGreatStatisticsForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingLetsBeGreatStatistic ? 'Edit Let\'s Be Great Statistic' : 'Add New Let\'s Be Great Statistic'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowLetsBeGreatStatisticsForm(false);
                  setEditingLetsBeGreatStatistic(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleLetsBeGreatStatisticsSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingLetsBeGreatStatistic?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Percentage:</label>
                <input 
                  type="number" 
                  name="percentage" 
                  min="0" 
                  max="100" 
                  defaultValue={editingLetsBeGreatStatistic?.percentage || 0}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  rows="3"
                  defaultValue={editingLetsBeGreatStatistic?.description || ''}
                  placeholder="Enter description for this statistic"
                />
              </div>
              <div className="form-group">
                <label>Display Order:</label>
                <input 
                  type="number" 
                  name="display_order" 
                  min="1" 
                  defaultValue={editingLetsBeGreatStatistic?.display_order || 1}
                  required 
                />
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingLetsBeGreatStatistic?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingLetsBeGreatStatistic ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowLetsBeGreatStatisticsForm(false);
                    setEditingLetsBeGreatStatistic(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Stats Statistics Form Modal */}
      {showHeroStatsStatisticsForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingHeroStatsStatistic ? 'Edit Hero Stats Statistic' : 'Add New Hero Stats Statistic'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowHeroStatsStatisticsForm(false);
                  setEditingHeroStatsStatistic(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleHeroStatsStatisticsSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingHeroStatsStatistic?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Percentage:</label>
                <input 
                  type="number" 
                  name="percentage" 
                  min="0" 
                  max="100" 
                  defaultValue={editingHeroStatsStatistic?.percentage || 0}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  rows="3"
                  defaultValue={editingHeroStatsStatistic?.description || ''}
                  placeholder="Enter description for this statistic"
                />
              </div>
              <div className="form-group">
                <label>Display Order:</label>
                <input 
                  type="number" 
                  name="display_order" 
                  min="1" 
                  defaultValue={editingHeroStatsStatistic?.display_order || 1}
                  required 
                />
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingHeroStatsStatistic?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingHeroStatsStatistic ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowHeroStatsStatisticsForm(false);
                    setEditingHeroStatsStatistic(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLeadershipContentForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingLeadershipContent ? 'Edit Leadership Content' : 'Add Leadership Content'}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowLeadershipContentForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleLeadershipContentSubmit}>
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingLeadershipContent?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Subtitle:</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  defaultValue={editingLeadershipContent?.subtitle || ''}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  rows="4"
                  defaultValue={editingLeadershipContent?.description || ''}
                />
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingLeadershipContent?.is_active !== false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingLeadershipContent ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowLeadershipContentForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'projects-content' && (
        <div className="content-section">
          <h2>Projects Content Management</h2>
          {projectsContent ? (
            <div className="leadership-content-management">
              <div className="leadership-content-display">
                <h4>{projectsContent.title}</h4>
                <p><strong>Subtitle:</strong> {projectsContent.subtitle}</p>
                <p><strong>Description:</strong> {projectsContent.description}</p>
                <p><strong>Status:</strong> {projectsContent.is_active ? 'Active' : 'Inactive'}</p>
                <div className="leadership-content-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => {
                      setEditingProjectsContent(projectsContent);
                      setShowProjectsContentForm(true);
                    }}
                  >
                    Edit Content
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p>No projects content found.</p>
          )}
          <button 
            className="add-btn"
            onClick={() => setShowProjectsContentForm(true)}
          >
            Add New Content
          </button>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="content-section">
          <div className="leadership-members-management">
            <div className="leadership-members-header">
              <h3>Projects Management</h3>
              <button 
                className="add-btn"
                onClick={() => {
                  setEditingProject(null);
                  setShowProjectForm(true);
                }}
              >
                Add New Project
              </button>
            </div>
            
            <table className="leadership-members-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Button Text</th>
                  <th>Button Link</th>
                  <th>Display Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects && Array.isArray(projects) && projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.title}</td>
                    <td>{project.description?.substring(0, 50)}...</td>
                    <td>
                      {project.image_url && (
                        <img 
                          src={project.image_url} 
                          alt={project.title}
                          className="leadership-member-image"
                        />
                      )}
                    </td>
                    <td>{project.button_text}</td>
                    <td>{project.button_link}</td>
                    <td>{project.display_order}</td>
                    <td>
                      <span className={`status ${project.is_active ? 'active' : 'inactive'}`}>
                        {project.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="leadership-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => {
                            setEditingProject(project);
                            setShowProjectForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteProject(project.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'news-insight-content' && (
        <div className="content-section">
          <h2>NewsInsight Content Management</h2>
          {newsInsightContent ? (
            <div className="leadership-content-management">
              <div className="leadership-content-display">
                <h4>{newsInsightContent.title}</h4>
                <p><strong>Subtitle:</strong> {newsInsightContent.subtitle}</p>
                <p><strong>Description:</strong> {newsInsightContent.description}</p>
                <p><strong>Status:</strong> {newsInsightContent.is_active ? 'Active' : 'Inactive'}</p>
                <div className="leadership-content-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => {
                      setEditingNewsInsightContent(newsInsightContent);
                      setShowNewsInsightContentForm(true);
                    }}
                  >
                    Edit Content
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p>No news insight content found.</p>
          )}
          <button 
            className="add-btn"
            onClick={() => setShowNewsInsightContentForm(true)}
          >
            Add New Content
          </button>
        </div>
      )}

      {activeTab === 'news-insight-articles' && (
        <div className="content-section">
          <div className="leadership-members-management">
            <div className="leadership-members-header">
              <h3>NewsInsight Articles Management</h3>
              <button 
                className="add-btn"
                onClick={() => {
                  setEditingNewsInsightArticle(null);
                  setShowNewsInsightArticleForm(true);
                }}
              >
                Add New Article
              </button>
            </div>
            
            <table className="leadership-members-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Button Text</th>
                  <th>Button Link</th>
                  <th>Display Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {newsInsightArticles && Array.isArray(newsInsightArticles) && newsInsightArticles.map((article) => (
                  <tr key={article.id}>
                    <td>{article.title}</td>
                    <td>{article.description?.substring(0, 50)}...</td>
                    <td>
                      {article.image_url && (
                        <img 
                          src={article.image_url} 
                          alt={article.title}
                          className="leadership-member-image"
                        />
                      )}
                    </td>
                    <td>{article.button_text}</td>
                    <td>{article.button_link}</td>
                    <td>{article.display_order}</td>
                    <td>
                      <span className={`status ${article.is_active ? 'active' : 'inactive'}`}>
                        {article.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="leadership-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => {
                            setEditingNewsInsightArticle(article);
                            setShowNewsInsightArticleForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteNewsInsightArticle(article.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showLeadershipMemberForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingLeadershipMember ? 'Edit Leadership Member' : 'Add Leadership Member'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowLeadershipMemberForm(false);
                  setEditingLeadershipMember(null);
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleLeadershipMemberSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input 
                  type="text" 
                  name="name" 
                  defaultValue={editingLeadershipMember?.name || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Position:</label>
                <input 
                  type="text" 
                  name="position" 
                  defaultValue={editingLeadershipMember?.position || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Bio:</label>
                <textarea 
                  name="bio" 
                  rows="4"
                  defaultValue={editingLeadershipMember?.bio || ''}
                />
              </div>
              <div className="form-group">
                <label>Image:</label>
                <input 
                  type="file" 
                  name="image" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                )}
                {editingLeadershipMember?.image_url && !imagePreview && (
                  <div className="current-image">
                    <p>Current Image:</p>
                    <img 
                      src={editingLeadershipMember.image_url} 
                      alt="Current" 
                      style={{width: '100px', height: '100px', objectFit: 'cover'}}
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>LinkedIn URL:</label>
                <input 
                  type="url" 
                  name="linkedin_url" 
                  defaultValue={editingLeadershipMember?.linkedin_url || ''}
                />
              </div>
              <div className="form-group">
                <label>Twitter URL:</label>
                <input 
                  type="url" 
                  name="twitter_url" 
                  defaultValue={editingLeadershipMember?.twitter_url || ''}
                />
              </div>
              <div className="form-group">
                <label>Display Order:</label>
                <input 
                  type="number" 
                  name="display_order" 
                  min="0"
                  defaultValue={editingLeadershipMember?.display_order || 0}
                />
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingLeadershipMember?.is_active !== false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingLeadershipMember ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowLeadershipMemberForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProjectsContentForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingProjectsContent ? 'Edit Projects Content' : 'Add Projects Content'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowProjectsContentForm(false);
                  setEditingProjectsContent(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleProjectsContentSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingProjectsContent?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Subtitle:</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  defaultValue={editingProjectsContent?.subtitle || ''}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  defaultValue={editingProjectsContent?.description || ''}
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingProjectsContent?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingProjectsContent ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowProjectsContentForm(false);
                    setEditingProjectsContent(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProjectForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowProjectForm(false);
                  setEditingProject(null);
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleProjectSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingProject?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  defaultValue={editingProject?.description || ''}
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label>Button Text:</label>
                <input 
                  type="text" 
                  name="button_text" 
                  defaultValue={editingProject?.button_text || 'Learn More'}
                />
              </div>
              <div className="form-group">
                <label>Button Link:</label>
                <input 
                  type="text" 
                  name="button_link" 
                  defaultValue={editingProject?.button_link || '#contact'}
                />
              </div>
              <div className="form-group">
                <label>Display Order:</label>
                <input 
                  type="number" 
                  name="display_order" 
                  defaultValue={editingProject?.display_order || 0}
                />
              </div>
              <div className="form-group">
                <label>Image:</label>
                <input 
                  type="file" 
                  name="image" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                )}
                {editingProject?.image_url && !imagePreview && (
                  <div className="current-image">
                    <p>Current Image:</p>
                    <img 
                      src={editingProject.image_url} 
                      alt="Current" 
                      style={{width: '100px', height: '100px', objectFit: 'cover'}}
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingProject?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingProject ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowProjectForm(false);
                    setEditingProject(null);
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNewsInsightContentForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingNewsInsightContent ? 'Edit NewsInsight Content' : 'Add NewsInsight Content'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowNewsInsightContentForm(false);
                  setEditingNewsInsightContent(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleNewsInsightContentSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingNewsInsightContent?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Subtitle:</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  defaultValue={editingNewsInsightContent?.subtitle || ''}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  defaultValue={editingNewsInsightContent?.description || ''}
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingNewsInsightContent?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingNewsInsightContent ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowNewsInsightContentForm(false);
                    setEditingNewsInsightContent(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'newsletter' && (
        <div className="content-section">
          <h2>Newsletter Management</h2>
          {newsletter ? (
            <div className="leadership-content-management">
              <div className="leadership-content-display">
                <h4>{newsletter.title}</h4>
                <p><strong>Subtitle:</strong> {newsletter.subtitle}</p>
                <p><strong>Description:</strong> {newsletter.description}</p>
                {newsletter.image_url && (
                  <div className="current-image">
                    <p>Current Image:</p>
                    <img 
                      src={newsletter.image_url} 
                      alt="Current" 
                      style={{width: '200px', height: '150px', objectFit: 'cover'}}
                    />
                  </div>
                )}
                <p><strong>Status:</strong> {newsletter.is_active ? 'Active' : 'Inactive'}</p>
                <div className="leadership-content-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => {
                      setEditingNewsletter(newsletter);
                      setShowNewsletterForm(true);
                    }}
                  >
                    Edit Newsletter
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p>No newsletter found.</p>
          )}
          <button 
            className="add-btn"
            onClick={() => setShowNewsletterForm(true)}
          >
            Add New Newsletter
          </button>
        </div>
      )}

      {activeTab === 'newsletter-subscriptions' && (
        <div className="content-section">
          <div className="leadership-members-management">
            <div className="leadership-members-header">
              <h3>Newsletter Subscriptions</h3>
            </div>
            
            <table className="leadership-members-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Subscribed At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {newsletterSubscriptions && Array.isArray(newsletterSubscriptions) && newsletterSubscriptions.map((subscription) => (
                  <tr key={subscription.id}>
                    <td>{subscription.email}</td>
                    <td>{new Date(subscription.subscribed_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`status ${subscription.is_active ? 'active' : 'inactive'}`}>
                        {subscription.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'contact-info' && (
        <div className="content-section">
          <h2>Contact Info Management</h2>
          {contactInfo ? (
            <div className="leadership-content-management">
              <div className="leadership-content-display">
                <h4>Contact Information</h4>
                <p><strong>Phone:</strong> {contactInfo.phone}</p>
                <p><strong>Email:</strong> {contactInfo.email}</p>
                <p><strong>Address:</strong> {contactInfo.address}</p>
                <p><strong>Working Hours:</strong> {contactInfo.working_hours}</p>
                <p><strong>Map Latitude:</strong> {contactInfo.map_latitude}</p>
                <p><strong>Map Longitude:</strong> {contactInfo.map_longitude}</p>
                <p><strong>Status:</strong> {contactInfo.is_active ? 'Active' : 'Inactive'}</p>
                <div className="leadership-content-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => {
                      setEditingContactInfo(contactInfo);
                      setShowContactInfoForm(true);
                    }}
                  >
                    Edit Contact Info
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p>No contact info found.</p>
          )}
          <button 
            className="add-btn"
            onClick={() => setShowContactInfoForm(true)}
          >
            Add New Contact Info
          </button>
        </div>
      )}

      {activeTab === 'footer-info' && (
        <div className="content-section">
          <h2>Footer Info Management</h2>
          {footerInfo ? (
            <div className="leadership-content-management">
              <div className="leadership-content-display">
                <h4>Footer Information</h4>
                <p><strong>Logo Description:</strong> {footerInfo.logo_description}</p>
                <p><strong>Status:</strong> {footerInfo.is_active ? 'Active' : 'Inactive'}</p>
                <div className="leadership-content-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => {
                      setEditingFooterInfo(footerInfo);
                      setShowFooterInfoForm(true);
                    }}
                  >
                    Edit Footer Info
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p>No footer info found.</p>
          )}
          <button 
            className="add-btn"
            onClick={() => setShowFooterInfoForm(true)}
          >
            Add New Footer Info
          </button>
        </div>
      )}

      {activeTab === 'contact-messages' && (
        <div className="content-section">
          <div className="leadership-members-management">
            <div className="leadership-members-header">
              <h3>Contact Messages</h3>
              <p>Messages sent from the contact form</p>
            </div>
            
            <table className="leadership-members-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contactMessages && Array.isArray(contactMessages) && contactMessages.map((message) => (
                  <tr key={message.id} className={!message.is_read ? 'unread-message' : ''}>
                    <td>{message.name}</td>
                    <td>{message.email}</td>
                    <td>{message.phone || '-'}</td>
                    <td>{message.subject || '-'}</td>
                    <td className="message-cell">
                      <div className="message-preview">
                        {message.message.length > 100 
                          ? `${message.message.substring(0, 100)}...` 
                          : message.message
                        }
                      </div>
                    </td>
                    <td>{new Date(message.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`status ${message.is_read ? 'read' : 'unread'}`}>
                        {message.is_read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="leadership-actions">
                      {!message.is_read && (
                        <button 
                          className="mark-read-btn"
                          onClick={() => markMessageAsRead(message.id)}
                        >
                          Mark as Read
                        </button>
                      )}
                      <button 
                        className="delete-btn"
                        onClick={() => deleteContactMessage(message.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {contactMessages.length === 0 && (
              <p className="no-messages">No contact messages found.</p>
            )}
          </div>
        </div>
      )}

      {showNewsInsightArticleForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingNewsInsightArticle ? 'Edit Article' : 'Add New Article'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowNewsInsightArticleForm(false);
                  setEditingNewsInsightArticle(null);
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleNewsInsightArticleSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingNewsInsightArticle?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  defaultValue={editingNewsInsightArticle?.description || ''}
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label>Button Text:</label>
                <input 
                  type="text" 
                  name="button_text" 
                  defaultValue={editingNewsInsightArticle?.button_text || 'Read More'}
                />
              </div>
              <div className="form-group">
                <label>Button Link:</label>
                <input 
                  type="text" 
                  name="button_link" 
                  defaultValue={editingNewsInsightArticle?.button_link || '#contact'}
                />
              </div>
              <div className="form-group">
                <label>Display Order:</label>
                <input 
                  type="number" 
                  name="display_order" 
                  defaultValue={editingNewsInsightArticle?.display_order || 0}
                />
              </div>
              <div className="form-group">
                <label>Image:</label>
                <input 
                  type="file" 
                  name="image" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                )}
                {editingNewsInsightArticle?.image_url && !imagePreview && (
                  <div className="current-image">
                    <p>Current Image:</p>
                    <img 
                      src={editingNewsInsightArticle.image_url} 
                      alt="Current" 
                      style={{width: '100px', height: '100px', objectFit: 'cover'}}
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingNewsInsightArticle?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingNewsInsightArticle ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowNewsInsightArticleForm(false);
                    setEditingNewsInsightArticle(null);
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNewsletterForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingNewsletter ? 'Edit Newsletter' : 'Add Newsletter'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowNewsletterForm(false);
                  setEditingNewsletter(null);
                  setSelectedImage(null);
                  setImagePreview(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="admin-form">
              <div className="form-group">
                <label>Title:</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingNewsletter?.title || ''}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Subtitle:</label>
                <input 
                  type="text" 
                  name="subtitle" 
                  defaultValue={editingNewsletter?.subtitle || ''}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  name="description" 
                  defaultValue={editingNewsletter?.description || ''}
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label>Image:</label>
                <input 
                  type="file" 
                  name="image" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                )}
                {editingNewsletter?.image_url && !imagePreview && (
                  <div className="current-image">
                    <p>Current Image:</p>
                    <img 
                      src={editingNewsletter.image_url} 
                      alt="Current" 
                      style={{width: '200px', height: '150px', objectFit: 'cover'}}
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingNewsletter?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingNewsletter ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowNewsletterForm(false);
                    setEditingNewsletter(null);
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showContactInfoForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingContactInfo ? 'Edit Contact Info' : 'Add Contact Info'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowContactInfoForm(false);
                  setEditingContactInfo(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleContactInfoSubmit} className="admin-form">
              <div className="form-group">
                <label>Phone:</label>
                <input 
                  type="text" 
                  name="phone" 
                  defaultValue={editingContactInfo?.phone || ''}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input 
                  type="email" 
                  name="email" 
                  defaultValue={editingContactInfo?.email || ''}
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <textarea 
                  name="address" 
                  defaultValue={editingContactInfo?.address || ''}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Working Hours:</label>
                <input 
                  type="text" 
                  name="working_hours" 
                  defaultValue={editingContactInfo?.working_hours || ''}
                />
              </div>
              <div className="form-group">
                <label>Map Latitude:</label>
                <input 
                  type="number" 
                  step="any"
                  name="map_latitude" 
                  defaultValue={editingContactInfo?.map_latitude || ''}
                />
              </div>
              <div className="form-group">
                <label>Map Longitude:</label>
                <input 
                  type="number" 
                  step="any"
                  name="map_longitude" 
                  defaultValue={editingContactInfo?.map_longitude || ''}
                />
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingContactInfo?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingContactInfo ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowContactInfoForm(false);
                    setEditingContactInfo(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFooterInfoForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingFooterInfo ? 'Edit Footer Info' : 'Add Footer Info'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowFooterInfoForm(false);
                  setEditingFooterInfo(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleFooterInfoSubmit} className="admin-form">
              <div className="form-group">
                <label>Logo Description:</label>
                <textarea 
                  name="logo_description" 
                  defaultValue={editingFooterInfo?.logo_description || ''}
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_active" 
                    defaultChecked={editingFooterInfo?.is_active || false}
                  />
                  Active
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingFooterInfo ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowFooterInfoForm(false);
                    setEditingFooterInfo(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
