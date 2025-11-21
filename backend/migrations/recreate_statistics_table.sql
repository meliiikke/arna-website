-- Drop and recreate statistics table with correct structure
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS statistics;
SET FOREIGN_KEY_CHECKS = 1;

-- Create statistics table with correct structure
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

-- Insert sample statistics data
INSERT INTO statistics (title, value, description, icon, display_order, is_active) VALUES
('Projects Completed', '150+', 'Projects', '📊', 1, true),
('Happy Clients', '200+', 'Happy Clients', '😊', 2, true),
('Years Experience', '10+', 'Years', '⭐', 3, true);

-- Verify the data
SELECT * FROM statistics;
