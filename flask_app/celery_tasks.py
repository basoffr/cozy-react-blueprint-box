"""
Celery tasks for processing email events and notifications.

This module contains Celery tasks for handling email events such as
opens, clicks, and replies asynchronously.
"""
import logging
from celery import Celery
from flask_app.email_events import handle_open_event, handle_click_event, handle_reply_event
from flask_app.auth import create_supabase_client

# Configure Celery
celery_app = Celery('email_tasks')

# Configure logging
logger = logging.getLogger(__name__)

@celery_app.task
def process_email_open_event(email_id, timestamp=None, metadata=None):
    """
    Process an email open event asynchronously.
    
    Args:
        email_id: The ID of the email that was opened
        timestamp: When the email was opened (optional)
        metadata: Additional metadata about the open event (optional)
    """
    logger.info(f"Processing open event for email {email_id}")
    return handle_open_event(email_id, timestamp, metadata)

@celery_app.task
def process_email_click_event(email_id, link_url=None, timestamp=None, metadata=None):
    """
    Process an email click event asynchronously.
    
    Args:
        email_id: The ID of the email that was clicked
        link_url: The URL that was clicked (optional)
        timestamp: When the click occurred (optional)
        metadata: Additional metadata about the click event (optional)
    """
    logger.info(f"Processing click event for email {email_id}")
    return handle_click_event(email_id, link_url, timestamp, metadata)

@celery_app.task
def process_email_reply_event(email_id, reply_content=None, timestamp=None, metadata=None):
    """
    Process an email reply event asynchronously.
    
    Args:
        email_id: The ID of the email that was replied to
        reply_content: The content of the reply (optional)
        timestamp: When the reply was received (optional)
        metadata: Additional metadata about the reply event (optional)
    """
    logger.info(f"Processing reply event for email {email_id}")
    return handle_reply_event(email_id, reply_content, timestamp, metadata)
