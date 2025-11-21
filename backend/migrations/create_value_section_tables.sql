-- Our Value Section Tables
-- Bu migration Our Value bölümü için gerekli tabloları oluşturur

SET FOREIGN_KEY_CHECKS = 0;

-- Our Value Content Table (Ana içerik)
DROP TABLE IF EXISTS value_content;
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

-- Our Value Statistics Table (Progress bar'lar)
DROP TABLE IF EXISTS value_statistics;
CREATE TABLE value_statistics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  percentage INT NOT NULL DEFAULT 0,
  display_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Sample data insertion
INSERT INTO value_content (subtitle, title, description, image_url, is_active) VALUES
('OUR VALUE', 'Promoting responsible use of petroleum resources', 'Habitant mollis mauris natoque justo hac nibh convallis fermentum integer turpis quisque. Adipiscing vulputate malesuada commodo nisl massa vestibulum habitant mus in elementum. Venenatis aptent sodales dapibus justo nam interdum neque.', '/uploads/value-section-image.jpg', true);

INSERT INTO value_statistics (title, percentage, display_order, is_active) VALUES
('Cleaner', 90, 1, true),
('Stronger', 75, 2, true),
('Better', 82, 3, true);
