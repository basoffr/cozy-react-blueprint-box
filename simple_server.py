#!/usr/bin/env python3
"""
Simple Flask server for testing without authentication or Supabase dependencies
"""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
ROOT_DIR = Path(__file__).resolve().parent
load_dotenv(ROOT_DIR / ".env")

app = Flask(__name__)

# Configure CORS
default_origins = "http://127.0.0.1:5173,http://localhost:5173"
allowed_origins = os.getenv('ALLOWED_ORIGINS', default_origins).split(',')
CORS(app, origins=allowed_origins, supports_credentials=True)

@app.route('/')
def hello():
    return {"message": "Simple API is running"}

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "env": os.getenv("FLASK_ENV", "development"),
        "supabase_configured": bool(os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_SERVICE_ROLE_KEY"))
    })

@app.route('/test')
def test_endpoint():
    """Test endpoint"""
    return jsonify({
        "message": "Test endpoint working",
        "method": request.method,
        "path": request.path
    })

@app.route('/stats/overview/', methods=['GET'])
def stats_overview():
    """Simple stats endpoint for dashboard"""
    return jsonify({
        "leads": 42,
        "campaigns": 3,
        "open_rate": 0.25,
        "reply_rate": 0.05,
        "opens": 1250,
        "replies": 63,
        "active_campaigns": 2,
        "delivery_rate": 0.95
    })

@app.route('/campaigns/', methods=['GET'])
def campaigns_list():
    """Simple campaigns endpoint for dashboard"""
    return jsonify([
        {
            "id": "1",
            "name": "Test Campaign 1",
            "description": "A test campaign",
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z"
        },
        {
            "id": "2",
            "name": "Test Campaign 2",
            "description": "Another test campaign",
            "created_at": "2024-01-02T00:00:00Z",
            "updated_at": "2024-01-02T00:00:00Z"
        }
    ])

@app.route('/leads/', methods=['GET'])
def leads_list():
    """Simple leads endpoint for dashboard"""
    page = request.args.get('page', 1, type=int)
    size = request.args.get('size', 50, type=int)
    
    # Mock paginated response
    return jsonify({
        "items": [
            {
                "id": "1",
                "email": "test1@example.com",
                "bedrijf": "Test Company 1",
                "website": "https://test1.com",
                "linkedin": "https://linkedin.com/company/test1",
                "image_path": None,
                "created_at": "2024-01-01T00:00:00Z"
            },
            {
                "id": "2", 
                "email": "test2@example.com",
                "bedrijf": "Test Company 2",
                "website": "https://test2.com",
                "linkedin": "https://linkedin.com/company/test2",
                "image_path": None,
                "created_at": "2024-01-02T00:00:00Z"
            }
        ],
        "page": page,
        "size": size,
        "total": 2
    })

@app.route('/leads/lists/', methods=['GET'])
def leads_lists():
    """Simple leads lists endpoint"""
    return jsonify([
        {
            "id": "1",
            "name": "Main Lead List",
            "description": "Primary list of leads",
            "count": 42,
            "created_at": "2024-01-01T00:00:00Z"
        },
        {
            "id": "2",
            "name": "Secondary Lead List",
            "description": "Secondary list of leads",
            "count": 28,
            "created_at": "2024-01-02T00:00:00Z"
        }
    ])

@app.route('/templates/', methods=['GET'])
def templates_list():
    """Simple templates endpoint"""
    page = request.args.get('page', 1, type=int)
    size = request.args.get('size', 50, type=int)
    
    return jsonify({
        "items": [
            {
                "id": "1",
                "name": "Welcome Email",
                "subject": "Welcome to our platform!",
                "content": "<h1>Welcome!</h1><p>Thank you for joining us.</p>",
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            },
            {
                "id": "2",
                "name": "Follow-up Email", 
                "subject": "Following up on our conversation",
                "content": "<h1>Follow-up</h1><p>Let's continue our conversation.</p>",
                "created_at": "2024-01-02T00:00:00Z",
                "updated_at": "2024-01-02T00:00:00Z"
            }
        ],
        "page": page,
        "size": size,
        "total": 2
    })

@app.route('/senders/', methods=['GET'])
def senders_list():
    """Simple senders endpoint"""
    return jsonify([
        {
            "id": "1",
            "name": "John Doe",
            "email": "john@example.com",
            "status": "active",
            "created_at": "2024-01-01T00:00:00Z"
        },
        {
            "id": "2",
            "name": "Jane Smith",
            "email": "jane@example.com",
            "status": "active",
            "created_at": "2024-01-02T00:00:00Z"
        }
    ])

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Not Found",
        "message": f"The requested URL {request.path} was not found.",
        "available_endpoints": [
            "/",
            "/health", 
            "/test",
            "/stats/overview/",
            "/campaigns/",
            "/leads/",
            "/leads/lists/",
            "/senders/",
            "/templates/"
        ]
    }), 404

if __name__ == '__main__':
    print("Starting simple Flask server...")
    print("Available endpoints:")
    print("  - http://127.0.0.1:5001/")
    print("  - http://127.0.0.1:5001/health")
    print("  - http://127.0.0.1:5001/test")
    print("  - http://127.0.0.1:5001/stats/overview/")
    print("  - http://127.0.0.1:5001/campaigns/")
    print("  - http://127.0.0.1:5001/leads/")
    print("  - http://127.0.0.1:5001/leads/lists/")
    print("  - http://127.0.0.1:5001/senders/")
    print("  - http://127.0.0.1:5001/templates/")
    
    app.run(debug=True, host='127.0.0.1', port=5001)
