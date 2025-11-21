-- Create services_content table
CREATE TABLE IF NOT EXISTS services_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create services table
CREATE TABLE IF NOT EXISTS services (
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

-- Insert sample data for services_content
INSERT INTO services_content (title, subtitle, description, is_active) VALUES
('Leading Energy Solutions', 
 'OUR SERVICES',
 'We provide comprehensive energy solutions that meet the demands of today while building a sustainable tomorrow.',
 true);

-- Insert sample data for services
INSERT INTO services (title, description, image_url, button_text, button_link, display_order, is_active) VALUES
('Energy Consulting', 'Expert energy consulting services', '/uploads/energy-consulting.jpg', 'Learn More', '#contact', 1, true),
('Renewable Energy', 'Renewable energy solutions', '/uploads/renewable-energy.jpg', 'Learn More', '#contact', 2, true),
('Energy Storage', 'Advanced energy storage systems', '/uploads/energy-storage.jpg', 'Learn More', '#contact', 3, true);
