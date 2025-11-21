-- Create brand_trust_logos table
CREATE TABLE IF NOT EXISTS brand_trust_logos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo VARCHAR(255) NOT NULL,
  icon VARCHAR(10) DEFAULT '',
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create preserve_conserve_content table
CREATE TABLE IF NOT EXISTS preserve_conserve_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  type ENUM('motto', 'vision', 'mission') DEFAULT 'motto',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default brand trust logos
INSERT INTO brand_trust_logos (name, logo, icon, order_index, is_active) VALUES
('logoipsum', 'logoipsum', '', 1, TRUE),
('LOGOIPSUM', 'LOGOIPSUM', '', 2, TRUE),
('logoipsum', 'logoipsum', '🌊', 3, TRUE),
('Logoipsum', 'Logoipsum', '☀️', 4, TRUE);

-- Insert default preserve conserve content
INSERT INTO preserve_conserve_content (title, content, type, is_active) VALUES
('Motto', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'motto', TRUE),
('Vision', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'vision', TRUE);
