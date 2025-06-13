"""
Email event handling module for processing email tracking events.

This module handles various email events such as opens, clicks, and replies.
Events are processed and stored in the email_log table with appropriate status.
"""
import logging
from flask import current_app
from .auth import create_supabase_client

logger = logging.getLogger(__name__)

def handle_open_event(email_id, timestamp=None, metadata=None):
    """
    Handle an email open event.
    
    Args:
        email_id: The ID of the email that was opened
        timestamp: When the email was opened (optional)
        metadata: Additional metadata about the open event (optional)
    
    Returns:
        bool: True if the event was successfully processed
    """
    try:
        supabase = create_supabase_client()
        
        # Update the email status in the database
        response = supabase.table("email_log") \
            .update({"status": "opened"}) \
            .eq("id", email_id) \
            .execute()
            
        logger.info(f"Processed open event for email {email_id}")
        return True
    except Exception as e:
        logger.error(f"Error processing open event for email {email_id}: {str(e)}")
        return False

def handle_click_event(email_id, link_url=None, timestamp=None, metadata=None):
    """
    Handle an email click event.
    
    Args:
        email_id: The ID of the email that was clicked
        link_url: The URL that was clicked (optional)
        timestamp: When the click occurred (optional)
        metadata: Additional metadata about the click event (optional)
    
    Returns:
        bool: True if the event was successfully processed
    """
    try:
        supabase = create_supabase_client()
        
        # Update the email status in the database to 'clicked'
        # Note: Previously this was using 'replied' status for click events
        # We only update the status field since the table doesn't have URL columns yet
        update_data = {"status": "clicked"}
        
        # Note: The clicked_url and clicked_at columns don't exist in the current schema
        # If they're added in the future (via the migration script), uncomment these lines
        # if link_url is not None:
        #     update_data["clicked_url"] = link_url
        # if timestamp is not None:
        #     update_data["clicked_at"] = timestamp
        
        response = supabase.table("email_log") \
            .update(update_data) \
            .eq("id", email_id) \
            .execute()
            
        # Log additional information that we can't store in the database yet
        if link_url:
            logger.info(f"Click URL (not stored in DB): {link_url}")
        if timestamp:
            logger.info(f"Click timestamp (not stored in DB): {timestamp}")
            
        logger.info(f"Processed click event for email {email_id}")
        return True
    except Exception as e:
        logger.error(f"Error processing click event for email {email_id}: {str(e)}")
        return False

def handle_reply_event(email_id, reply_content=None, timestamp=None, metadata=None):
    """
    Handle an email reply event.
    
    Args:
        email_id: The ID of the email that was replied to
        reply_content: The content of the reply (optional)
        timestamp: When the reply was received (optional)
        metadata: Additional metadata about the reply event (optional)
    
    Returns:
        bool: True if the event was successfully processed
    """
    try:
        supabase = create_supabase_client()
        
        # Update the email status in the database
        response = supabase.table("email_log") \
            .update({
                "status": "replied",
                "reply_content": reply_content,
                "replied_at": timestamp
            }) \
            .eq("id", email_id) \
            .execute()
            
        logger.info(f"Processed reply event for email {email_id}")
        return True
    except Exception as e:
        logger.error(f"Error processing reply event for email {email_id}: {str(e)}")
        return False
