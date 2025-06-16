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


def test_get_settings_ok(client):
    """Test getting settings returns 200 and empty object"""
    # Make request with dev API key
    response = client.get('/settings/', headers={"X-API-Key": "dev-secret"})
    
    # Assertions
    assert response.status_code == 200
    json_data = response.get_json()
    
    # Check response is an empty object
    assert isinstance(json_data, dict)
    assert len(json_data) == 0


def test_update_settings_not_implemented(client):
    """Test update settings endpoint returns 501 Not Implemented"""
    response = client.patch('/settings/', json={}, headers={"X-API-Key": "dev-secret"})
    assert response.status_code == 501
