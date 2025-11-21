import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGetAuth, apiPutAuth, apiPostAuth, apiDeleteAuth, apiUploadAuth, apiUpdateUploadAuth } from '../utils/api';
import { normalizeImageUrl } from '../config/api';
import WysiwygEditor from '../components/WysiwygEditor';
import './AdminDashboardNew.css';

const AdminDashboardNew = () => {
  const [activeTab, setActiveTab] = useState('admin-test');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [preserveConserveType, setPreserveConserveType] = useState('content'); // 'content' or 'feature'
  const [sortBy, setSortBy] = useState('slide_order');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Auth kontrolü
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    } else {
      loadAllData();
    }
  }, [navigate]);

  // Tüm verileri yükle
  const loadAllData = async () => {
    setLoading(true);
    try {
      // Token kontrolü
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('❌ No admin token found');
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }
      console.log('🔑 Admin token found:', token.substring(0, 20) + '...');
      const endpoints = [
        '/api/hero-slides/admin',
        '/api/brand-trust/admin/logos',
        '/api/brand-trust/admin/content',
        '/api/who-we-are/admin/content',
        '/api/who-we-are/admin/features',
        '/api/statistics/admin',
        '/api/leadership/admin/content',
        '/api/leadership/admin/members',
        '/api/projects/admin',
        '/api/projects/admin/content',
        '/api/preserve-conserve/admin/content',
        '/api/preserve-conserve/admin/features',
        '/api/global-presence/admin/content',
        '/api/global-presence/admin/map-points',
        '/api/value-section/admin/content',
        '/api/value-section/admin/statistics',
        '/api/lets-be-great/admin/content',
        '/api/lets-be-great/admin/statistics',
        '/api/newsletter/admin',
        '/api/newsletter/admin/subscriptions',
        '/api/news-insight/admin/content',
        '/api/news-insight/admin/articles',
        '/api/contact-info/admin',
        '/api/contact-messages/admin',
        '/api/faq/admin',
        '/api/faq-content/admin',
        '/api/map-points/admin',
        '/api/footer-info/admin',
        '/api/our-products/admin',
        '/api/our-products/admin/content',
        '/api/product-details/admin',
        '/api/project-details/admin',
        '/api/news-insight-details/admin'
      ];

      const results = await Promise.all(
        endpoints.map(async (endpoint) => {
          try {
            console.log(`🔄 Loading ${endpoint}...`);
            const token = localStorage.getItem('adminToken');
            console.log(`🔑 Token for ${endpoint}:`, token ? 'Present' : 'Missing');
            const response = await apiGetAuth(endpoint);
            console.log(`✅ ${endpoint} loaded:`, response);
            console.log(`📊 Response type:`, typeof response);
            console.log(`📊 Response is array:`, Array.isArray(response));
            console.log(`📊 Response length:`, Array.isArray(response) ? response.length : 'N/A');
            
            // Check if response is HTML (React build page)
            if (typeof response === 'string' && response.includes('<!DOCTYPE html>')) {
              console.error(`❌ ${endpoint} returned HTML instead of JSON - server routing issue`);
              return { endpoint, data: [] };
            }
            
            return { endpoint, data: response.error ? [] : response };
          } catch (error) {
            console.error(`❌ Error loading ${endpoint}:`, error);
            console.error(`❌ Error details:`, error.response?.data || error.message);
            return { endpoint, data: [] };
          }
        })
      );

      const newData = {};
      results.forEach(({ endpoint, data }) => {
        // Endpoint'ten unique key oluştur
        let key = endpoint.replace('/api/', '').replace(/\//g, '_');
        
        // Özel mapping'ler
        if (endpoint === '/api/hero-slides/admin') {
          key = 'hero_slides_admin';
        } else if (endpoint === '/api/who-we-are/admin/content') {
          key = 'who_we_are_content';
        } else if (endpoint === '/api/who-we-are/admin/features') {
          key = 'who_we_are_features';
        } else if (endpoint === '/api/brand-trust/admin/logos') {
          key = 'brand_trust_logos';
        } else if (endpoint === '/api/brand-trust/admin/content') {
          key = 'brand_trust_content';
        } else if (endpoint === '/api/statistics/admin') {
          key = 'statistics_admin';
        } else if (endpoint === '/api/leadership/admin/content') {
          key = 'leadership_content';
        } else if (endpoint === '/api/leadership/admin/members') {
          key = 'leadership_members';
        } else if (endpoint === '/api/projects/admin') {
          key = 'projects_admin';
        } else if (endpoint === '/api/projects/admin/content') {
          key = 'projects_content';
        } else if (endpoint === '/api/preserve-conserve/admin/content') {
          key = 'preserve_conserve_content';
        } else if (endpoint === '/api/preserve-conserve/admin/features') {
          key = 'preserve_conserve_features';
        } else if (endpoint === '/api/global-presence/admin/content') {
          key = 'global_presence_content';
        } else if (endpoint === '/api/global-presence/admin/map-points') {
          key = 'map_points';
        } else if (endpoint === '/api/value-section/admin/content') {
          key = 'value_content';
        } else if (endpoint === '/api/value-section/admin/statistics') {
          key = 'value_statistics';
        } else if (endpoint === '/api/lets-be-great/admin/content') {
          key = 'lets_be_great_content';
        } else if (endpoint === '/api/lets-be-great/admin/statistics') {
          key = 'lets_be_great_statistics';
        } else if (endpoint === '/api/news-insight/admin/content') {
          key = 'news_insight_content';
        } else if (endpoint === '/api/news-insight/admin/articles') {
          key = 'news_insight_articles';
        } else if (endpoint === '/api/newsletter/admin') {
          key = 'newsletter';
        } else if (endpoint === '/api/newsletter/admin/subscriptions') {
          key = 'newsletter_subscriptions';
        } else if (endpoint === '/api/contact-info/admin') {
          key = 'contact_info';
        } else if (endpoint === '/api/contact-messages/admin') {
          key = 'contact_messages';
          console.log('📧 Contact Messages Response:', data);
        } else if (endpoint === '/api/faq/admin') {
          key = 'faq_admin';
        } else if (endpoint === '/api/faq-content/admin') {
          key = 'faq_content_admin';
        } else if (endpoint === '/api/map-points/admin') {
          key = 'map_points';
          console.log('🗺️ Map Points Response:', data);
        } else if (endpoint === '/api/footer-info/admin') {
          key = 'footer_info';
        } else if (endpoint === '/api/our-products/admin') {
          key = 'our_products';
        } else if (endpoint === '/api/our-products/admin/content') {
          key = 'our_products_content';
        } else if (endpoint === '/api/product-details/admin') {
          key = 'product_details';
          console.log('🎯 Product Details Mapping:', { endpoint, key, data, dataType: typeof data, isArray: Array.isArray(data) });
        } else if (endpoint === '/api/project-details/admin') {
          key = 'project_details';
          console.log('🎯 Project Details Mapping:', { endpoint, key, data, dataType: typeof data, isArray: Array.isArray(data) });
        } else if (endpoint === '/api/news-insight-details/admin') {
          key = 'news_insight_details';
          console.log('🎯 News Insight Details Mapping:', { endpoint, key, data, dataType: typeof data, isArray: Array.isArray(data) });
        }
        
        // Ensure data is always an array to prevent map errors
        newData[key] = Array.isArray(data) ? data : [];
        console.log('📊 Data stored for key:', key, 'Value:', newData[key]);
      });

      setData(newData);
    } catch (error) {
      console.error('❌ Error loading data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleCreate = async (endpoint, formData) => {
    try {
      // Check if formData is FormData (has image) or regular object
      const isFormData = formData instanceof FormData;
      const response = isFormData 
        ? await apiUploadAuth(endpoint, formData)
        : await apiPostAuth(endpoint, formData);
        
      if (!response.error) {
        await loadAllData();
        setShowForm(false);
        setEditingItem(null);
        setSelectedImage(null);
        setImagePreview(null);
        setError('');
      } else {
        setError(response.error);
      }
    } catch (error) {
      setError('Failed to create item');
    }
  };

  const handleUpdate = async (endpoint, id, formData) => {
    try {
      // Check if formData is FormData (has image) or regular object
      const isFormData = formData instanceof FormData;
      const response = isFormData 
        ? await apiUpdateUploadAuth(`${endpoint}/${id}`, formData)
        : await apiPutAuth(`${endpoint}/${id}`, formData);
        
      if (!response.error) {
        await loadAllData();
        setShowForm(false);
        setEditingItem(null);
        setSelectedImage(null);
        setImagePreview(null);
        setError('');
      } else {
        setError(response.error);
      }
    } catch (error) {
      setError('Failed to update item');
    }
  };

  const handleDelete = async (endpoint, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await apiDeleteAuth(`${endpoint}/${id}`);
        if (!response.error) {
          await loadAllData();
          setError('');
        } else {
          setError(response.error);
        }
      } catch (error) {
        setError('Failed to delete item');
      }
    }
  };

  // Image upload handler
  const handleImageUpload = (file) => {
    console.log('📸 handleImageUpload called with file:', file);
    if (file) {
      console.log('📸 File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('📸 FileReader onload - Preview created');
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.log('📸 No file selected');
    }
  };

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'hero-slides':
        return renderHeroSlides();
      case 'brand-trust':
        return renderBrandTrust();
      case 'brand-trust-content':
        return renderBrandTrustContent();
      case 'who-we-are':
        return renderWhoWeAre();
      case 'who-we-are-features':
        return renderWhoWeAreFeatures();
      case 'statistics':
        return renderStatistics();
      case 'leadership':
        return renderLeadership();
      case 'leadership-content':
        return renderLeadershipContent();
      case 'projects':
        return renderProjects();
      case 'projects-content':
        return renderProjectsContent();
      case 'news-insight-content':
        return renderNewsInsightContent();
      case 'news-insight-articles':
        return renderNewsInsightArticles();
      case 'preserve-conserve':
        return renderPreserveConserve();
      case 'global-presence':
        return renderGlobalPresence();
      case 'value-section':
        return renderValueSection();
      case 'value-statistics':
        return renderValueStatistics();
      case 'lets-be-great':
        return renderLetsBeGreat();
      case 'hero-stats-statistics':
        return renderHeroStatsStatistics();
      case 'newsletter':
        return renderNewsletter();
      case 'newsletter-subscriptions':
        return renderNewsletterSubscriptions();
      case 'our-products':
        return renderOurProducts();
      case 'our-products-content':
        return renderOurProductsContent();
      case 'contact':
        return renderContact();
      case 'contact-messages':
        return renderContactMessages();
      case 'faq':
        return renderFAQ();
      case 'faq-image':
        return renderFAQImage();
      case 'map-points':
        return renderMapPoints();
      case 'footer':
        return renderFooter();
      case 'product-details':
        return renderProductDetails();
      case 'project-details':
        return renderProjectDetails();
      case 'news-insight-details':
        return renderNewsInsightDetails();
      default:
        return <div>Select a tab to manage content</div>;
    }
  };


  // Filter and sort hero slides
  const getFilteredAndSortedSlides = () => {
    let slides = Array.isArray(data['hero_slides_admin']) ? data['hero_slides_admin'] : [];
    console.log('🔍 Hero Slides in getFilteredAndSortedSlides:', slides);
    
    // Filter by status
    if (filterStatus !== 'all') {
      slides = slides.filter(slide => 
        filterStatus === 'active' ? slide.is_active : !slide.is_active
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      slides = slides.filter(slide => 
        slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (slide.subtitle && slide.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (slide.content && slide.content.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Sort slides
    slides.sort((a, b) => {
      switch (sortBy) {
        case 'slide_order':
          return (a.slide_order || 0) - (b.slide_order || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created_at':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'updated_at':
          return new Date(b.updated_at) - new Date(a.updated_at);
        default:
          return 0;
      }
    });
    
    return slides;
  };

  // Hero Slides
  const renderHeroSlides = () => {
    const filteredSlides = getFilteredAndSortedSlides();
    console.log('🎯 Hero Slides Data:', data['hero_slides_admin']);
    
    return (
    <div className="admin-section">
      <div className="section-header">
        <div className="section-title">
          <h2>Hero Slides Management</h2>
          <p>Manage your homepage hero slider content</p>
        </div>
        <button onClick={() => { 
          setShowForm(true); 
          setEditingItem(null); 
          setSelectedImage(null); 
          setImagePreview(null); 
        }} className="btn-primary">
          <i className="fas fa-plus"></i> Add New Slide
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search slides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Slides</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="slide_order">Sort by Order</option>
            <option value="title">Sort by Title</option>
            <option value="created_at">Sort by Created Date</option>
            <option value="updated_at">Sort by Updated Date</option>
          </select>
        </div>
      </div>
      
      {filteredSlides.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-images"></i>
          <h3>{data['hero_slides_admin']?.length === 0 ? 'No Hero Slides Found' : 'No Slides Match Your Filters'}</h3>
          <p>{data['hero_slides_admin']?.length === 0 ? 'Create your first hero slide to get started' : 'Try adjusting your search or filter criteria'}</p>
          <button onClick={() => { 
            setShowForm(true); 
            setEditingItem(null); 
            setSelectedImage(null); 
            setImagePreview(null); 
          }} className="btn-primary">
            {data['hero_slides_admin']?.length === 0 ? 'Add First Slide' : 'Add New Slide'}
          </button>
        </div>
      ) : (
        <div className="hero-slides-container">
          <div className="slides-stats">
            <div className="stat-item">
              <span className="stat-number">{filteredSlides.length}</span>
              <span className="stat-label">Showing Slides</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{filteredSlides.filter(s => s.is_active).length}</span>
              <span className="stat-label">Active in Results</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{data['hero_slides_admin']?.length || 0}</span>
              <span className="stat-label">Total Slides</span>
            </div>
          </div>
          
          <div className="hero-slides-grid">
            {filteredSlides && Array.isArray(filteredSlides) && filteredSlides.map((slide, index) => (
              <div key={slide.id} className={`hero-slide-card ${!slide.is_active ? 'inactive' : ''}`}>
                <div className="slide-preview">
                  <div className="slide-image">
                    {slide.image_url ? (
                <img src={normalizeImageUrl(slide.image_url)} alt={slide.title} />
                    ) : (
                      <div className="no-image">
                        <i className="fas fa-image"></i>
                        <span>No Image</span>
                      </div>
              )}
            </div>
                  <div className="slide-order-badge">
                    #{slide.slide_order || index + 1}
              </div>
                  <div className="slide-status">
                    <span className={`status-badge ${slide.is_active ? 'active' : 'inactive'}`}>
                      {slide.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="slide-content">
                  <h3 className="slide-title">{slide.title}</h3>
                  {slide.subtitle && (
                    <p className="slide-subtitle">{slide.subtitle}</p>
                  )}
                  {slide.content && (
                    <p className="slide-description">
                      {slide.content.length > 120 
                        ? `${slide.content.substring(0, 120)}...` 
                        : slide.content
                      }
                    </p>
                  )}
                  
                  <div className="slide-meta">
                    <div className="meta-item">
                      <i className="fas fa-mouse-pointer"></i>
                      <span>{slide.button_text || 'No Button'}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-link"></i>
                      <span>{slide.button_link || 'No Link'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="slide-actions">
                  <button 
                    onClick={() => { 
                      setEditingItem(slide); 
                      setShowForm(true); 
                      setSelectedImage(null); 
                      setImagePreview(null); 
                    }} 
                    className="btn-edit"
                    title="Edit Slide"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    onClick={() => handleDelete('/api/hero-slides/admin', slide.id)} 
                    className="btn-delete"
                    title="Delete Slide"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
            </div>
          </div>
        ))}
      </div>
        </div>
      )}
    </div>
  );
  };


  // Brand Trust
  const renderBrandTrust = () => {
    const logos = Array.isArray(data['brand_trust_logos']) ? data['brand_trust_logos'] : [];
    const content = Array.isArray(data['brand_trust_content']) ? data['brand_trust_content'] : [];
    
    return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Brand Trust</h2>
          <p>Manage brand logos and trust content</p>
          <div className="section-actions">
            <button 
              onClick={() => {
                setEditingItem(null);
                setSelectedImage(null);
                setImagePreview(null);
                setShowForm(true);
              }} 
              className="btn-primary"
            >
              Add New Logo
            </button>
            <button 
              onClick={() => {
                setEditingItem(null);
                setSelectedImage(null);
                setImagePreview(null);
                setShowForm(true);
              }} 
              className="btn-secondary"
            >
              Manage Content
            </button>
          </div>
      </div>
      
        {logos.length === 0 ? (
          <div className="empty-state">
            <p>No brand logos found. Add your first logo to get started.</p>
          </div>
        ) : (
          <>
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">{logos.length}</span>
                <span className="stat-label">Total Logos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{logos.filter(logo => logo.is_active).length}</span>
                <span className="stat-label">Active Logos</span>
              </div>
            </div>
            
            <div className="hero-features-grid">
              {logos && Array.isArray(logos) && logos.map((logo, index) => (
                <div key={logo.id} className={`hero-feature-card ${!logo.is_active ? 'inactive' : ''}`}>
                  <div className="feature-icon">
                    {logo.logo_url ? (
                      <img 
                        src={normalizeImageUrl(logo.logo_url)} 
                        alt={logo.brand_name}
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                      />
                    ) : (
                      <i className="fas fa-image"></i>
              )}
            </div>
                  
                  <div className="feature-content">
                    <h3 className="feature-title">{logo.brand_name}</h3>
                    <div className="feature-meta">
                      <span className="order-badge">Order: {logo.display_order || 0}</span>
                      <span className={`status-badge ${logo.is_active ? 'active' : 'inactive'}`}>
                        {logo.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="feature-actions">
                      <button 
                        onClick={() => {
                          setEditingItem(logo);
                          setSelectedImage(null);
                          setImagePreview(null);
                          setShowForm(true);
                        }} 
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete('/api/brand-trust/admin/logos', logo.id)} 
                        className="btn-delete"
                      >
                        Delete
                      </button>
              </div>
            </div>
          </div>
        ))}
      </div>
          </>
        )}
    </div>
  );
  };

  // Brand Trust Content
  const renderBrandTrustContent = () => {
    const content = Array.isArray(data['brand_trust_content']) ? data['brand_trust_content'] : [];
    
    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>Brand Trust Content</h2>
          <p>Manage brand trust title and content</p>
          <button 
            onClick={() => {
              setEditingItem(null);
              setSelectedImage(null);
              setImagePreview(null);
              setShowForm(true);
            }} 
            className="btn-primary"
          >
            {content.length > 0 ? 'Edit Content' : 'Add Content'}
          </button>
        </div>
        
        {content.length === 0 ? (
          <div className="empty-state">
            <p>No brand trust content found. Add content to get started.</p>
          </div>
        ) : (
          <div className="hero-features-grid">
            {content && Array.isArray(content) && content.map((item, index) => (
              <div key={item.id} className={`hero-feature-card ${!item.is_active ? 'inactive' : ''}`}>
                <div className="feature-icon">
                  <i className="fas fa-text-width"></i>
                </div>
                
                <div className="feature-content">
                  <h3 className="feature-title">Brand Trust Title</h3>
                  <p className="feature-description">
                    {item.title && item.title.length > 150 
                      ? `${item.title.substring(0, 150)}...` 
                      : item.title || 'No title set'
                    }
                  </p>
                  <div className="feature-meta">
                    <span className={`status-badge ${item.is_active ? 'active' : 'inactive'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="feature-actions">
                    <button 
                      onClick={() => {
                        setEditingItem(item);
                        setSelectedImage(null);
                        setImagePreview(null);
                        setShowForm(true);
                      }} 
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete('/api/brand-trust/admin/content', item.id)} 
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Who We Are Content
  const renderWhoWeAre = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Who We Are Content</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add New Content</button>
      </div>
      
      <div className="data-grid">
        {data['who_we_are_content']?.map((item) => (
          <div key={item.id} className="data-card">
            <div className="card-image">
              {item.image_url && (
                <img src={normalizeImageUrl(item.image_url)} alt={item.title} />
              )}
            </div>
            <div className="card-content">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
              <div className="card-actions">
                <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/who-we-are/admin/content', item.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Who We Are Features
  const renderWhoWeAreFeatures = () => (
    <div className="admin-section">
      <div className="section-header">
        <h2>Who We Are Features</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add New Feature</button>
      </div>
      
      <div className="data-grid">
        {data['who_we_are_features']?.map((item) => (
          <div key={item.id} className="data-card">
            <div className="card-content">
              <h3>{item.feature_text}</h3>
              <p>Order: {item.display_order}</p>
              <p>Status: {item.is_active ? 'Active' : 'Inactive'}</p>
              <div className="card-actions">
                <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/who-we-are/admin/features', item.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );



  // Leadership Content
  const renderLeadershipContent = () => {
    console.log('🎯 Leadership Content Data:', data['leadership_content']);
    return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Leadership Content</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add New Content</button>
      </div>
      
      <div className="data-grid">
        {data['leadership_content']?.map((item) => (
          <div key={item.id} className="data-card">
            <div className="card-content">
              <h3>{item.title}</h3>
              <p className="card-subtitle">{item.subtitle}</p>
              <p className="card-description">
                {item.description ? (item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description) : 'No description'}
              </p>
              <div className="card-meta">
                <span className="button-text">Button: {item.button_text || 'N/A'}</span>
                <span className="button-link">Link: {item.button_link || 'N/A'}</span>
                <span className={`status ${item.is_active ? 'active' : 'inactive'}`}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="card-actions">
                <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/leadership/admin/content', item.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

  // Projects Content
  const renderProjectsContent = () => {
    console.log('🎯 Projects Content Data:', data['projects_content']);
    return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Projects Content</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add New Content</button>
      </div>
      
      <div className="data-grid">
        {data['projects_content']?.map((item) => (
          <div key={item.id} className="data-card">
            <div className="card-content">
              <h3>{item.title}</h3>
              <p className="card-subtitle">{item.subtitle}</p>
              <p className="card-description">
                {item.description ? (item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description) : 'No description'}
              </p>
              <div className="card-meta">
                <span className={`status ${item.is_active ? 'active' : 'inactive'}`}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="card-actions">
                <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/projects/admin/content', item.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

  // News Insight Content
  const renderNewsInsightContent = () => {
    console.log('🎯 News Insight Content Data:', data['news_insight_content']);
    return (
    <div className="admin-section">
      <div className="section-header">
        <h2>News Insight Content</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add New Content</button>
      </div>
      
      <div className="data-grid">
        {data['news_insight_content']?.map((item) => (
          <div key={item.id} className="data-card">
            <div className="card-content">
              <h3>{item.title}</h3>
              <p className="card-subtitle">{item.subtitle}</p>
              <p className="card-description">
                {item.description ? (item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description) : 'No description'}
              </p>
              <div className="card-meta">
                <span className={`status ${item.is_active ? 'active' : 'inactive'}`}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="card-actions">
                <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/news-insight/admin/content', item.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

  // News Insight Articles
  const renderNewsInsightArticles = () => {
    console.log('🎯 News Insight Articles Data:', data['news_insight_articles']);
    return (
    <div className="admin-section">
      <div className="section-header">
        <h2>News Insight Articles</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add New Article</button>
      </div>
      
      <div className="data-grid">
        {data['news_insight_articles']?.map((item) => (
          <div key={item.id} className="data-card">
            <div className="card-image">
              {item.image_url && (
                <img src={normalizeImageUrl(item.image_url)} alt={item.title} />
              )}
            </div>
            <div className="card-content">
              <h3>{item.title}</h3>
              <p className="card-subtitle">{item.article_tag}</p>
              <p className="card-description">
                {item.description ? (item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description) : 'No description'}
              </p>
              <div className="card-meta">
                <span className="meta-item">Date: {item.article_date}</span>
                <span className="meta-item">Comments: {item.comments_count}</span>
                <span className="meta-item">Order: {item.display_order}</span>
                <span className={`status ${item.is_active ? 'active' : 'inactive'}`}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="card-actions">
                <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/news-insight/admin/articles', item.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

  // Statistics
  const renderStatistics = () => {
    console.log('🎯 Statistics Data:', data['statistics_admin']);
    return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Statistics</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add New Statistic</button>
      </div>
      
      <div className="data-grid">
        {data['statistics_admin']?.map((stat) => (
          <div key={stat.id} className="data-card">
            <div className="card-content">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
              <p>{stat.description}</p>
              <div className="card-actions">
                <button onClick={() => { setEditingItem(stat); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/statistics/admin', stat.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

  // Leadership
  const renderLeadership = () => {
    console.log('🎯 Leadership Data:', data['leadership_members']);
    return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Leadership Members</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add New Member</button>
      </div>
      
      <div className="data-grid">
        {data['leadership_members']?.map((member) => (
          <div key={member.id} className="data-card">
            <div className="card-image">
              {member.image_url && (
                <img src={normalizeImageUrl(member.image_url)} alt={member.name} />
              )}
            </div>
            <div className="card-content">
              <h3>{member.name}</h3>
              <p>{member.position}</p>
              <div className="card-actions">
                <button onClick={() => { setEditingItem(member); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/leadership/admin/members', member.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

  // Projects
  const renderProjects = () => {
    console.log('🎯 Projects Data:', data['projects_admin']);
    return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Projects</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add New Project</button>
      </div>
      
      <div className="data-grid">
        {data['projects_admin']?.map((project) => (
          <div key={project.id} className="data-card">
            <div className="card-image">
              {project.image_url && (
                <img src={normalizeImageUrl(project.image_url)} alt={project.title} />
              )}
            </div>
            <div className="card-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="card-actions">
                <button onClick={() => { setEditingItem(project); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/projects/admin', project.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

  // Preserve & Conserve
  const renderPreserveConserve = () => {
    console.log('🎯 Preserve & Conserve Content Data:', data['preserve_conserve_content']);
    console.log('🎯 Preserve & Conserve Features Data:', data['preserve_conserve_features']);
    
    const contentData = data['preserve_conserve_content'] || [];
    const featuresData = data['preserve_conserve_features'] || [];
    
    return (
      <div className="admin-section">
        {/* Content Section */}
        <div className="section-header">
          <h2>Preserve & Conserve Content</h2>
          <button 
            onClick={() => { 
              setEditingItem(null); 
              setPreserveConserveType('content');
              setShowForm(true); 
            }} 
            className="btn-primary"
          >
            Add New Content
          </button>
        </div>
        
        <div className="data-grid">
          {contentData.length > 0 ? (
            contentData.map((item) => (
              <div key={item.id} className="data-card">
                <div className="card-image">
                  {item.background_image_url ? (
                    <img 
                      src={normalizeImageUrl(item.background_image_url)} 
                      alt={item.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '200px', 
                      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '14px'
                    }}>
                      No Background Image
                    </div>
                  )}
                </div>
                <div className="card-content">
                  <h3>{item.title}</h3>
                  <p><strong>Subtitle:</strong> {item.subtitle}</p>
                  <p><strong>Description:</strong> {item.description?.substring(0, 100)}...</p>
                  <p><strong>Button:</strong> {item.button_text} → {item.button_link}</p>
                  <p><strong>Status:</strong> {item.is_active ? 'Active' : 'Inactive'}</p>
                  <div className="card-actions">
                    <button 
                      onClick={() => { 
                        setEditingItem(item); 
                        setPreserveConserveType('content');
                        setShowForm(true); 
                      }} 
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete('/api/preserve-conserve/admin/content', item.id)} 
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <h3>No Content Found</h3>
              <p>Click "Add New Content" to create the first content item.</p>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="section-header" style={{ marginTop: '60px' }}>
          <h2>Preserve & Conserve Features</h2>
          <button 
            onClick={() => { 
              setEditingItem(null); 
              setPreserveConserveType('feature');
              setShowForm(true); 
            }} 
            className="btn-primary"
          >
            Add New Feature
          </button>
        </div>
        
        <div className="data-grid">
          {featuresData.length > 0 ? (
            featuresData.map((item) => (
              <div key={item.id} className="data-card">
                <div className="card-image">
                  {item.icon_url ? (
                    <img 
                      src={normalizeImageUrl(item.icon_url)} 
                      alt={item.title}
                      style={{ width: '100%', height: '200px', objectFit: 'contain' }}
                    />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '200px', 
                      background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '14px'
                    }}>
                      No Icon
                    </div>
                  )}
                </div>
                <div className="card-content">
                  <h3>{item.title}</h3>
                  <p><strong>Description:</strong> {item.description}</p>
                  <p><strong>Order:</strong> {item.display_order}</p>
                  <p><strong>Status:</strong> {item.is_active ? 'Active' : 'Inactive'}</p>
                  <div className="card-actions">
                    <button 
                      onClick={() => { 
                        setEditingItem(item); 
                        setPreserveConserveType('feature');
                        setShowForm(true); 
                      }} 
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete('/api/preserve-conserve/admin/features', item.id)} 
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <h3>No Features Found</h3>
              <p>Click "Add New Feature" to create the first feature item.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Global Presence
  const renderGlobalPresence = () => {
    console.log('🎯 Global Presence Data:', data['global_presence_content']);
    return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Global Presence</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add New Content</button>
      </div>
      
      <div className="data-grid">
        {data['global_presence_content']?.map((item) => (
          <div key={item.id} className="data-card">
            <div className="card-content">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
              <p>{item.description}</p>
              <div className="card-actions">
                <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/global-presence/admin/content', item.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

  // Value Section
  const renderValueSection = () => {
    return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Value Section</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add New Content</button>
      </div>
      
      <div className="data-grid">
        {data['value_content']?.map((item) => (
          <div key={item.id} className="data-card">
            <div className="card-image">
              {item.image_url && (
                <img src={normalizeImageUrl(item.image_url)} alt={item.title} />
              )}
            </div>
            <div className="card-content">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
              <div className="card-actions">
                <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/value-section/admin/content', item.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

  // Lets Be Great
  const renderLetsBeGreat = () => {
    console.log('🎯 Lets Be Great Data:', data['lets_be_great_content']);
    return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Lets Be Great Together</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add New Content</button>
      </div>
      
      <div className="data-grid">
        {data['lets_be_great_content']?.map((item) => (
          <div key={item.id} className="data-card">
            <div className="card-image">
              {item.background_image_url && (
                <img src={normalizeImageUrl(item.background_image_url)} alt={item.title} />
              )}
            </div>
            <div className="card-content">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
              <div className="card-actions">
                <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/lets-be-great/admin/content', item.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

  // Value Statistics
  const renderValueStatistics = () => {
    console.log('🎯 Value Statistics Data:', data['value_statistics']);
    return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Value Statistics</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add New Statistic</button>
      </div>
      
      <div className="data-grid">
        {data['value_statistics']?.map((stat) => (
          <div key={stat.id} className="data-card">
            <div className="card-content">
              <h3>{stat.title}</h3>
              <div className="stat-percentage">
                <span className="percentage-value">{stat.percentage}%</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${stat.percentage}%`}}
                  ></div>
                </div>
              </div>
              <p className="stat-description">
                {stat.description || 'No description available'}
              </p>
              <div className="stat-meta">
                <span className="display-order">Order: {stat.display_order}</span>
                <span className={`status ${stat.is_active ? 'active' : 'inactive'}`}>
                  {stat.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="card-actions">
                <button onClick={() => { setEditingItem(stat); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/value-section/admin/statistics', stat.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

  // Hero Stats Statistics
  const renderHeroStatsStatistics = () => {
    console.log('🎯 Hero Stats Statistics Data:', data['lets_be_great_statistics']);
    return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Hero Stats Statistics</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add New Statistic</button>
      </div>
      
      <div className="data-grid">
        {data['lets_be_great_statistics']?.map((stat) => (
          <div key={stat.id} className="data-card">
            <div className="card-content">
              <h3>{stat.title}</h3>
              <div className="stat-percentage">
                <span className="percentage-value">{stat.percentage}%</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${stat.percentage}%`}}
                  ></div>
                </div>
              </div>
              <p className="stat-description">
                {stat.description || 'No description available'}
              </p>
              <div className="stat-meta">
                <span className="display-order">Order: {stat.display_order}</span>
                <span className={`status ${stat.is_active ? 'active' : 'inactive'}`}>
                  {stat.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="card-actions">
                <button onClick={() => { setEditingItem(stat); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/lets-be-great/admin/statistics', stat.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };


  // Newsletter
  const renderNewsletter = () => {
    console.log('🎯 Newsletter Data:', data['newsletter']);
    return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Newsletter</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add New Newsletter</button>
      </div>
      
      <div className="data-grid">
        {data['newsletter']?.map((item) => (
          <div key={item.id} className="data-card">
            <div className="card-image">
              {item.image_url && (
                <img src={normalizeImageUrl(item.image_url)} alt={item.title} />
              )}
            </div>
            <div className="card-content">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
              <div className="card-actions">
                <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/newsletter/admin', item.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

  // Our Products
  const renderOurProducts = () => {
    const products = data['our_products'] || [];
    
    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>Our Products</h2>
          <button onClick={() => { setEditingItem(null); setShowForm(true); }} className="btn-primary">
            Add New Product
          </button>
        </div>
        
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-icon">
                {product.icon_url ? (
                  <img 
                    src={normalizeImageUrl(product.icon_url)} 
                    alt={product.title}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                ) : (
                  <div className="placeholder-icon">
                    {product.title ? product.title.charAt(0) : '?'}
                  </div>
                )}
              </div>
              <div className="product-content">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <div className="product-meta">
                  <span className={`status ${product.is_active ? 'active' : 'inactive'}`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="order">Order: {product.display_order}</span>
                </div>
                <div className="card-actions">
                  <button onClick={() => { setEditingItem(product); setShowForm(true); }} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete('/api/our-products/admin', product.id)} className="btn-delete">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Our Products Content
  const renderOurProductsContent = () => {
    const content = data['our_products_content'] || [];
    
    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>Our Products Content</h2>
          <button onClick={() => { setEditingItem(null); setShowForm(true); }} className="btn-primary">
            Add New Content
          </button>
        </div>
        
        <div className="data-grid">
          {content.map((item) => (
            <div key={item.id} className="data-card">
              <div className="card-content">
                <h3>{item.title}</h3>
                <p><strong>Subtitle:</strong> {item.subtitle}</p>
                <p><strong>Status:</strong> 
                  <span className={`status ${item.is_active ? 'active' : 'inactive'}`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
                <p><strong>Created:</strong> {new Date(item.created_at).toLocaleString()}</p>
                <div className="card-actions">
                  <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete('/api/our-products/admin/content', item.id)} className="btn-delete">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Newsletter Subscriptions
  const renderNewsletterSubscriptions = () => {
    console.log('🎯 Newsletter Subscriptions Data:', data['newsletter_subscriptions']);
    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>Newsletter Subscriptions</h2>
          <div className="subscription-stats">
            <span className="stat-item">
              Total: {data['newsletter_subscriptions']?.length || 0}
            </span>
            <span className="stat-item">
              Active: {data['newsletter_subscriptions']?.filter(sub => sub.is_active === 1).length || 0}
            </span>
          </div>
        </div>
        
        <div className="data-grid">
          {data['newsletter_subscriptions']?.map((subscription) => (
            <div key={subscription.id} className="data-card">
              <div className="card-content">
                <h3>{subscription.email}</h3>
                <p>
                  <strong>Subscribed:</strong> {new Date(subscription.subscribed_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong> 
                  <span className={subscription.is_active ? 'active' : 'inactive'}>
                    {subscription.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
                {subscription.unsubscribed_at && (
                  <p>
                    <strong>Unsubscribed:</strong> {new Date(subscription.unsubscribed_at).toLocaleDateString()}
                  </p>
                )}
                <div className="card-actions">
                  <button 
                    onClick={() => handleDelete('/api/newsletter/admin/subscriptions', subscription.id)} 
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Contact
  const renderContact = () => {
    console.log('🎯 Contact Data:', data['contact_info']);
    return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Contact Information</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add New Contact Info</button>
      </div>
      
      <div className="data-grid">
        {data['contact_info']?.map((item) => (
          <div key={item.id} className="data-card">
            <div className="card-content">
              <h3>{item.field_name}</h3>
              <p><strong>Type:</strong> {item.field_type}</p>
              <p><strong>Value:</strong> {item.field_value}</p>
              {item.whatsapp && (
                <p><strong>WhatsApp:</strong> {item.whatsapp}</p>
              )}
              {item.gsm && (
                <p><strong>GSM:</strong> {item.gsm}</p>
              )}
              {item.map_latitude && item.map_longitude && (
                <p><strong>Map:</strong> {item.map_latitude}, {item.map_longitude}</p>
              )}
              <div className="card-actions">
                <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/contact-info/admin', item.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

  // Contact Messages
  const renderContactMessages = () => {
    console.log('🎯 Contact Messages Data:', data['contact_messages']);
    console.log('🎯 Contact Messages Data Type:', typeof data['contact_messages']);
    console.log('🎯 Contact Messages Data Length:', data['contact_messages']?.length);
    console.log('🎯 Full data object keys:', Object.keys(data));
    return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Contact Messages</h2>
        <div className="message-stats">
          <span className="stat-item">Total: {data['contact_messages']?.length || 0}</span>
          <span className="stat-item">Unread: {data['contact_messages']?.filter(msg => !msg.is_read).length || 0}</span>
        </div>
      </div>
      
      <div className="data-grid">
        {data['contact_messages']?.map((message) => (
          <div key={message.id} className={`data-card ${!message.is_read ? 'unread' : ''}`}>
            <div className="card-content">
              <div className="message-header">
                <h3>{message.name}</h3>
                <span className={`status ${message.is_read ? 'read' : 'unread'}`}>
                  {message.is_read ? 'Read' : 'Unread'}
                </span>
              </div>
              <div className="message-meta">
                <p><strong>Email:</strong> {message.email}</p>
                {message.phone && <p><strong>Phone:</strong> {message.phone}</p>}
                {message.company && <p><strong>Company:</strong> {message.company}</p>}
                {message.subject && <p><strong>Subject:</strong> {message.subject}</p>}
                <p><strong>Date:</strong> {new Date(message.created_at).toLocaleString()}</p>
              </div>
              <div className="message-content">
                <p><strong>Message:</strong></p>
                <p className="message-preview">
                  {message.message.length > 100 
                    ? `${message.message.substring(0, 100)}...` 
                    : message.message
                  }
                </p>
              </div>
              <div className="card-actions">
                <button 
                  onClick={() => handleReadMessage(message)} 
                  className="btn-read"
                >
                  Read
                </button>
                <button 
                  onClick={() => handleDelete('/api/contact-messages/admin', message.id)} 
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

  // FAQ
  const renderFAQ = () => {
    const faqData = Array.isArray(data['faq_admin']) ? data['faq_admin'] : [];
    console.log('🎯 FAQ Data:', data['faq_admin']);
    
    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>FAQ Management</h2>
          <button 
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }} 
            className="btn-primary"
          >
            Add New FAQ
          </button>
        </div>
        
        <div className="data-grid">
          {faqData && faqData.length > 0 ? (
            faqData.map((faq, index) => (
              <div key={faq.id} className={`data-card ${!faq.is_active ? 'inactive' : ''}`}>
                <div className="card-content">
                  {faq.image_url && (
                    <div className="faq-image-preview">
                      <img src={faq.image_url} alt="FAQ Image" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                    </div>
                  )}
                  <h3 className="faq-question">{faq.question}</h3>
                  <p className="faq-answer">{faq.answer}</p>
                  <div className="card-meta">
                    <span className="meta-item">
                      <strong>Order:</strong> {faq.display_order || index + 1}
                    </span>
                    <span className="meta-item">
                      <strong>Status:</strong> 
                      <span className={`status ${faq.is_active ? 'active' : 'inactive'}`}>
                        {faq.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </span>
                  </div>
                  <div className="card-actions">
                    <button 
                      onClick={() => { 
                        setEditingItem(faq); 
                        setShowForm(true); 
                      }} 
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete('/api/faq', faq.id)} 
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No FAQ items found. Add your first FAQ to get started.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // FAQ Image
  const renderFAQImage = () => {
    const faqContentData = Array.isArray(data['faq_content_admin']) ? data['faq_content_admin'] : [];
    console.log('🎯 FAQ Content Data:', data['faq_content_admin']);
    
    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>FAQ Image Management</h2>
          <button 
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }} 
            className="btn-primary"
          >
            Add New FAQ Image
          </button>
        </div>
        
        <div className="data-grid">
          {faqContentData && faqContentData.length > 0 ? (
            faqContentData.map((content, index) => (
              <div key={content.id} className={`data-card ${!content.is_active ? 'inactive' : ''}`}>
                <div className="card-content">
                  {content.image_url && (
                    <div className="faq-image-preview">
                      <img src={content.image_url} alt="FAQ Image" style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                    </div>
                  )}
                  <h3 className="faq-title">{content.title}</h3>
                  <p className="faq-subtitle">{content.subtitle}</p>
                  <div className="card-meta">
                    <span className="meta-item">
                      <strong>Status:</strong> 
                      <span className={`status ${content.is_active ? 'active' : 'inactive'}`}>
                        {content.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </span>
                  </div>
                  <div className="card-actions">
                    <button 
                      onClick={() => { 
                        setEditingItem(content); 
                        setShowForm(true); 
                      }} 
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete('/api/faq-content', content.id)} 
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No FAQ image found. Add your first FAQ image to get started.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Map Points
  const renderMapPoints = () => {
    console.log('🗺️ Map Points Data:', data['map_points']);
    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>Map Points</h2>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add New Map Point</button>
        </div>
        
        <div className="data-grid">
          {data['map_points']?.map((point) => (
            <div key={point.id} className="data-card">
              <div className="card-content">
                <h3>{point.title}</h3>
                <p><strong>Description:</strong> {point.description || 'No description'}</p>
                <p><strong>Coordinates:</strong> {point.latitude && point.longitude ? `${point.latitude}, ${point.longitude}` : 'Not set'}</p>
                <p><strong>Position:</strong> {point.x && point.y ? `X: ${point.x}, Y: ${point.y}` : 'Not set'}</p>
                <p><strong>Marker Type:</strong> {point.marker_type || 'default'}</p>
                <p><strong>Display Order:</strong> {point.display_order || 0}</p>
                <p><strong>Status:</strong> {point.is_active ? 'Active' : 'Inactive'}</p>
                <p><strong>Created:</strong> {new Date(point.created_at).toLocaleString()}</p>
              </div>
              <div className="card-actions">
                <button onClick={() => { setEditingItem(point); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/map-points/admin', point.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Product Details
  const renderProductDetails = () => {
    console.log('🎯 Product Details Data:', data['product_details']);
    console.log('🎯 All Data Keys:', Object.keys(data));
    console.log('🎯 Product Details Type:', typeof data['product_details']);
    console.log('🎯 Product Details Is Array:', Array.isArray(data['product_details']));
    console.log('🎯 Product Details Length:', data['product_details']?.length);
    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>Product Details</h2>
          <button onClick={() => { setEditingItem(null); setShowForm(true); }} className="btn-primary">
            Add New Product Detail
          </button>
        </div>
        
        <div className="data-grid">
          {data['product_details']?.map((detail) => {
            // Use product_name from backend or find from our_products
            const productName = detail.product_name || data['our_products']?.find(p => p.id === detail.product_id)?.title || `Product ID: ${detail.product_id}`;
            
            // Parse content sections for display
            let contentSectionsText = 'No sections';
            if (detail.content_sections) {
              try {
                const sections = typeof detail.content_sections === 'string' 
                  ? JSON.parse(detail.content_sections) 
                  : detail.content_sections;
                contentSectionsText = `${sections.length} sections`;
              } catch (e) {
                contentSectionsText = 'Invalid JSON';
              }
            }
            
            return (
              <div key={detail.id} className="data-card">
                <div className="card-content">
                  <h3>{detail.title}</h3>
                  <p><strong>Product:</strong> {productName}</p>
                  <p><strong>Description:</strong> {detail.description || 'No description'}</p>
                  <p><strong>Content Sections:</strong> {contentSectionsText}</p>
                  <p><strong>Image URL:</strong> {detail.image_url || 'No image'}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status ${detail.is_active ? 'active' : 'inactive'}`}>
                      {detail.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                  <p><strong>Created:</strong> {new Date(detail.created_at).toLocaleString()}</p>
                </div>
                <div className="card-actions">
                  <button onClick={() => { setEditingItem(detail); setShowForm(true); }} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete('/api/product-details/admin', detail.id)} className="btn-delete">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Project Details
  const renderProjectDetails = () => {
    console.log('🎯 Project Details Data:', data['project_details']);
    console.log('🎯 All Data Keys:', Object.keys(data));
    console.log('🎯 Project Details Type:', typeof data['project_details']);
    console.log('🎯 Project Details Is Array:', Array.isArray(data['project_details']));
    console.log('🎯 Project Details Length:', data['project_details']?.length);
    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>Project Details</h2>
          <button onClick={() => { setEditingItem(null); setShowForm(true); }} className="btn-primary">
            Add New Project Detail
          </button>
        </div>
        
        <div className="data-grid">
          {data['project_details']?.map((detail) => {
            // Use project_name from backend or find from projects
            const projectName = detail.project_name || data['projects_admin']?.find(p => p.id === detail.project_id)?.title || `Project ID: ${detail.project_id}`;
            
            // Parse content sections for display
            let contentSectionsText = 'No sections';
            if (detail.content_sections) {
              try {
                const sections = typeof detail.content_sections === 'string' 
                  ? JSON.parse(detail.content_sections) 
                  : detail.content_sections;
                contentSectionsText = `${sections.length} sections`;
              } catch (e) {
                contentSectionsText = 'Invalid JSON';
              }
            }
            
            return (
              <div key={detail.id} className="data-card">
                <div className="card-content">
                  <h3>{detail.title}</h3>
                  <p><strong>Project:</strong> {projectName}</p>
                  <p><strong>Description:</strong> {detail.description || 'No description'}</p>
                  <p><strong>Content Sections:</strong> {contentSectionsText}</p>
                  <p><strong>Image URL:</strong> {detail.image_url || 'No image'}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status ${detail.is_active ? 'active' : 'inactive'}`}>
                      {detail.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                  <p><strong>Created:</strong> {new Date(detail.created_at).toLocaleString()}</p>
                </div>
                <div className="card-actions">
                  <button onClick={() => { setEditingItem(detail); setShowForm(true); }} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete('/api/project-details/admin', detail.id)} className="btn-delete">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // News Insight Details
  const renderNewsInsightDetails = () => {
    console.log('🎯 News Insight Details Data:', data['news_insight_details']);
    console.log('🎯 All Data Keys:', Object.keys(data));
    console.log('🎯 News Insight Details Type:', typeof data['news_insight_details']);
    console.log('🎯 News Insight Details Is Array:', Array.isArray(data['news_insight_details']));
    console.log('🎯 News Insight Details Length:', data['news_insight_details']?.length);
    return (
      <div className="admin-section">
        <div className="section-header">
          <h2>News Insight Details</h2>
          <button onClick={() => { setEditingItem(null); setShowForm(true); }} className="btn-primary">
            Add New News Insight Detail
          </button>
        </div>
        
        <div className="data-grid">
          {data['news_insight_details']?.map((detail) => {
            // Use article_name from backend or find from news_insight_articles
            const articleName = detail.article_name || data['news_insight_articles']?.find(a => a.id === detail.article_id)?.title || `Article ID: ${detail.article_id}`;
            
            // Parse content sections for display
            let contentSectionsText = 'No sections';
            if (detail.content_sections) {
              try {
                const sections = typeof detail.content_sections === 'string' 
                  ? JSON.parse(detail.content_sections) 
                  : detail.content_sections;
                contentSectionsText = `${sections.length} sections`;
              } catch (e) {
                contentSectionsText = 'Invalid JSON';
              }
            }
            
            return (
              <div key={detail.id} className="data-card">
                <div className="card-content">
                  <h3>{detail.title}</h3>
                  <p><strong>Article:</strong> {articleName}</p>
                  <p><strong>Description:</strong> {detail.description || 'No description'}</p>
                  <p><strong>Content Sections:</strong> {contentSectionsText}</p>
                  <p><strong>Image URL:</strong> {detail.image_url || 'No image'}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status ${detail.is_active ? 'active' : 'inactive'}`}>
                      {detail.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                  <p><strong>Created:</strong> {new Date(detail.created_at).toLocaleString()}</p>
                </div>
                <div className="card-actions">
                  <button onClick={() => { setEditingItem(detail); setShowForm(true); }} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete('/api/news-insight-details/admin', detail.id)} className="btn-delete">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Footer
  const renderFooter = () => {
    console.log('🎯 Footer Data:', data['footer_info']);
    return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Footer Information</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Update Footer Info</button>
      </div>
      
      <div className="data-grid">
        {data['footer_info']?.map((item) => (
          <div key={item.id} className="data-card">
            <div className="card-content">
              <h3>Footer Info</h3>
              <p><strong>Logo Description:</strong> {item.logo_description || 'No logo description'}</p>
              <p><strong>Company Description:</strong> {item.company_description || 'No company description'}</p>
              <p><strong>Status:</strong> {item.is_active ? 'Active' : 'Inactive'}</p>
              <p><strong>Created:</strong> {new Date(item.created_at).toLocaleString()}</p>
              <div className="card-actions">
                <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete('/api/footer-info/admin', item.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

  // Form renderer
  const renderForm = () => {
    if (!showForm) return null;

    const getFormFields = () => {
      switch (activeTab) {
        case 'hero-slides':
          return [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'subtitle', label: 'Subtitle', type: 'text' },
            { name: 'content', label: 'Content', type: 'textarea' },
            { name: 'button_text', label: 'Button Text', type: 'text' },
            { name: 'button_link', label: 'Button Link', type: 'text' },
            { name: 'image_url', label: 'Image URL', type: 'text' },
            { name: 'slide_order', label: 'Order', type: 'number' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'brand-trust':
          return [
            { name: 'brand_name', label: 'Brand Name', type: 'text', required: true },
            { name: 'display_order', label: 'Order', type: 'number' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'brand-trust-content':
          return [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'who-we-are':
          return [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'subtitle', label: 'Subtitle', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'highlight_text', label: 'Highlight Text', type: 'text' },
            { name: 'button_text', label: 'Button Text', type: 'text' },
            { name: 'button_link', label: 'Button Link', type: 'text' },
            { name: 'video_url', label: 'Video URL', type: 'text' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'who-we-are-features':
          return [
            { name: 'feature_text', label: 'Feature Text', type: 'text', required: true },
            { name: 'display_order', label: 'Display Order', type: 'number' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'statistics':
          return [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'value', label: 'Value', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'icon', label: 'Icon', type: 'text' },
            { name: 'display_order', label: 'Order', type: 'number' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'leadership':
          return [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'position', label: 'Position', type: 'text', required: true },
            { name: 'bio', label: 'Bio', type: 'textarea' },
            { name: 'linkedin_url', label: 'LinkedIn URL', type: 'text' },
            { name: 'twitter_url', label: 'Twitter URL', type: 'text' },
            { name: 'facebook_url', label: 'Facebook URL', type: 'text' },
            { name: 'instagram_url', label: 'Instagram URL', type: 'text' },
            { name: 'display_order', label: 'Order', type: 'number' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'leadership-content':
          return [
            { name: 'subtitle', label: 'Subtitle', type: 'text' },
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'button_text', label: 'Button Text', type: 'text' },
            { name: 'button_link', label: 'Button Link', type: 'text' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'projects':
          return [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'button_text', label: 'Button Text', type: 'text' },
            { name: 'button_link', label: 'Button Link', type: 'text' },
            { name: 'display_order', label: 'Order', type: 'number' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'projects-content':
          return [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'subtitle', label: 'Subtitle', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'button_text', label: 'Button Text', type: 'text' },
            { name: 'button_link', label: 'Button Link', type: 'text' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'news-insight-content':
          return [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'subtitle', label: 'Subtitle', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'news-insight-articles':
          return [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'button_text', label: 'Button Text', type: 'text' },
            { name: 'button_link', label: 'Button Link', type: 'text' },
            { name: 'article_tag', label: 'Article Tag', type: 'text' },
            { name: 'article_date', label: 'Article Date', type: 'date' },
            { name: 'comments_count', label: 'Comments Count', type: 'number' },
            { name: 'display_order', label: 'Order', type: 'number' },
            { name: 'image', label: 'Image', type: 'file' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'preserve-conserve':
          // Check if editing a feature or content
          if (editingItem && editingItem.hasOwnProperty('icon_url')) {
            // This is a feature
            return [
              { name: 'title', label: 'Title', type: 'text', required: true },
              { name: 'description', label: 'Description', type: 'textarea', required: true },
              { name: 'display_order', label: 'Display Order', type: 'number', placeholder: '1, 2, 3...' },
              { name: 'is_active', label: 'Active', type: 'checkbox' }
            ];
          } else {
            // This is content
            return [
              { name: 'title', label: 'Title', type: 'text', required: true },
              { name: 'subtitle', label: 'Subtitle', type: 'text', required: true },
              { name: 'description', label: 'Description', type: 'textarea', required: true },
              { name: 'button_text', label: 'Button Text', type: 'text', placeholder: 'Discover More' },
              { name: 'button_link', label: 'Button Link', type: 'text', placeholder: '#' },
              { name: 'is_active', label: 'Active', type: 'checkbox' }
            ];
          }
        case 'global-presence':
          return [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'subtitle', label: 'Subtitle', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'value-section':
          return [
            { name: 'subtitle', label: 'Subtitle', type: 'text' },
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'image', label: 'Image', type: 'file' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'value-statistics':
          return [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'percentage', label: 'Percentage', type: 'number', required: true, min: 0, max: 100 },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'display_order', label: 'Display Order', type: 'number', required: true },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'lets-be-great':
          return [
            { name: 'subtitle', label: 'Subtitle', type: 'text' },
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'button_text', label: 'Button Text', type: 'text' },
            { name: 'button_link', label: 'Button Link', type: 'text' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'hero-stats-statistics':
          return [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'percentage', label: 'Percentage', type: 'number', required: true, min: 0, max: 100 },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'display_order', label: 'Display Order', type: 'number', required: true },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'newsletter':
          return [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'subtitle', label: 'Subtitle', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'image', label: 'Background Image', type: 'file' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'our-products':
          return [
            { name: 'title', label: 'Product Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'icon', label: 'Icon Image', type: 'file' },
            { name: 'display_order', label: 'Display Order', type: 'number' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'our-products-content':
          return [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'contact':
          return [
            { name: 'field_name', label: 'Field Name', type: 'select', required: true, options: [
              { value: 'phone', label: 'Phone' },
              { value: 'email', label: 'Email' },
              { value: 'address', label: 'Address' },
              { value: 'working_hours', label: 'Working Hours' },
              { value: 'whatsapp', label: 'WhatsApp' },
              { value: 'gsm', label: 'GSM' }
            ]},
            { name: 'field_value', label: 'Field Value', type: 'text', required: true },
            { name: 'field_type', label: 'Field Type', type: 'select', required: true, options: [
              { value: 'phone', label: 'Phone' },
              { value: 'email', label: 'Email' },
              { value: 'address', label: 'Address' },
              { value: 'working_hours', label: 'Working Hours' },
              { value: 'whatsapp', label: 'WhatsApp' },
              { value: 'gsm', label: 'GSM' }
            ]},
            { name: 'whatsapp', label: 'WhatsApp Number', type: 'text' },
            { name: 'gsm', label: 'GSM Number', type: 'text' },
            { name: 'map_latitude', label: 'Map Latitude', type: 'text' },
            { name: 'map_longitude', label: 'Map Longitude', type: 'text' },
            { name: 'display_order', label: 'Display Order', type: 'number' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'faq':
          return [
            { name: 'question', label: 'Question', type: 'textarea', required: true, rows: 3 },
            { name: 'answer', label: 'Answer', type: 'textarea', required: true, rows: 5 },
            { name: 'display_order', label: 'Display Order', type: 'number' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'faq-image':
          return [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'subtitle', label: 'Subtitle', type: 'text' },
            { name: 'image_url', label: 'Image URL', type: 'text', placeholder: 'Enter image URL' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'map-points':
          return [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'latitude', label: 'Latitude', type: 'text' },
            { name: 'longitude', label: 'Longitude', type: 'text' },
            { name: 'x', label: 'X Position', type: 'text' },
            { name: 'y', label: 'Y Position', type: 'text' },
            { name: 'marker_type', label: 'Marker Type', type: 'select', options: [
              { value: 'default', label: 'Default' },
              { value: 'office', label: 'Office' },
              { value: 'factory', label: 'Factory' },
              { value: 'warehouse', label: 'Warehouse' }
            ]},
            { name: 'display_order', label: 'Display Order', type: 'number' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'footer':
          return [
            { name: 'logo_description', label: 'Logo Description', type: 'textarea' },
            { name: 'company_description', label: 'Company Description', type: 'textarea', required: true },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'product-details':
          return [
            { 
              name: 'product_id', 
              label: 'Product ID', 
              type: 'number', 
              required: true,
              placeholder: 'Ürün ID\'sini girin (örn: 1, 2, 3...)',
              help: 'our_products tablosundaki ürün ID\'sini girin. Eğer ürün yoksa, sadece ID girin.'
            },
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { 
              name: 'wysiwyg_content', 
              label: 'İçerik (WYSIWYG Editör)', 
              type: 'wysiwyg',
              help: 'Kullanıcı dostu editör ile kolayca içerik oluşturun. Resim ekleyin, yazı formatlayın, liste oluşturun.'
            },
            { 
              name: 'content_sections', 
              label: 'Content Sections (JSON) - Eski sistem (opsiyonel)', 
              type: 'textarea', 
              placeholder: `[
  {
    "type": "image",
    "content": "/uploads/urun-gorsel-1.jpg",
    "position": "left",
    "width": "50%"
  },
  {
    "type": "text",
    "content": "Bu ürünümüz hakkında detaylı bilgiler. Yüksek kaliteli malzemeler kullanılarak üretilmiştir.",
    "color": "#ffffff"
  }
]`,
              rows: 6,
              help: 'Eski sistem - WYSIWYG editör kullanmanız önerilir'
            },
            { name: 'image_url', label: 'Image URL', type: 'text', placeholder: '/uploads/image.jpg' },
            { name: 'image', label: 'Upload Image', type: 'file', accept: 'image/*' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'project-details':
          return [
            { 
              name: 'project_id', 
              label: 'Project', 
              type: 'select', 
              required: true,
              options: data['projects_admin']?.map(project => ({
                value: project.id,
                label: `${project.id} - ${project.title}`
              })) || []
            },
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { 
              name: 'wysiwyg_content', 
              label: 'İçerik (WYSIWYG Editör)', 
              type: 'wysiwyg',
              help: 'Kullanıcı dostu editör ile kolayca içerik oluşturun. Resim ekleyin, yazı formatlayın, liste oluşturun.'
            },
            { 
              name: 'content_sections', 
              label: 'Content Sections (JSON) - Eski sistem (opsiyonel)', 
              type: 'textarea', 
              placeholder: `[
  {
    "type": "image",
    "content": "/uploads/proje-gorsel-1.jpg",
    "position": "left",
    "width": "50%"
  },
  {
    "type": "text",
    "content": "Bu projemiz hakkında detaylı bilgiler. Yüksek kaliteli malzemeler kullanılarak üretilmiştir.",
    "color": "#ffffff"
  }
]`,
              rows: 6,
              help: 'Eski sistem - WYSIWYG editör kullanmanız önerilir'
            },
            { name: 'image_url', label: 'Image URL', type: 'text', placeholder: '/uploads/image.jpg' },
            { name: 'image', label: 'Upload Image', type: 'file', accept: 'image/*' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        case 'news-insight-details':
          return [
            { 
              name: 'article_id', 
              label: 'Article ID', 
              type: 'number', 
              required: true,
              placeholder: 'Makale ID\'sini girin (örn: 1, 2, 3...)',
              help: 'news_insight_articles tablosundaki makale ID\'sini girin. Eğer makale yoksa, sadece ID girin.'
            },
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { 
              name: 'wysiwyg_content', 
              label: 'İçerik (WYSIWYG Editör)', 
              type: 'wysiwyg',
              help: 'Kullanıcı dostu editör ile kolayca içerik oluşturun. Resim ekleyin, yazı formatlayın, liste oluşturun.'
            },
            { 
              name: 'content_sections', 
              label: 'Content Sections (JSON) - Eski sistem (opsiyonel)', 
              type: 'textarea', 
              placeholder: `[
  {
    "type": "image",
    "content": "/uploads/haber-gorsel-1.jpg",
    "position": "left",
    "width": "50%"
  },
  {
    "type": "text",
    "content": "Bu haber hakkında detaylı bilgiler. Güncel gelişmeler ve etkileri.",
    "color": "#ffffff"
  }
]`,
              rows: 6,
              help: 'Eski sistem - WYSIWYG editör kullanmanız önerilir'
            },
            { name: 'image_url', label: 'Image URL', type: 'text', placeholder: '/uploads/image.jpg' },
            { name: 'image', label: 'Upload Image', type: 'file', accept: 'image/*' },
            { name: 'is_active', label: 'Active', type: 'checkbox' }
          ];
        default:
          return [];
      }
    };

    const fields = getFormFields();
    const hasImageField = ['hero-slides', 'brand-trust', 'who-we-are', 'leadership', 'projects', 'preserve-conserve', 'value-section', 'lets-be-great', 'news-insights', 'news-insight-articles', 'newsletter', 'our-products', 'product-details', 'project-details', 'news-insight-details', 'faq-image'].includes(activeTab);
    
    // For preserve-conserve, check if it's a feature or content
    const isPreserveConserveFeature = activeTab === 'preserve-conserve' && (
      (editingItem && editingItem.hasOwnProperty('icon_url')) || 
      (!editingItem && preserveConserveType === 'feature')
    );
    const isPreserveConserveContent = activeTab === 'preserve-conserve' && (
      (editingItem && editingItem.hasOwnProperty('background_image_url')) || 
      (!editingItem && preserveConserveType === 'content')
    );

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>{editingItem ? 'Edit' : 'Add New'} {activeTab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
            <button onClick={() => { 
              setShowForm(false); 
              setEditingItem(null); 
              setSelectedImage(null); 
              setImagePreview(null); 
            }} className="btn-close">&times;</button>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            
            const endpoint = getEndpoint();
            
            // Brand trust content, who-we-are-features, hero-stats-statistics, value-statistics, statistics, global-presence, leadership-content, contact, faq, faq-image, map-points ve footer için JSON gönder, diğerleri için FormData
            if (activeTab === 'brand-trust-content' || activeTab === 'who-we-are-features' || activeTab === 'hero-stats-statistics' || activeTab === 'value-statistics' || activeTab === 'statistics' || activeTab === 'global-presence' || activeTab === 'leadership-content' || activeTab === 'projects-content' || activeTab === 'news-insight-content' || activeTab === 'contact' || activeTab === 'faq' || activeTab === 'faq-image' || activeTab === 'map-points' || activeTab === 'footer' || activeTab === 'newsletter' || activeTab === 'our-products-content' || activeTab === 'project-details' || activeTab === 'news-insight-details') {
              const formData = {};
              fields.forEach(field => {
                if (field.type === 'wysiwyg') {
                  // WYSIWYG editör için editingItem state'inden değeri al
                  formData[field.name] = editingItem?.[field.name] || '';
                } else {
                  const input = e.target[field.name];
                  if (field.type === 'checkbox') {
                    formData[field.name] = input.checked;
                  } else {
                    formData[field.name] = input.value;
                  }
                }
              });
              
              // Contact için field_name ve field_type'ı eşleştir
              if (activeTab === 'contact') {
                formData.field_type = formData.field_name;
              }
              
              if (editingItem) {
                handleUpdate(endpoint, editingItem.id, formData);
              } else {
                handleCreate(endpoint, formData);
              }
            } else {
              const formData = new FormData();
              
              // Form field'larını manuel olarak ekle
              fields.forEach(field => {
                if (field.type === 'wysiwyg') {
                  // WYSIWYG editör için editingItem state'inden değeri al
                  formData.append(field.name, editingItem?.[field.name] || '');
                } else {
                  const input = e.target[field.name];
                  if (field.type === 'checkbox') {
                    formData.append(field.name, input.checked);
                  } else {
                    formData.append(field.name, input.value);
                  }
                }
              });
              
              // Resim dosyasını FormData'ya ekle
              if (hasImageField && selectedImage) {
                let fieldName = 'image'; // default
                
                if (activeTab === 'brand-trust') {
                  fieldName = 'logo';
                } else if (isPreserveConserveFeature) {
                  fieldName = 'icon';
                } else if (isPreserveConserveContent || activeTab === 'lets-be-great') {
                  fieldName = 'background_image';
                } else if (activeTab === 'value-section') {
                  fieldName = 'image';
                } else if (activeTab === 'our-products') {
                  fieldName = 'icon';
                } else if (activeTab === 'product-details') {
                  fieldName = 'image';
                } else if (activeTab === 'project-details') {
                  fieldName = 'image';
                } else if (activeTab === 'news-insight-details') {
                  fieldName = 'image';
                } else if (activeTab === 'faq-image') {
                  fieldName = 'image';
                }
                
                console.log('📸 Image Upload Debug:');
                console.log('  - Active Tab:', activeTab);
                console.log('  - Field Name:', fieldName);
                console.log('  - Selected Image:', selectedImage);
                console.log('  - Image Name:', selectedImage.name);
                console.log('  - Image Size:', selectedImage.size);
                console.log('  - Image Type:', selectedImage.type);
                
                formData.append(fieldName, selectedImage);
                console.log('  - FormData appended successfully');
              }
              
              
              if (editingItem) {
                handleUpdate(endpoint, editingItem.id, formData);
              } else {
                handleCreate(endpoint, formData);
              }
            }
          }}>
            {fields.map((field) => (
              <div key={field.name} className="form-group">
                <label htmlFor={field.name}>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    defaultValue={(() => {
                      if (field.name === 'content_sections' && editingItem?.[field.name]) {
                        try {
                          // Eğer zaten string ise olduğu gibi döndür
                          if (typeof editingItem[field.name] === 'string') {
                            return editingItem[field.name];
                          }
                          // Eğer object/array ise JSON string'e çevir
                          return JSON.stringify(editingItem[field.name], null, 2);
                        } catch (e) {
                          console.error('Error parsing content_sections:', e);
                          return '';
                        }
                      }
                      return editingItem?.[field.name] || '';
                    })()}
                    placeholder={field.placeholder}
                    rows={field.rows || 4}
                    required={field.required}
                  />
                ) : field.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    id={field.name}
                    name={field.name}
                    defaultChecked={editingItem?.[field.name] || false}
                  />
                ) : field.type === 'file' ? (
                  <input
                    type="file"
                    id={field.name}
                    name={field.name}
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                  />
                ) : field.type === 'select' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    defaultValue={editingItem?.[field.name] || ''}
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'wysiwyg' ? (
                  <div>
                    <WysiwygEditor
                      value={editingItem?.[field.name] || ''}
                      onChange={(content) => {
                        setEditingItem(prev => ({
                          ...prev,
                          [field.name]: content
                        }));
                      }}
                      placeholder={field.placeholder || 'İçerik yazın...'}
                      height="300px"
                    />
                    {/* Hidden input for form submission */}
                    <input
                      type="hidden"
                      name={field.name}
                      value={editingItem?.[field.name] || ''}
                    />
                  </div>
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    defaultValue={editingItem?.[field.name] || ''}
                    required={field.required}
                  />
                )}
                {field.help && (
                  <div className="field-help">
                    <small>{field.help}</small>
                  </div>
                )}
              </div>
            ))}
            
            {hasImageField && (
              <div className="form-group">
                <label htmlFor="image">
                  {isPreserveConserveFeature ? 'Icon' : 
                   isPreserveConserveContent || activeTab === 'lets-be-great' || activeTab === 'value-section' ? 'Background Image' : 
                   'Image'}
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                />
                {(imagePreview || (editingItem && editingItem.image_url)) && (
                  <img 
                    src={imagePreview || (editingItem && normalizeImageUrl(editingItem.image_url))} 
                    alt="Preview" 
                    className="image-preview" 
                  />
                )}
              </div>
            )}
            
            <div className="form-actions">
              <button type="button" onClick={() => { 
                setShowForm(false); 
                setEditingItem(null); 
                setSelectedImage(null); 
                setImagePreview(null); 
              }} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const getEndpoint = () => {
    switch (activeTab) {
      case 'hero-slides':
        return '/api/hero-slides';
      case 'brand-trust':
        return '/api/brand-trust/admin/logos';
      case 'brand-trust-content':
        return '/api/brand-trust/admin/content';
      case 'who-we-are':
        return '/api/who-we-are/admin/content';
      case 'who-we-are-features':
        return '/api/who-we-are/admin/features';
      case 'statistics':
        return '/api/statistics/admin';
      case 'leadership':
        return '/api/leadership/admin/members';
      case 'leadership-content':
        return '/api/leadership/admin/content';
      case 'projects':
        return '/api/projects/admin';
      case 'projects-content':
        return '/api/projects/admin/content';
      case 'news-insight-content':
        return '/api/news-insight/admin/content';
      case 'news-insight-articles':
        return '/api/news-insight/admin/articles';
      case 'preserve-conserve':
        // Check if editing a feature or content
        if (editingItem && editingItem.hasOwnProperty('icon_url')) {
          return '/api/preserve-conserve/admin/features';
        } else {
          return '/api/preserve-conserve/admin/content';
        }
      case 'global-presence':
        return '/api/global-presence/admin/content';
      case 'value-section':
        return '/api/value-section/admin/content';
      case 'value-statistics':
        return '/api/value-section/admin/statistics';
      case 'lets-be-great':
        return '/api/lets-be-great/admin/content';
      case 'hero-stats-statistics':
        return '/api/lets-be-great/admin/statistics';
      case 'newsletter':
        return '/api/newsletter/admin';
      case 'our-products':
        return '/api/our-products/admin';
      case 'our-products-content':
        return '/api/our-products/admin/content';
      case 'contact':
        return '/api/contact-info/admin';
      case 'faq':
        return '/api/faq';
      case 'faq-image':
        return '/api/faq-content';
      case 'map-points':
        return '/api/map-points/admin';
      case 'footer':
        return '/api/footer-info/admin';
      case 'product-details':
        return '/api/product-details/admin';
      case 'project-details':
        return '/api/project-details/admin';
      case 'news-insight-details':
        return '/api/news-insight-details/admin';
      default:
        return '';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleMarkAsRead = async (endpoint, id) => {
    try {
      console.log(`📧 Marking as read: ${endpoint}/${id}/read`);
      await apiPutAuth(`${endpoint}/${id}/read`, {});
      console.log('✅ Message marked as read successfully');
      loadAllData(); // Reload data to update read status
    } catch (error) {
      console.error('❌ Error marking message as read:', error);
      console.error('❌ Failed to mark message as read:', error.message);
    }
  };

  const handleReadMessage = (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
    // Mesajı okundu olarak işaretle
    if (!message.is_read) {
      handleMarkAsRead('/api/contact-messages/admin', message.id);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard smooth-enter">
      <header className="admin-header">
        <div className="header-content1">
          <h1>ARNA Energy Admin Panel</h1>
          <div className="header-actions">
            <button 
              onClick={() => setActiveTab('contact-messages')} 
              className="btn-contact-messages"
            >
              📧 Contact Messages
            </button>
            <button 
              onClick={() => setActiveTab('newsletter-subscriptions')} 
              className="btn-newsletter-subscriptions"
            >
              📬 Newsletter Subscriptions
            </button>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <div className="admin-layout">
        <nav className="admin-sidebar">
          <ul className="nav-menu">
            {[
              { id: 'hero-slides', label: 'Hero Slides' },
              { id: 'brand-trust', label: 'Brand Trust Logos' },
              { id: 'brand-trust-content', label: 'Brand Trust Content' },
              { id: 'who-we-are', label: 'Who We Are Content' },
              { id: 'who-we-are-features', label: 'Who We Are Features' },
              { id: 'statistics', label: 'Statistics' },
              { id: 'leadership', label: 'Leadership' },
              { id: 'leadership-content', label: 'Leadership Content' },
              { id: 'projects', label: 'Projects' },
              { id: 'projects-content', label: 'Projects Content' },
              { id: 'news-insight-content', label: 'News Insight Content' },
              { id: 'news-insight-articles', label: 'News Insight Articles' },
              { id: 'preserve-conserve', label: 'Preserve & Conserve' },
              { id: 'global-presence', label: 'Global Presence' },
              { id: 'value-section', label: 'Value Section' },
              { id: 'value-statistics', label: 'Value Statistics' },
              { id: 'lets-be-great', label: 'Lets Be Great' },
              { id: 'hero-stats-statistics', label: 'Hero Stats Statistics' },
              { id: 'newsletter', label: 'Newsletter' },
              { id: 'our-products', label: 'Our Products' },
              { id: 'our-products-content', label: 'Our Products Content' },
              { id: 'contact', label: 'Contact' },
              { id: 'contact-messages', label: 'Contact Messages' },
              { id: 'faq', label: 'FAQ' },
              { id: 'faq-image', label: 'FAQ Image' },
              { id: 'map-points', label: 'Map Points' },
              { id: 'footer', label: 'Footer' },
              { id: 'product-details', label: 'Product Details' },
              { id: 'project-details', label: 'Project Details' },
              { id: 'news-insight-details', label: 'News Insight Details' }
            ].map((tab) => (
              <li key={tab.id}>
                <button
                  className={activeTab === tab.id ? 'active' : ''}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="admin-main">
          {error && <div className="error-message">{error}</div>}
          {renderTabContent()}
        </main>
      </div>

      {renderForm()}
      
      {/* Message Detail Modal */}
      {showMessageModal && selectedMessage && (
        <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Message Details</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowMessageModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="message-detail">
                <div className="detail-row">
                  <strong>Name:</strong>
                  <span>{selectedMessage.name}</span>
                </div>
                <div className="detail-row">
                  <strong>Email:</strong>
                  <span>{selectedMessage.email}</span>
                </div>
                {selectedMessage.phone && (
                  <div className="detail-row">
                    <strong>Phone:</strong>
                    <span>{selectedMessage.phone}</span>
                  </div>
                )}
                {selectedMessage.company && (
                  <div className="detail-row">
                    <strong>Company:</strong>
                    <span>{selectedMessage.company}</span>
                  </div>
                )}
                {selectedMessage.subject && (
                  <div className="detail-row">
                    <strong>Subject:</strong>
                    <span>{selectedMessage.subject}</span>
                  </div>
                )}
                <div className="detail-row">
                  <strong>Message:</strong>
                  <div className="message-text">{selectedMessage.message}</div>
                </div>
                <div className="detail-row">
                  <strong>Date:</strong>
                  <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <strong>Status:</strong>
                  <span className={`status ${selectedMessage.is_read ? 'read' : 'unread'}`}>
                    {selectedMessage.is_read ? 'Read' : 'Unread'}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setShowMessageModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardNew;
