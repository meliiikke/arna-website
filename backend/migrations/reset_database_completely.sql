-- Complete Database Reset
-- Bu migration tüm tabloları siler ve temiz bir veritabanı oluşturur

SET FOREIGN_KEY_CHECKS = 0;

-- Drop all existing tables
DROP TABLE IF EXISTS value_statistics;
DROP TABLE IF EXISTS value_content;
DROP TABLE IF EXISTS global_presence_content;
DROP TABLE IF EXISTS map_points;
DROP TABLE IF EXISTS statistics;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS services_content;
DROP TABLE IF EXISTS preserve_conserve_features;
DROP TABLE IF EXISTS preserve_conserve_content;
DROP TABLE IF EXISTS who_we_are_features;
DROP TABLE IF EXISTS who_we_are_content;
DROP TABLE IF EXISTS brand_trust_content;
DROP TABLE IF EXISTS brand_trust_logos;
DROP TABLE IF EXISTS hero_features;
DROP TABLE IF EXISTS hero_slides;
DROP TABLE IF EXISTS about_features;
DROP TABLE IF EXISTS about_stats;
DROP TABLE IF EXISTS contact_info;
DROP TABLE IF EXISTS content_sections;
DROP TABLE IF EXISTS footer_bottom_links;

SET FOREIGN_KEY_CHECKS = 1;

-- Create Hero Slides Table
CREATE TABLE hero_slides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT,
  button_text VARCHAR(255),
  button_link VARCHAR(500),
  image_url VARCHAR(500),
  display_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Hero Features Table
CREATE TABLE hero_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Brand Trust Logos Table
CREATE TABLE brand_trust_logos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(500),
  display_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Brand Trust Content Table
CREATE TABLE brand_trust_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Who We Are Content Table
CREATE TABLE who_we_are_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  highlight_text VARCHAR(500),
  button_text VARCHAR(255),
  button_link VARCHAR(500),
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Who We Are Features Table
CREATE TABLE who_we_are_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Preserve Conserve Content Table
CREATE TABLE preserve_conserve_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Preserve Conserve Features Table
CREATE TABLE preserve_conserve_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Services Content Table
CREATE TABLE services_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Services Table
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  button_text VARCHAR(255),
  button_link VARCHAR(500),
  display_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Statistics Table
CREATE TABLE statistics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  value VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  icon VARCHAR(100),
  display_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Map Points Table
