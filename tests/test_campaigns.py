import os
import pytest
from unittest.mock import MagicMock, patch
from flask import g


@pytest.fixture
def app():
    from flask_app import create_app
    os.environ["FLASK_ENV"] = "development"
    os.environ["DEV_API_KEY"] = "dev-secret"
    return create_app()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def mock_supabase(monkeypatch):
    """Create and configure a MagicMock for Supabase client"""
    mock = MagicMock()
    monkeypatch.setattr('flask_app.routes.campaigns.create_supabase_client', lambda: mock)
    return mock


def test_list_campaigns_ok(client, mock_supabase):
    """Test listing campaigns returns 200 and correct data"""
    # Configure mock response
    mock_data = [
        {
            "id": "1", 
            "name": "Test Campaign",
            "description": "Test Description",
            "owner": "user-123",
            "created_at": "2025-01-01T00:00:00Z",
            "updated_at": "2025-01-01T00:00:00Z"
        }
    ]
    
    # Setup mock chain
    mock_execute = MagicMock()
    mock_execute.data = mock_data
    mock_order = MagicMock()
    mock_order.execute.return_value = mock_execute
    mock_eq = MagicMock()
    mock_eq.order.return_value = mock_order
    mock_select = MagicMock()
    mock_select.eq.return_value = mock_eq
    mock_table = MagicMock()
    mock_table.select.return_value = mock_select
    mock_supabase.table.return_value = mock_table
    
    # Make request
    response = client.get('/campaigns', headers={"X-API-Key": "dev-secret"})
    
    # Assertions
    assert response.status_code == 200
    json_data = response.get_json()
    assert len(json_data) == 1
    assert json_data[0]["id"] == "1"
    assert json_data[0]["name"] == "Test Campaign"
    
    # Verify mock calls
    mock_supabase.table.assert_called_once_with("campaigns")
    mock_table.select.assert_called_once_with("*")
    mock_select.eq.assert_called_once()  # eq("owner", g.user_id)
    mock_eq.order.assert_called_once_with("created_at", desc=True)


def test_create_campaign_ok(client, mock_supabase):
    """Test creating a campaign returns 201 and correct data"""
    # Configure mock response
    mock_data = {
        "id": "1", 
        "name": "New Campaign",
        "description": "New Description",
        "owner": "user-123",
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:00Z"
    }
    
    # Setup mock chain
    mock_execute = MagicMock()
    mock_execute.data = [mock_data]
    mock_single = MagicMock()
    mock_single.execute.return_value = mock_execute
    mock_insert = MagicMock()
    mock_insert.execute.return_value = mock_execute
    mock_table = MagicMock()
    mock_table.insert.return_value = mock_insert
    mock_supabase.table.return_value = mock_table
    
    # Make request
    request_data = {
        "name": "New Campaign",
        "description": "New Description"
    }
    response = client.post(
        '/campaigns', 
        json=request_data,
        headers={"X-API-Key": "dev-secret"}
    )
    
    # Assertions
    assert response.status_code == 201
    json_data = response.get_json()
    assert json_data["name"] == "New Campaign"
    assert json_data["description"] == "New Description"
    
    # Verify mock calls
    mock_supabase.table.assert_called_once_with("campaigns")
    mock_table.insert.assert_called_once()  # Check insert was called with correct data
    

def test_get_campaign_not_found(client, mock_supabase):
    """Test getting a non-existent campaign returns 404"""
    # Setup mock chain to return no data
    mock_execute = MagicMock()
    mock_execute.data = None
    mock_single = MagicMock()
    mock_single.execute.return_value = mock_execute
    mock_eq2 = MagicMock()
    mock_eq2.single.return_value = mock_single
    mock_eq1 = MagicMock()
    mock_eq1.eq.return_value = mock_eq2
    mock_select = MagicMock()
    mock_select.eq.return_value = mock_eq1
    mock_table = MagicMock()
    mock_table.select.return_value = mock_select
    mock_supabase.table.return_value = mock_table
    
    # Make request
    response = client.get('/campaigns/non-existent-id', headers={"X-API-Key": "dev-secret"})
    
    # Assertions
    assert response.status_code == 404
    json_data = response.get_json()
    assert "error" in json_data
    assert "not found" in json_data["error"].lower()


