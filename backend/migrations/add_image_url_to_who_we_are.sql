-- Add image_url column to who_we_are_content table
ALTER TABLE who_we_are_content 
ADD COLUMN image_url VARCHAR(500) AFTER video_url;

-- Update existing record with sample image URL
UPDATE who_we_are_content 
SET image_url = '/uploads/who-we-are-image.jpg' 
WHERE id = 1;
