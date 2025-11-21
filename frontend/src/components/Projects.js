import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { apiGet, normalizeImageUrl } from '../utils/api';
import './Projects.css';

const Projects = () => {
  const [projectsContent, setProjectsContent] = useState({
    subtitle: 'Our Awesome Projects',
    title: 'We Take All Related Oil & Gas Projects',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
    button_text: 'ALL PROJECT',
    button_link: '#projects'
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjectsData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching projects data...');

      // Use Promise.all to fetch both APIs simultaneously for better performance
      const [contentResponse, projectsResponse] = await Promise.all([
        apiGet('/api/projects/content'),
        apiGet('/api/projects')
      ]);

      console.log('📥 Projects content response:', contentResponse);
      console.log('📁 Projects response:', projectsResponse);

      // Process content response
      if (contentResponse && !contentResponse.error && contentResponse.title) {
        setProjectsContent({
          subtitle: contentResponse.subtitle || 'Our Awesome Projects',
          title: contentResponse.title || 'We Take All Related Oil & Gas Projects',
          description: contentResponse.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
          button_text: contentResponse.button_text || 'ALL PROJECT',
          button_link: contentResponse.button_link || '#projects'
        });
        console.log('✅ Projects content set:', contentResponse);
      } else {
        console.log('⚠️ Projects content response has error or is null:', contentResponse);
        throw new Error('Projects content API failed');
      }

      // Process projects response
      if (projectsResponse && !projectsResponse.error && Array.isArray(projectsResponse) && projectsResponse.length > 0) {
        setProjects(projectsResponse);
        console.log('✅ Projects set:', projectsResponse);
      } else {
        console.log('⚠️ Projects response has error or is null:', projectsResponse);
        throw new Error('Projects API failed');
      }

      setError(null);
    } catch (err) {
      console.error('❌ Error fetching projects data:', err);
      setError('Failed to load projects data');

      // Fallback to static data if API fails
      console.log('🔄 Using fallback static data');
      setProjectsContent({
        subtitle: 'Our Awesome Projects',
        title: 'We Take All Related Oil & Gas Projects',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
        button_text: 'ALL PROJECT',
        button_link: '#projects'
      });

      setProjects([
        {
          id: 1,
          title: 'Waste Heat Recovery',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
          image_url: require('../images/aaa.jpg'),
          button_text: 'READ MORE',
          button_link: '#project1',
          display_order: 1,
          is_active: true
        },
        {
          id: 2,
          title: 'Crude Flexibility',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
          image_url: require('../images/bbb.jpg'),
          button_text: 'READ MORE',
          button_link: '#project2',
          display_order: 2,
          is_active: true
        },
        {
          id: 3,
          title: 'Unconventional Gas',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
          image_url: require('../images/ccc.jpg'),
          button_text: 'READ MORE',
          button_link: '#project3',
          display_order: 3,
          is_active: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectsData();
  }, [fetchProjectsData]);

  // Memoize filtered and sorted projects for better performance
  const processedProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    
    return projects
      .filter(project => project.is_active)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }, [projects]);

  if (loading) {
    return (
      <section className="projects-section elementor-component">
        <div className="projects-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading projects section...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && !projectsContent.title) {
    return (
      <section className="projects-section elementor-component">
        <div className="projects-container">
          <div className="error-container">
            <p>Error loading projects section: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="projects-section elementor-component">
      <div className="projects-container">
        {/* Header */}
        <div className="projects-header">
          <div className="projects-header-left">
            <span className="projects-subtitle">{projectsContent.subtitle}</span>
            <h2 className="projects-title">{projectsContent.title}</h2>
          </div>
          <div className="projects-header-right">
            <p className="projects-description">
              {projectsContent.description}
            </p>
            <button
              className="projects-cta-button"
              onClick={() => window.location.href = projectsContent.button_link}
            >
              {projectsContent.button_text}
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {processedProjects && processedProjects.length > 0 ? (
            processedProjects.map((project, index) => (
              <div
                key={project.id || index}
                className="project-card"
              >
                <div className="project-image">
                  <img
                    src={project.image_url ? normalizeImageUrl(project.image_url) : require('../images/aaa.jpg')}
                    alt={project.title}
                    className="project-photo"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                    <button
                      className="project-read-more"
                      onClick={() => window.location.href = `/project-detail/${project.id}`}
                    >
                      {project.button_text || 'READ MORE'}
                    </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666', gridColumn: '1 / -1' }}>
              <p>No projects available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
