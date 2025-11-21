-- Check statistics table structure
DESCRIBE statistics;

-- Check if display_order column exists
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'statistics' 
AND TABLE_SCHEMA = DATABASE();
