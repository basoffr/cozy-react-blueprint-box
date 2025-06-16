import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from .routes.campaigns import campaigns_bp
from .routes.leads import leads_bp
from .routes.senders import senders_bp
from .routes.settings import settings_bp

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
            
        # Skip auth check for the root endpoint
        if request.path == '/':
            return None
            
        # In development mode, check for API key
        if app.env == "development":
            if request.headers.get("X-API-Key") == DEV_KEY:
                return None  # skip auth, no redirect
                
        # For this example, we'll simulate an auth check
        # In a real app, you would check session/token here
        
        # If no auth and not bypassed, return 401 instead of redirecting
        # This prevents the CORS preflight redirect issue
        if app.env == "development" and not request.headers.get("X-API-Key"):
            return jsonify({"error": "Authentication required"}), 401
    
    @app.route('/')
    def hello():
        return {"message": "API is running"}
    
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
        
    @app.route("/stats/overview/", methods=["GET"])
    def stats_overview():
        # TODO: echte aggregaties
        data = {
            "leads_total": 0,
            "campaigns_total": 0,
            "open_rate": 0.0,
            "click_rate": 0.0,
        }
        return jsonify(data), 200
    
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
    app.register_blueprint(campaigns_bp)
    from .routes.email_webhooks import email_webhooks_bp
    app.register_blueprint(email_webhooks_bp)
    app.register_blueprint(leads_bp)
    app.register_blueprint(senders_bp)
    app.register_blueprint(settings_bp)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
