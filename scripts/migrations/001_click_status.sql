-- Migration script to update email_log records from 'replied' to 'clicked' for click events
-- This script should be run in the Supabase SQL editor

-- IMPORTANT NOTE: Based on the table structure inspection, we found that the email_log table
-- does not have a column to store click URLs. This means we can't differentiate between
-- actual reply events and click events that were incorrectly stored as 'replied'.

-- Options:
-- 1. Add a new column to store click URLs (recommended for future tracking)
-- 2. Alter the schema to add the necessary columns
-- 3. Proceed with the migration but be aware all 'replied' events will be treated as 'clicked'

-- First, let's check how many records have status='replied'
SELECT COUNT(*) as records_with_status_replied 
FROM email_log 
WHERE status = 'replied';

-- Since we can't differentiate between clicks and replies, we have two options:

-- OPTION 1: Don't migrate any records and keep using 'replied' for both clicks and replies
-- This preserves existing data but doesn't fix the status issue

-- OPTION 2: Add the necessary columns to track clicks properly
ALTER TABLE email_log
ADD COLUMN IF NOT EXISTS clicked_url TEXT,
ADD COLUMN IF NOT EXISTS clicked_at TIMESTAMP;

-- OPTION 3: Migrate all 'replied' records to 'clicked' (NOT RECOMMENDED)
-- Only use this if you're certain all 'replied' records are actually click events
-- UPDATE email_log 
-- SET status = 'clicked' 
-- WHERE status = 'replied';

-- Check current status counts
SELECT status, COUNT(*) as count
FROM email_log
GROUP BY status
ORDER BY count DESC;
