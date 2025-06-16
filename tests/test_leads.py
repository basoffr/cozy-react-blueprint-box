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


def test_list_leads_ok(client):
    """Test listing leads returns 200 and correct data structure"""
    # Make request with dev API key
    response = client.get('/leads/?page=1&size=10', headers={"X-API-Key": "dev-secret"})
    
    # Assertions
    assert response.status_code == 200
    json_data = response.get_json()
    
    # Check response structure
    assert "items" in json_data
    assert "page" in json_data
    assert "size" in json_data
    assert "total" in json_data
    
    # Check values
    assert isinstance(json_data["items"], list)
    assert json_data["page"] == 1
    assert json_data["size"] == 10
    assert json_data["total"] == 0


def test_list_leads_default_pagination(client):
    """Test listing leads with default pagination"""
    # Make request without pagination parameters
    response = client.get('/leads/', headers={"X-API-Key": "dev-secret"})
    
    # Assertions
    assert response.status_code == 200
    json_data = response.get_json()
    
    # Check default values
    assert json_data["page"] == 1
    assert json_data["size"] == 50


def test_create_lead_not_implemented(client):
    """Test create lead endpoint returns 501 Not Implemented"""
    response = client.post('/leads/', json={}, headers={"X-API-Key": "dev-secret"})
    assert response.status_code == 501


def test_get_lead_not_implemented(client):
    """Test get lead endpoint returns 501 Not Implemented"""
    response = client.get('/leads/123e4567-e89b-12d3-a456-426614174000', 
                         headers={"X-API-Key": "dev-secret"})
    assert response.status_code == 501


def test_update_lead_not_implemented(client):
    """Test update lead endpoint returns 501 Not Implemented"""
    response = client.patch('/leads/123e4567-e89b-12d3-a456-426614174000', 
                           json={}, headers={"X-API-Key": "dev-secret"})
    assert response.status_code == 501


def test_delete_lead_not_implemented(client):
    """Test delete lead endpoint returns 501 Not Implemented"""
    response = client.delete('/leads/123e4567-e89b-12d3-a456-426614174000', 
                            headers={"X-API-Key": "dev-secret"})
    assert response.status_code == 501
