import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
# Temporarily disable imports
# from .routes.campaigns import campaigns_bp
# from .routes.leads import leads_bp
# from .routes.senders import senders_bp
# from .routes.settings import settings_bp

from pathlib import Path
# laad altijd het .env-bestand in project-root
ROOT_DIR = Path(__file__).resolve().parents[1]
load_dotenv(ROOT_DIR / ".env")

# Get the development API key
DEV_KEY = os.getenv("DEV_API_KEY", "dev-secret")

def create_app():
    app = Flask(__name__)
    app.env = os.getenv("FLASK_ENV", "development")
    
    # Configure CORS
    # Get allowed origins from environment variable or use default development origins
    default_origins = "http://127.0.0.1:5173,http://localhost:5173"
    allowed_origins = os.getenv('ALLOWED_ORIGINS', default_origins).split(',')
    CORS(app, origins=allowed_origins, supports_credentials=True)
    
    @app.before_request
    def dev_api_key_bypass():
        # Skip authentication for OPTIONS requests (preflight)
        if request.method == 'OPTIONS':
            return None
            
        # Skip auth check for the root endpoint and debug endpoints
        if request.path in ['/', '/debug/request']:
            return None
            
        # Skip auth for template endpoints (they have their own auth)
        if request.path.startswith('/templates/'):
            return None
            
        # Skip auth for health, test, and simple endpoints
        if request.path in ['/health', '/test', '/stats/overview/', '/campaigns/']:
            return None
            
        # Skip auth for database fix endpoints
        if request.path.startswith('/database-fix/'):
            return None
            
        # Let blueprint routes handle their own authentication
        # This prevents conflicts with @require_user decorator
        return None
    
    @app.route('/')
    def hello():
        return {"message": "API is running"}
    
    @app.route('/health')
    def health_check():
        """Simple health check endpoint"""
        return jsonify({
            "status": "healthy",
            "env": app.env,
            "supabase_configured": bool(os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_SERVICE_ROLE_KEY"))
        })
    
    # Add debugging routes
    @app.route('/debug/request')
    def debug_request():
        """Return information about the current request for debugging"""
        return {
            "path": request.path,
            "method": request.method,
            "headers": dict(request.headers),
            "args": request.args.to_dict(),
            "endpoint": request.endpoint,
            "url": request.url,
            "base_url": request.base_url,
        }
    
    # Add mock API endpoints for testing
    @app.route('/templates/', methods=['GET'])
    def get_templates():
        return jsonify({
            "templates": [
                {"id": "1", "name": "Template 1", "subject": "Test Subject 1"},
                {"id": "2", "name": "Template 2", "subject": "Test Subject 2"}
            ]
        })
    
    @app.route('/templates/<template_id>/', methods=['GET'])
    def get_template(template_id):
        return jsonify({
            "id": template_id,
            "name": f"Template {template_id}",
            "subject": f"Test Subject {template_id}",
            "html": f"<h1>Template {template_id}</h1><p>This is a test template.</p>"
        })
    
    @app.route('/test')
    def test_endpoint():
        """Test endpoint without authentication"""
        return jsonify({
            "message": "Test endpoint working",
            "method": request.method,
            "path": request.path
        })
    
    @app.route('/stats/overview/', methods=['GET'])
    def simple_stats():
        """Simple stats endpoint for testing"""
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
    def simple_campaigns():
        """Simple campaigns endpoint for testing"""
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
    
    # Handle 404 errors
    @app.errorhandler(404)
    def not_found(e):
        # Log the request details for debugging
        app.logger.error(f"404 Error: {request.path} - Method: {request.method} - Headers: {dict(request.headers)}")
        return jsonify({
            "error": "Not Found",
            "message": f"The requested URL {request.path} was not found on this server.",
            "status": 404
        }), 404
    
    # Register blueprints
    # Import and register templates blueprint
    from .routes.templates import templates_bp
    app.register_blueprint(templates_bp)
    
    # Import and register database fix blueprint
    from .routes.database_fix import database_fix_bp
    app.register_blueprint(database_fix_bp)
    
    # Temporarily disable other blueprints
    # app.register_blueprint(campaigns_bp)
    # from .routes.email_webhooks import email_webhooks_bp
    # app.register_blueprint(email_webhooks_bp)
    # from .routes.stats import stats_bp
    # app.register_blueprint(stats_bp)
    # app.register_blueprint(leads_bp)
    # app.register_blueprint(senders_bp)
    # app.register_blueprint(settings_bp)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
