-- Add display_order column to statistics table if it doesn't exist
ALTER TABLE statistics 
ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1 AFTER icon;

-- Update existing records to have display_order values
UPDATE statistics SET display_order = 1 WHERE display_order IS NULL AND id = 1;
UPDATE statistics SET display_order = 2 WHERE display_order IS NULL AND id = 2;
UPDATE statistics SET display_order = 3 WHERE display_order IS NULL AND id = 3;

-- Verify the column was added
DESCRIBE statistics;
