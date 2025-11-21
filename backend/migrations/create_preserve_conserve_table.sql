-- Preserve and Conserve Content Table
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

-- Preserve and Conserve Motto/Vision/Mission Table
CREATE TABLE IF NOT EXISTS preserve_conserve_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('motto', 'vision', 'mission') NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for preserve_conserve_content
INSERT INTO preserve_conserve_content (title, subtitle, description, background_image_url, is_active) VALUES
('A Vital Energy Resource For A Better Tomorrow', 
 'Preserve And Conserve',
 'We are committed to responsible energy production and environmental stewardship. Our innovative technologies and sustainable practices ensure that we meet today\'s energy needs while preserving our planet for future generations.',
 '/uploads/preserve-conserve-bg.jpg',
 true);

-- Insert sample data for preserve_conserve_items
INSERT INTO preserve_conserve_items (type, title, description, display_order, is_active) VALUES
('motto', 'Motto', 'Empowering the world with sustainable energy solutions for a brighter future.', 1, true),
('vision', 'Vision', 'To be the leading provider of clean, reliable, and affordable energy worldwide.', 2, true),
('mission', 'Mission', 'Delivering innovative energy solutions while preserving our environment for future generations.', 3, true);

