import os
import pytest
from unittest.mock import MagicMock, patch


@pytest.fixture
def app():
    from flask_app import create_app
    os.environ["FLASK_ENV"] = "development"
    os.environ["DEV_API_KEY"] = "dev-secret"
    return create_app()


@pytest.fixture
def client(app):
    return app.test_client()


def test_list_senders_ok(client):
    """Test listing senders returns 200 and empty array"""
    # Make request with dev API key
    response = client.get('/senders/', headers={"X-API-Key": "dev-secret"})
    
    # Assertions
    assert response.status_code == 200
    json_data = response.get_json()
    
    # Check response is an empty array
    assert isinstance(json_data, list)
    assert len(json_data) == 0


def test_create_sender_not_implemented(client):
    """Test create sender endpoint returns 501 Not Implemented"""
    response = client.post('/senders/', json={}, headers={"X-API-Key": "dev-secret"})
    assert response.status_code == 501


def test_get_sender_not_implemented(client):
    """Test get sender endpoint returns 501 Not Implemented"""
    response = client.get('/senders/123e4567-e89b-12d3-a456-426614174000', 
                         headers={"X-API-Key": "dev-secret"})
    assert response.status_code == 501


def test_update_sender_not_implemented(client):
    """Test update sender endpoint returns 501 Not Implemented"""
    response = client.patch('/senders/123e4567-e89b-12d3-a456-426614174000', 
                           json={}, headers={"X-API-Key": "dev-secret"})
    assert response.status_code == 501


def test_delete_sender_not_implemented(client):
    """Test delete sender endpoint returns 501 Not Implemented"""
    response = client.delete('/senders/123e4567-e89b-12d3-a456-426614174000', 
                            headers={"X-API-Key": "dev-secret"})
    assert response.status_code == 501
