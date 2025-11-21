-- Fix services table structure and insert data
-- This will work with the existing table structure

-- First, let's see what columns exist
-- DESCRIBE services;

-- If the table has different columns, we need to adapt
-- Common possible column names:
-- - button_text might be 'button' or 'link_text'
-- - button_link might be 'link' or 'url'
-- - image_url might be 'image' or 'icon'

-- Try this safer approach - insert only the columns that definitely exist
INSERT INTO services (title, description, display_order, is_active) VALUES
('Energy Consulting', 'Expert energy consulting services for sustainable solutions', 1, true),
('Renewable Energy', 'Advanced renewable energy solutions and technologies', 2, true),
('Energy Storage', 'Cutting-edge energy storage systems for reliable power', 3, true),
('Petroleum Refinery', 'Modern petroleum refining processes and technologies', 4, true),
('Environmental Solutions', 'Comprehensive environmental protection and sustainability services', 5, true);

-- If you want to add the missing columns, run this first:
-- ALTER TABLE services ADD COLUMN IF NOT EXISTS button_text VARCHAR(100) DEFAULT 'Learn More';
-- ALTER TABLE services ADD COLUMN IF NOT EXISTS button_link VARCHAR(500) DEFAULT '#contact';
-- ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) DEFAULT '/uploads/default.jpg';

-- Then update the records with the additional data:
-- UPDATE services SET 
--   button_text = 'Learn More',
--   button_link = '#contact',
--   image_url = CASE 
--     WHEN title = 'Energy Consulting' THEN '/uploads/energy-consulting.jpg'
--     WHEN title = 'Renewable Energy' THEN '/uploads/renewable-energy.jpg'
--     WHEN title = 'Energy Storage' THEN '/uploads/energy-storage.jpg'
--     WHEN title = 'Petroleum Refinery' THEN '/uploads/petroleum-refinery.jpg'
--     WHEN title = 'Environmental Solutions' THEN '/uploads/environmental-solutions.jpg'
--     ELSE '/uploads/default.jpg'
--   END;
