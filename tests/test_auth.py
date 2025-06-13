import os
import pytest
from unittest.mock import patch, MagicMock
from flask import Flask, g, jsonify

from flask_app.auth import verify_token, AuthError, require_user, create_supabase_client


@pytest.fixture
def app():
    """Create and configure a Flask app for testing"""
    app = Flask(__name__)
    app.env = "development"
    
    # Configure test routes
    @app.route('/protected')
    @require_user
    def protected():
        return jsonify({"user_id": g.user_id, "success": True})
        
    @app.route('/public')
    def public():
        return jsonify({"success": True})
    
    # Set environment variables for testing
    os.environ["DEV_API_KEY"] = "dev-secret"
    os.environ["SUPABASE_URL"] = "https://test.supabase.co"
    os.environ["SUPABASE_SERVICE_ROLE_KEY"] = "test-service-key"
    
    return app


@pytest.fixture
def client(app):
    """Create a test client for the app"""
    return app.test_client()


def test_auth_error():
    """Test AuthError exception"""
    error = AuthError("Test error", 403)
    assert error.message == "Test error"
    assert error.status_code == 403
    assert str(error) == "Test error"


@patch("flask_app.auth.create_supabase_client")
def test_verify_token_success(mock_create_client):
    """Test successful token verification"""
    # Mock the Supabase client and user response
    mock_user = MagicMock()
    mock_user.id = "test-user-id"
    
    mock_auth = MagicMock()
    mock_auth.get_user.return_value = MagicMock(user=mock_user)
    
    mock_client = MagicMock()
    mock_client.auth = mock_auth
    
    mock_create_client.return_value = mock_client
    
    # Call the function
    user_id = verify_token("valid-token")
    
    # Verify the result
    assert user_id == "test-user-id"
    mock_auth.get_user.assert_called_once_with("valid-token")


@patch("flask_app.auth.create_supabase_client")
def test_verify_token_invalid(mock_create_client):
    """Test invalid token verification"""
    # Mock the Supabase client to raise an exception
    mock_client = MagicMock()
    mock_client.auth.get_user.side_effect = Exception("Invalid token")
    mock_create_client.return_value = mock_client
    
    # PyJWT is not available in test environment
    with patch("flask_app.auth.HAS_PYJWT", False):
        with pytest.raises(AuthError) as exc_info:
            verify_token("invalid-token")
            
        assert exc_info.value.message == "Token verification failed"
        assert exc_info.value.status_code == 403


def test_require_user_missing_auth(client):
    """Test accessing protected route without authentication"""
    response = client.get('/protected')
    assert response.status_code == 401
    assert response.json == {"error": "Authentication required"}


def test_require_user_dev_api_key(client):
    """Test accessing protected route with dev API key"""
    response = client.get('/protected', headers={"X-API-Key": "dev-secret"})
    assert response.status_code == 200
    assert response.json["user_id"] == "dev-user-id"
    assert response.json["success"] is True


@patch("flask_app.auth.verify_token")
def test_require_user_valid_token(mock_verify_token, client):
    """Test accessing protected route with valid JWT token"""
    # Mock token verification
    mock_verify_token.return_value = "jwt-user-id"
    
    # Make request with Authorization header
    response = client.get(
        '/protected', 
        headers={"Authorization": "Bearer valid-jwt-token"}
    )
    
    # Verify response
    assert response.status_code == 200
    assert response.json["user_id"] == "jwt-user-id"
    assert response.json["success"] is True
    mock_verify_token.assert_called_once_with("valid-jwt-token")


@patch("flask_app.auth.verify_token")
def test_require_user_invalid_token(mock_verify_token, client):
    """Test accessing protected route with invalid JWT token"""
    # Mock token verification to raise AuthError
    mock_verify_token.side_effect = AuthError("Invalid token", 403)
    
    # Make request with Authorization header
    response = client.get(
        '/protected', 
        headers={"Authorization": "Bearer invalid-token"}
    )
    
    # Verify response
    assert response.status_code == 403
    assert response.json == {"error": "Invalid token"}


def test_require_user_invalid_auth_format(client):
    """Test accessing protected route with invalid Authorization header format"""
    response = client.get(
        '/protected', 
        headers={"Authorization": "InvalidFormat token"}
    )
    assert response.status_code == 401
    assert response.json == {"error": "Invalid Authorization header format"}


def test_public_route(client):
    """Test accessing public route without authentication"""
    response = client.get('/public')
    assert response.status_code == 200
    assert response.json["success"] is True
