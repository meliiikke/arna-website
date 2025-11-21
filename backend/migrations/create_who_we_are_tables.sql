-- Who We Are Content Table
CREATE TABLE IF NOT EXISTS who_we_are_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  highlight_text VARCHAR(255),
  button_text VARCHAR(100),
  button_link VARCHAR(255),
  video_url VARCHAR(500),
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Who We Are Features Table
CREATE TABLE IF NOT EXISTS who_we_are_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feature_text VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO who_we_are_content (title, subtitle, description, highlight_text, button_text, button_link, video_url, image_url, is_active) VALUES
('Providing affordable and reliable energy', 
 'Who We Are',
 'Dictumst venenatis quisque erat dapibus phasellus nec. Cursus neque mattis class rutrum hendrerit quis nostra aptent parturient a. Ac laoreet aptent nec montes venenatis dis efficitur sapien ullamcorper habitasse augue.',
 'WE\'RE NO.1 OIL & GAS COMPANY.',
 'READ MORE',
 '#services',
 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
 '/uploads/who-we-are-image.jpg',
 true);

INSERT INTO who_we_are_features (feature_text, display_order, is_active) VALUES
('Innovation', 1, true),
('Sustainability', 2, true),
('Excellence', 3, true);