CREATE TABLE map_points (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  marker_type ENUM('gold', 'red', 'blue', 'green') DEFAULT 'gold',
  display_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Global Presence Content Table
CREATE TABLE global_presence_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Value Content Table
CREATE TABLE value_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subtitle VARCHAR(255) NOT NULL DEFAULT 'OUR VALUE',
  title VARCHAR(500) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Value Statistics Table
CREATE TABLE value_statistics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  percentage INT NOT NULL DEFAULT 0,
  display_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Data

-- Hero Slides
INSERT INTO hero_slides (title, content, button_text, button_link, image_url, display_order, is_active) VALUES
('Meeting future demand in a sustainable way', 'We\'re doing our part in that regard with greener practices that don\'t harm the environment.', 'Discover more', '#services', '/uploads/hero-slide-1.jpg', 1, true),
('Leading the energy transition', 'Innovative solutions for a sustainable future.', 'Learn more', '#about', '/uploads/hero-slide-2.jpg', 2, true);

-- Hero Features
INSERT INTO hero_features (title, description, display_order, is_active) VALUES
('CCUS Technology', 'Advanced carbon capture and utilization systems', 1, true),
('Sustainability', 'Committed to environmental responsibility', 2, true),
('Energy Transition', 'Leading the way to clean energy future', 3, true);

-- Brand Trust Content
INSERT INTO brand_trust_content (title, is_active) VALUES
('Trusted by Leading Companies', true);

-- Brand Trust Logos
INSERT INTO brand_trust_logos (name, image_url, display_order, is_active) VALUES
('Company 1', '/uploads/logo1.png', 1, true),
('Company 2', '/uploads/logo2.png', 2, true),
('Company 3', '/uploads/logo3.png', 3, true);

-- Who We Are Content
INSERT INTO who_we_are_content (title, subtitle, description, highlight_text, button_text, button_link, image_url, video_url, is_active) VALUES
('Who We Are', 'Leading Energy Solutions', 'We are a leading energy company committed to sustainable solutions and innovation.', 'We\'re No.1 Oil & Gas Company.', 'Learn More', '#about', '/uploads/who-we-are.jpg', 'https://www.youtube.com/watch?v=example', true);

-- Who We Are Features
INSERT INTO who_we_are_features (title, description, display_order, is_active) VALUES
('Innovation', 'Cutting-edge technology solutions', 1, true),
('Sustainability', 'Environmental responsibility', 2, true),
('Excellence', 'Industry-leading standards', 3, true);

-- Preserve Conserve Content
INSERT INTO preserve_conserve_content (title, subtitle, description, is_active) VALUES
('Preserve & Conserve', 'OUR MISSION', 'Committed to preserving our planet for future generations through sustainable practices.', true);

-- Preserve Conserve Features
INSERT INTO preserve_conserve_features (title, description, display_order, is_active) VALUES
('Environmental Protection', 'Protecting natural resources', 1, true),
('Sustainable Practices', 'Implementing eco-friendly solutions', 2, true),
('Future Focus', 'Building a better tomorrow', 3, true);

-- Services Content
INSERT INTO services_content (title, subtitle, description, is_active) VALUES
('Our Services', 'Comprehensive Energy Solutions', 'We provide a wide range of energy services to meet your needs.', true);

-- Services
INSERT INTO services (title, description, image_url, button_text, button_link, display_order, is_active) VALUES
('Energy Consulting', 'Expert energy consulting services for sustainable solutions', '/uploads/energy-consulting.jpg', 'Learn More', '#contact', 1, true),
('Renewable Energy', 'Advanced renewable energy solutions and technologies', '/uploads/renewable-energy.jpg', 'Learn More', '#contact', 2, true),
('Energy Storage', 'Cutting-edge energy storage systems for reliable power', '/uploads/energy-storage.jpg', 'Learn More', '#contact', 3, true);

-- Statistics
INSERT INTO statistics (title, value, description, icon, display_order, is_active) VALUES
('Projects Completed', '150+', 'Projects', '📊', 1, true),
('Happy Clients', '200+', 'Happy Clients', '😊', 2, true),
('Years Experience', '10+', 'Years', '⭐', 3, true);

-- Map Points
INSERT INTO map_points (title, description, latitude, longitude, marker_type, display_order, is_active) VALUES
('Europe Office', 'Our main European operations center', 51.5074, -0.1278, 'gold', 1, true),
('Asia Office', 'Strategic partnership in Asia', 35.6762, 139.6503, 'red', 2, true),
('North America Office', 'Expanding our reach in North America', 40.7128, -74.0060, 'blue', 3, true);

-- Global Presence Content
INSERT INTO global_presence_content (title, subtitle, description, is_active) VALUES
('Global Presence', 'Leading the way in sustainable energy solutions for a better tomorrow.', 'We are committed to expanding our reach and delivering innovative energy solutions across the globe.', true);

-- Value Content
INSERT INTO value_content (subtitle, title, description, image_url, is_active) VALUES
('OUR VALUE', 'Promoting responsible use of petroleum resources', 'Habitant mollis mauris natoque justo hac nibh convallis fermentum integer turpis quisque. Adipiscing vulputate malesuada commodo nisl massa vestibulum habitant mus in elementum. Venenatis aptent sodales dapibus justo nam interdum neque.', '/uploads/value-section-image.jpg', true);

-- Value Statistics
INSERT INTO value_statistics (title, percentage, display_order, is_active) VALUES
('Cleaner', 90, 1, true),
('Stronger', 75, 2, true),
('Better', 82, 3, true);

-- Success message
SELECT 'Database reset completed successfully! All tables created with sample data.' as message;
