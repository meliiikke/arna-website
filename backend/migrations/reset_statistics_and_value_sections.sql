-- Reset Statistics and Our Value Sections Only
-- Bu migration sadece statistics ve Our Value bölümlerini sıfırlar

SET FOREIGN_KEY_CHECKS = 0;

-- Drop only statistics and value related tables
DROP TABLE IF EXISTS value_statistics;
DROP TABLE IF EXISTS value_content;
DROP TABLE IF EXISTS statistics;
DROP TABLE IF EXISTS map_points;
DROP TABLE IF EXISTS global_presence_content;

SET FOREIGN_KEY_CHECKS = 1;

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

-- Statistics
INSERT INTO statistics (title, value, description, icon, display_order, is_active) VALUES
('Projects Completed', '150+', 'Projects', '📊', 1, true),
('Happy Clients', '200+', 'Happy Clients', '😊', 2, true),
('Years Experience', '10+', 'Years', '⭐', 3, true);

-- Map Points
INSERT INTO map_points (title, description, latitude, longitude, marker_type, display_order, is_active) VALUES
('Europe Office', 'Our main European operations center', 51.5074, -0.1278, 'gold', 1, true),
('Asia Office', 'Strategic partnership in Asia', 35.6762, 139.6503, 'red', 2, true),
('North America Office', 'Expanding our reach in North America', 40.7128, -74.0060, 'blue', 3, true),
('Middle East Office', 'Energy solutions in the Middle East', 25.2048, 55.2708, 'green', 4, true);

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
SELECT 'Statistics and Our Value sections reset completed successfully!' as message;
