-- Create Global Presence tables
-- This includes statistics and map points

-- Create statistics table
CREATE TABLE IF NOT EXISTS statistics (
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

-- Create map_points table
CREATE TABLE IF NOT EXISTS map_points (
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

-- Create global_presence_content table
CREATE TABLE IF NOT EXISTS global_presence_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample statistics data
INSERT INTO statistics (title, value, description, icon, display_order, is_active) VALUES
('Projects Completed', '150+', 'Projects', '📊', 1, true),
('Happy Clients', '200+', 'Happy Clients', '😊', 2, true),
('Years Experience', '10+', 'Years', '⭐', 3, true);

-- Insert sample map points data
INSERT INTO map_points (title, description, latitude, longitude, marker_type, display_order, is_active) VALUES
('Europe Office', 'Our main European operations center', 51.5074, -0.1278, 'gold', 1, true),
('Asia Office', 'Strategic partnership in Asia', 35.6762, 139.6503, 'red', 2, true),
('North America Office', 'Expanding operations in North America', 40.7128, -74.0060, 'blue', 3, true),
('Middle East Office', 'Energy solutions in the Middle East', 25.2048, 55.2708, 'green', 4, true);

-- Insert global presence content
INSERT INTO global_presence_content (title, subtitle, description, is_active) VALUES
('Global Presence', 'Leading the way in sustainable energy solutions for a better tomorrow.', 'We are committed to expanding our reach and delivering innovative energy solutions across the globe.', true);

-- Verify the data
SELECT 'Statistics:' as table_name, COUNT(*) as count FROM statistics
UNION ALL
SELECT 'Map Points:' as table_name, COUNT(*) as count FROM map_points
UNION ALL
SELECT 'Global Presence Content:' as table_name, COUNT(*) as count FROM global_presence_content;
