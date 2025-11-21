-- Create brand_trust table for managing brand trust section
CREATE TABLE IF NOT EXISTS brand_trust (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL DEFAULT 'Trusted by 30,000 world-class brands and organizations of all sizes',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create brand_trust_logos table for managing brand logos
CREATE TABLE IF NOT EXISTS brand_trust_logos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  brand_name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default brand trust text
INSERT INTO brand_trust (title, is_active) 
VALUES ('Trusted by 30,000 world-class brands and organizations of all sizes', TRUE)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Insert sample brand logos (these will be managed through admin panel)
INSERT INTO brand_trust_logos (brand_name, logo_url, display_order, is_active) VALUES
('Gucci', '/uploads/gucci-logo.jpg', 1, TRUE),
('Mercedes', '/uploads/mercedes-logo.jpg', 2, TRUE),
('Nike', '/uploads/nike-logo.jpg', 3, TRUE),
('Apple', '/uploads/apple-logo.jpg', 4, TRUE)
ON DUPLICATE KEY UPDATE 
  brand_name = VALUES(brand_name),
  logo_url = VALUES(logo_url),
  display_order = VALUES(display_order),
  is_active = VALUES(is_active);
