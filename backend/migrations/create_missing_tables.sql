-- Migration: Create missing database tables
-- This script creates all the missing tables that are causing 500 errors

-- Create hero_features table
CREATE TABLE IF NOT EXISTS hero_features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(10) DEFAULT '⭐',
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(10) DEFAULT '⚙️',
    image_url VARCHAR(500),
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create about_stats table
CREATE TABLE IF NOT EXISTS about_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    value VARCHAR(50),
    description TEXT,
    icon VARCHAR(10) DEFAULT '📈',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create about_features table
CREATE TABLE IF NOT EXISTS about_features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(10) DEFAULT '⭐',
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create content_sections table
CREATE TABLE IF NOT EXISTS content_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_name VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    content TEXT,
    image_url VARCHAR(500),
    button_text VARCHAR(100),
    button_link VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create footer_bottom_links table
CREATE TABLE IF NOT EXISTS footer_bottom_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    link VARCHAR(255) DEFAULT '#',
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create map_points table
CREATE TABLE IF NOT EXISTS map_points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(10) DEFAULT '🏢',
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    x DECIMAL(10,6),
    y DECIMAL(10,6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    field_name VARCHAR(100) UNIQUE NOT NULL,
    field_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data for hero_features
INSERT IGNORE INTO hero_features (title, description, icon, order_index, is_active) VALUES
('Quality Assurance', 'We ensure the highest quality standards in all our products and services.', '✅', 1, TRUE),
('24/7 Support', 'Round-the-clock customer support to assist you whenever you need help.', '🕒', 2, TRUE),
('Global Reach', 'Serving customers worldwide with our extensive network and expertise.', '🌍', 3, TRUE);

-- Insert sample data for services
INSERT IGNORE INTO services (title, description, icon, order_index, is_active) VALUES
('Oil & Gas Exploration', 'Advanced exploration services to discover new energy resources.', '⛽', 1, TRUE),
('Energy Consulting', 'Expert consulting services for energy efficiency and sustainability.', '💡', 2, TRUE),
('Pipeline Management', 'Comprehensive pipeline construction and maintenance services.', '🔧', 3, TRUE);

-- Insert sample data for about_stats
INSERT IGNORE INTO about_stats (title, value, description, icon, is_active) VALUES
('Years of Experience', '15+', 'Leading the energy industry', '📈', TRUE),
('Projects Completed', '500+', 'Successful energy projects', '🏗️', TRUE),
('Happy Clients', '1000+', 'Satisfied customers worldwide', '😊', TRUE);

-- Insert sample data for about_features
INSERT IGNORE INTO about_features (title, description, icon, order_index, is_active) VALUES
('Innovation', 'We continuously innovate to provide cutting-edge energy solutions.', '💡', 1, TRUE),
('Sustainability', 'Committed to sustainable practices that protect our environment.', '🌱', 2, TRUE),
('Reliability', 'Trusted partner for reliable energy solutions worldwide.', '🛡️', 3, TRUE);

-- Insert sample data for content_sections
INSERT IGNORE INTO content_sections (section_name, title, subtitle, content, is_active) VALUES
('mission', 'Our Mission', 'Leading the Future of Energy', 'We are committed to providing sustainable energy solutions that power the world while protecting our environment for future generations.', TRUE),
('about', 'About ARNA Energy', 'Your Trusted Energy Partner', 'With years of experience in the energy sector, we provide innovative solutions that drive progress and sustainability.', TRUE),
('services_header', 'Our Services', 'Comprehensive Energy Solutions', 'We offer a wide range of energy services to meet your business and personal needs.', TRUE),
('statistics', 'Our Impact', 'Numbers That Matter', 'Our commitment to excellence is reflected in our achievements and the trust of our clients worldwide.', TRUE),
('contact_header', 'Get In Touch', 'We\'d Love to Hear From You', 'Ready to start your energy journey with us? Contact our team today for personalized solutions.', TRUE);

-- Insert sample data for footer_bottom_links
INSERT IGNORE INTO footer_bottom_links (title, link, order_index, is_active) VALUES
('Privacy Policy', '/privacy', 1, TRUE),
('Terms of Service', '/terms', 2, TRUE),
('Cookie Policy', '/cookies', 3, TRUE);

-- Insert sample data for contact_info
INSERT IGNORE INTO contact_info (field_name, field_value) VALUES
('phone', '+90 555 55 55'),
('email', 'info@arna.com.tr'),
('address', 'Levent Mahallesi, Büyükdere Caddesi No:201 Şişli/İSTANBUL'),
('working_hours', 'Pazartesi - Cuma: 09:00 - 18:00'),
('map_lat', '41.0781'),
('map_lng', '29.0173');

-- Create default admin user (password: admin123)
INSERT IGNORE INTO admins (username, email, password, is_active) VALUES
('admin', 'admin@arna.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);
