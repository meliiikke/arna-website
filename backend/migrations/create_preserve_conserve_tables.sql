-- Create preserve_conserve_content table
CREATE TABLE IF NOT EXISTS preserve_conserve_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  background_image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create preserve_conserve_features table
CREATE TABLE IF NOT EXISTS preserve_conserve_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  display_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for preserve_conserve_content
INSERT INTO preserve_conserve_content (title, subtitle, description, background_image_url, is_active) VALUES
('A Vital Energy Resource For A Better Tomorrow', 
 'PRESERVE AND CONSERVE',
 'We are committed to responsible energy production and environmental stewardship. Our innovative technologies and sustainable practices ensure that we meet today\'s energy needs while preserving our planet for future generations.',
 '/uploads/preserve-conserve-bg.jpg',
 true);

-- Insert sample data for preserve_conserve_features
INSERT INTO preserve_conserve_features (title, description, icon, display_order, is_active) VALUES
('MOTTO', 'Empowering the world with sustainable energy solutions for a brighter future.', '→', 1, true),
('VISION', 'To be the leading provider of clean, reliable, and affordable energy worldwide.', '→', 2, true),
('MISSION', 'Delivering innovative energy solutions while preserving our environment for future generations.', '→', 3, true);
