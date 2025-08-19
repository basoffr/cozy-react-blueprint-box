"""
Email webhook handlers for processing email tracking events.

This module contains routes for handling webhook callbacks from email service providers
that notify about email events such as opens, clicks, and replies.
"""
import logging
from flask import Blueprint, request, jsonify, current_app
# Try to import celery tasks, but make it optional for deployment
try:
    from flask_app.celery_tasks import (
        process_email_open_event,
        process_email_click_event,
        process_email_reply_event
    )
    CELERY_AVAILABLE = True
except ImportError:
    CELERY_AVAILABLE = False
    process_email_open_event = None
    process_email_click_event = None
    process_email_reply_event = None

# Create blueprint
email_webhooks_bp = Blueprint("email_webhooks", __name__, url_prefix="/webhooks/email")

# Configure logging
logger = logging.getLogger(__name__)

@email_webhooks_bp.route("/event", methods=["POST"])
def handle_email_event():
    """
    Handle incoming email event webhooks.
    
    This endpoint receives webhook notifications from email service providers
    about email events such as opens, clicks, and replies.
    """
    try:
        # Get event data from request
        event_data = request.json
        
        if not event_data:
            return jsonify({"error": "No event data provided"}), 400
            
        # Extract event type and email ID
        event_type = event_data.get("event")
        email_id = event_data.get("email_id")
        
        if not event_type or not email_id:
            return jsonify({"error": "Missing required fields: event_type or email_id"}), 400
            
        # Process event based on type
        if CELERY_AVAILABLE:
            # Process events asynchronously with Celery
            if event_type == "open":
                process_email_open_event.delay(
                    email_id,
                    timestamp=event_data.get("timestamp"),
                    metadata=event_data.get("metadata")
                )
            elif event_type == "click":
                process_email_click_event.delay(
                    email_id,
                    link_url=event_data.get("url"),
                    timestamp=event_data.get("timestamp"),
                    metadata=event_data.get("metadata")
                )
            elif event_type == "reply":
                process_email_reply_event.delay(
                    email_id,
                    reply_content=event_data.get("content"),
                    timestamp=event_data.get("timestamp"),
                    metadata=event_data.get("metadata")
                )
            else:
                logger.warning(f"Unhandled event type: {event_type}")
                return jsonify({"error": f"Unhandled event type: {event_type}"}), 400
        else:
            # Celery not available - log event but don't process
            logger.info(f"Received {event_type} event for email {email_id} (Celery not available - not processed)")
            # In production, you might want to store these in database for later processing
            
        # Return success response
        return jsonify({"status": "success", "message": f"Event {event_type} for email {email_id} queued for processing"}), 202
        
    except Exception as e:
        logger.exception(f"Error processing email event webhook: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
