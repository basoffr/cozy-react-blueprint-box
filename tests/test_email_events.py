"""
Unit tests for email event handling functions.

This module contains tests for the email event handling functions in the email_events module,
specifically focusing on verifying that click events are correctly recorded with 'clicked' status.
"""
import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Add the parent directory to the path so we can import the flask_app module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask_app.email_events import handle_click_event, handle_reply_event, handle_open_event

class TestEmailEvents(unittest.TestCase):
    """Test cases for email event handling functions."""
    
    @patch('flask_app.email_events.create_supabase_client')
    def test_handle_click_event_uses_clicked_status(self, mock_create_client):
        """Test that handle_click_event uses 'clicked' status instead of 'replied'."""
        # Setup mock
        mock_client = MagicMock()
        mock_table = MagicMock()
        mock_update = MagicMock()
        mock_eq = MagicMock()
        mock_execute = MagicMock()
        
        mock_create_client.return_value = mock_client
        mock_client.table.return_value = mock_table
        mock_table.update.return_value = mock_update
        mock_update.eq.return_value = mock_eq
        mock_eq.execute.return_value = MagicMock()
        
        # Call the function
        email_id = "test-email-id"
        link_url = "https://example.com/test-link"
        timestamp = "2025-06-13T12:34:56Z"
        result = handle_click_event(email_id, link_url, timestamp)
        
        # Verify the function returns True on success
        self.assertTrue(result)
        
        # Verify the Supabase client was created
        mock_create_client.assert_called_once()
        
        # Verify the table method was called with 'email_log'
        mock_client.table.assert_called_once_with("email_log")
        
        # Verify update was called with the correct status 'clicked' (not 'replied')
        mock_table.update.assert_called_once()
        update_args = mock_table.update.call_args[0][0]
        self.assertEqual(update_args["status"], "clicked")
        self.assertEqual(update_args["clicked_url"], link_url)
        self.assertEqual(update_args["clicked_at"], timestamp)
        
        # Verify eq was called with the correct email_id
        mock_update.eq.assert_called_once_with("id", email_id)
        
        # Verify execute was called
        mock_eq.execute.assert_called_once()
    
    @patch('flask_app.email_events.create_supabase_client')
    def test_handle_reply_event_uses_replied_status(self, mock_create_client):
        """Test that handle_reply_event still uses 'replied' status."""
        # Setup mock
        mock_client = MagicMock()
        mock_table = MagicMock()
        mock_update = MagicMock()
        mock_eq = MagicMock()
        mock_execute = MagicMock()
        
        mock_create_client.return_value = mock_client
        mock_client.table.return_value = mock_table
        mock_table.update.return_value = mock_update
        mock_update.eq.return_value = mock_eq
        mock_eq.execute.return_value = MagicMock()
        
        # Call the function
        email_id = "test-email-id"
        reply_content = "This is a test reply"
        timestamp = "2025-06-13T12:34:56Z"
        result = handle_reply_event(email_id, reply_content, timestamp)
        
        # Verify the function returns True on success
        self.assertTrue(result)
        
        # Verify update was called with the correct status 'replied'
        mock_table.update.assert_called_once()
        update_args = mock_table.update.call_args[0][0]
        self.assertEqual(update_args["status"], "replied")
        self.assertEqual(update_args["reply_content"], reply_content)
        self.assertEqual(update_args["replied_at"], timestamp)

if __name__ == '__main__':
    unittest.main()
