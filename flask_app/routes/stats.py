from flask import Blueprint, jsonify
from flask_app.auth import require_user
from datetime import datetime, timedelta
import random

# Create blueprint with url_prefix
stats_bp = Blueprint('stats', __name__, url_prefix='/stats')

@stats_bp.route('/overview/', methods=['GET'])
@require_user
def get_overview():
    """
    Get overview statistics for the dashboard
    Returns:
        JSON with statistics data
    """
    # Mock data - replace with actual database queries
    stats = {
        'leads': random.randint(100, 1000),
        'campaigns': random.randint(1, 50),
        'open_rate': round(random.uniform(0.1, 0.5), 2),
        'reply_rate': round(random.uniform(0.01, 0.2), 2),
        'opens': random.randint(500, 5000),
        'replies': random.randint(10, 200),
        'active_campaigns': random.randint(1, 10),
        'delivery_rate': round(random.uniform(0.85, 0.99), 2),
    }
    
    return jsonify(stats)

@stats_bp.route('/debug/', methods=['GET'])
def get_debug_stats():
    """
    Debug endpoint - NO AUTH REQUIRED
    Use this to test API connectivity
    """
    stats = {
        'status': 'connected',
        'message': 'API is working - authentication bypassed for debugging',
        'leads': 150,
        'campaigns': 5,
        'open_rate': 0.25,
        'reply_rate': 0.12
    }
    
    return jsonify(stats)