def test_update_campaign_validation_error(client, mock_supabase):
    """Test updating a campaign with invalid data returns 400"""
    # Make request with empty body (validation error)
    response = client.patch(
        '/campaigns/1', 
        json={},  # Empty body will trigger validation error
        headers={"X-API-Key": "dev-secret"}
    )
    
    # Assertions
    assert response.status_code == 400
    json_data = response.get_json()
    assert "error" in json_data


def test_update_campaign_ok(client, mock_supabase):
    """Test updating a campaign returns 200 and correct data"""
    # Configure mock response
    mock_data = {
        "id": "1", 
        "name": "Updated Campaign",
        "description": "Updated Description",
        "owner": "user-123",
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-02T00:00:00Z"
    }
    
    # Setup mock chain
    mock_execute = MagicMock()
    mock_execute.data = mock_data
    mock_single = MagicMock()
    mock_single.execute.return_value = mock_execute
    mock_eq2 = MagicMock()
    mock_eq2.single.return_value = mock_single
    mock_eq1 = MagicMock()
    mock_eq1.eq.return_value = mock_eq2
    mock_update = MagicMock()
    mock_update.eq.return_value = mock_eq1
    mock_table = MagicMock()
    mock_table.update.return_value = mock_update
    mock_supabase.table.return_value = mock_table
    
    # Make request
    request_data = {
        "name": "Updated Campaign"
    }
    response = client.patch(
        '/campaigns/1', 
        json=request_data,
        headers={"X-API-Key": "dev-secret"}
    )
    
    # Assertions
    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["name"] == "Updated Campaign"
    
    # Verify mock calls
    mock_supabase.table.assert_called_once_with("campaigns")
    mock_table.update.assert_called_once_with({"name": "Updated Campaign"})


def test_delete_campaign_ok(client, mock_supabase):
    """Test deleting a campaign returns 204"""
    # Setup mock chain
    mock_execute = MagicMock()
    mock_single = MagicMock()
    mock_single.execute.return_value = mock_execute
    mock_eq2 = MagicMock()
    mock_eq2.single.return_value = mock_single
    mock_eq1 = MagicMock()
    mock_eq1.eq.return_value = mock_eq2
    mock_delete = MagicMock()
    mock_delete.eq.return_value = mock_eq1
    mock_table = MagicMock()
    mock_table.delete.return_value = mock_delete
    mock_supabase.table.return_value = mock_table
    
    # Make request
    response = client.delete('/campaigns/1', headers={"X-API-Key": "dev-secret"})
    
    # Assertions
    assert response.status_code == 204
    assert response.data == b''  # Empty body
    
    # Verify mock calls
    mock_supabase.table.assert_called_once_with("campaigns")
    mock_table.delete.assert_called_once()
    mock_delete.eq.assert_called_once_with("id", "1")


def test_list_campaigns_dev_ok(client, mock_supabase):
    """Test listing campaigns in development mode returns 200 and empty list"""
    # Configure mock response for empty campaigns list
    mock_data = []
    
    # Setup mock chain without eq() call since we're testing dev mode
    mock_execute = MagicMock()
    mock_execute.data = mock_data
    mock_order = MagicMock()
    mock_order.execute.return_value = mock_execute
    mock_select = MagicMock()
    mock_select.order.return_value = mock_order
    mock_table = MagicMock()
    mock_table.select.return_value = mock_select
    mock_supabase.table.return_value = mock_table
    
    # Make request with dev API key
    response = client.get('/campaigns', headers={"X-API-Key": "dev-secret"})
    
    # Assertions
    assert response.status_code == 200
    json_data = response.get_json()
    assert isinstance(json_data, list)
    assert len(json_data) == 0  # Empty list
    
    # Verify mock calls - should not call eq() in dev mode
    mock_supabase.table.assert_called_once_with("campaigns")
    mock_table.select.assert_called_once_with("*")
    mock_select.order.assert_called_once_with("created_at", desc=True)
