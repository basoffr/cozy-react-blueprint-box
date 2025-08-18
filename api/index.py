from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "env": "production"
    })

@app.route('/api/stats/overview/')
def stats_overview():
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

@app.route('/api/campaigns/')
def campaigns_list():
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

@app.route('/api/leads/')
def leads_list():
    page = request.args.get('page', 1, type=int)
    size = request.args.get('size', 50, type=int)
    
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

@app.route('/api/leads/lists/')
def leads_lists():
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

@app.route('/api/senders/')
def senders_list():
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

@app.route('/api/templates/')
def templates_list():
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

# Vercel requires this
if __name__ != '__main__':
    # For Vercel
    app = app
