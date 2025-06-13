"""
Migration script to update email_log records with status 'replied' to 'clicked' for click events.

This script updates all email_log records that have a status of 'replied' and are
actually click events (not reply events) to the new status 'clicked'.

Usage:
    python 001_click_status.py
"""
import os
import sys
import logging
from dotenv import load_dotenv
from supabase import create_client

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables from flask_app/.env
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'flask_app', '.env')
load_dotenv(env_path)

# Print the path to the .env file for debugging
logger.info(f"Loading environment variables from: {env_path}")

def create_supabase_client():
    """Create and return a Supabase client using environment variables."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    # Log the URL (but not the key for security)
    logger.info(f"Using Supabase URL: {url}")
    
    if not url or not key:
        logger.error("Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
        sys.exit(1)
    
    return create_client(url, key)

def migrate_click_status():
    """
    Update email_log records with status 'replied' to 'clicked' for click events.
    
    This function updates all records in the email_log table that have:
    - status = 'replied'
    - clicked_url is not null (indicating it's a click event, not a reply event)
    
    Returns:
        int: Number of records updated
    """
    try:
        logger.info("Starting migration: Update click events from 'replied' to 'clicked'")
        
        # Create Supabase client
        supabase = create_supabase_client()
        
        # First, find all records with status='replied' that have clicked_url not null
        logger.info("Querying for records with status='replied' and clicked_url not null...")
        
        try:
            # Try a simpler approach first - just get all records with status='replied'
            response = supabase.table("email_log").select("*").eq("status", "replied").execute()
            
            if not response.data:
                logger.info("No records found with status='replied'")
                return 0
                
            logger.info(f"Found {len(response.data)} records with status='replied'")
            
            # Filter locally for records with clicked_url not null
            records_to_update = [r for r in response.data if r.get("clicked_url") is not None]
            logger.info(f"Of those, {len(records_to_update)} have clicked_url not null")
            
            if not records_to_update:
                logger.info("No records found that need to be updated")
                return 0
                
            # Update each record individually
            updated_count = 0
            for record in records_to_update:
                try:
                    update_response = supabase.table("email_log") \
                        .update({"status": "clicked"}) \
                        .eq("id", record["id"]) \
                        .execute()
                    
                    if update_response.data:
                        updated_count += 1
                        logger.info(f"Updated record {record['id']} from 'replied' to 'clicked'")
                except Exception as e:
                    logger.error(f"Error updating record {record['id']}: {str(e)}")
            
            logger.info(f"Migration completed: {updated_count} records updated from 'replied' to 'clicked'")
            return updated_count
            
        except Exception as e:
            logger.error(f"Error querying records: {str(e)}")
            return 0
    
    except Exception as e:
        logger.error(f"Error during migration: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return 0

if __name__ == "__main__":
    # Execute migration
    updated_count = migrate_click_status()
    
    # Print summary
    print(f"\nMigration Summary:")
    print(f"----------------")
    print(f"Records updated: {updated_count}")
    print(f"Status: {'Completed successfully' if updated_count > 0 else 'No records updated or error occurred'}")
