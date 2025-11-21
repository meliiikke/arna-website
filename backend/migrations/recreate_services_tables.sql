-- Recreate services tables with correct structure
-- This will drop and recreate the tables with the right columns

-- Drop existing tables if they exist
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS services_content;

-- Create services_content table
CREATE TABLE services_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create services table with all required columns
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  button_text VARCHAR(100),
  button_link VARCHAR(500),
  display_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert services content
INSERT INTO services_content (title, subtitle, description, is_active) VALUES
('Leading Energy Solutions', 
 'OUR SERVICES',
 'We provide comprehensive energy solutions that meet the demands of today while building a sustainable tomorrow.',
 true);

-- Insert services data with all columns
INSERT INTO services (title, description, image_url, button_text, button_link, display_order, is_active) VALUES
('Energy Consulting', 'Expert energy consulting services for sustainable solutions', '/uploads/energy-consulting.jpg', 'Learn More', '#contact', 1, true),
('Renewable Energy', 'Advanced renewable energy solutions and technologies', '/uploads/renewable-energy.jpg', 'Learn More', '#contact', 2, true),
('Energy Storage', 'Cutting-edge energy storage systems for reliable power', '/uploads/energy-storage.jpg', 'Learn More', '#contact', 3, true),
('Petroleum Refinery', 'Modern petroleum refining processes and technologies', '/uploads/petroleum-refinery.jpg', 'Learn More', '#contact', 4, true),
('Environmental Solutions', 'Comprehensive environmental protection and sustainability services', '/uploads/environmental-solutions.jpg', 'Learn More', '#contact', 5, true);

-- Verify the data
SELECT 'Services Content:' as table_name, COUNT(*) as count FROM services_content
UNION ALL
SELECT 'Services:' as table_name, COUNT(*) as count FROM services;

-- Show the inserted data
SELECT * FROM services ORDER BY display_order;
SELECT * FROM services_content;
