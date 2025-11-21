-- Let's Be Great Together Section Tables
-- Bu migration Let's Be Great Together bölümü için gerekli tabloları oluşturur

SET FOREIGN_KEY_CHECKS = 0;

-- Let's Be Great Together Content Table (Ana içerik)
DROP TABLE IF EXISTS lets_be_great_content;
CREATE TABLE lets_be_great_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subtitle VARCHAR(255) NOT NULL DEFAULT 'LET\'S BE GREAT TOGETHER',
  title VARCHAR(500) NOT NULL,
  description TEXT,
  button_text VARCHAR(255) DEFAULT 'DISCOVER MORE',
  button_link VARCHAR(500) DEFAULT '#contact',
  background_image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Let's Be Great Together Statistics Table (Circular progress bars)
DROP TABLE IF EXISTS lets_be_great_statistics;
CREATE TABLE lets_be_great_statistics (
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
INSERT INTO lets_be_great_content (subtitle, title, description, button_text, button_link, background_image_url, is_active) VALUES
('LET\'S BE GREAT TOGETHER', 'Powerful solutions for a sustainable future', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus.', 'DISCOVER MORE', '#contact', '/uploads/lets-be-great-bg.jpg', true);

INSERT INTO lets_be_great_statistics (title, percentage, display_order, is_active) VALUES
('Refining Capacity', 75, 1, true),
('Crude Oil Prod', 87, 2, true),
('Satisfied Clients', 95, 3, true),
('Project Successful', 92, 4, true);
