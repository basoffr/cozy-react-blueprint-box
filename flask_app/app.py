
from flask import Flask, jsonify
from flask_cors import CORS

# Import blueprints
from flask_app.routes.leads import leads_bp
from flask_app.routes.campaigns import campaigns_bp
from flask_app.routes.senders import senders_bp
from flask_app.routes.settings import settings_bp
from flask_app.routes.email_servers import email_servers_bp
from flask_app.routes.email_webhooks import email_webhooks_bp
from flask_app.routes.stats import stats_bp
from flask_app.routes.templates import templates_bp

import os

app = Flask(__name__)
app.config.from_mapping(
    ENV=os.environ.get("FLASK_ENV", "production"),
    DEBUG=os.environ.get("FLASK_DEBUG", "0") == "1",
)
CORS(app)  # Enable CORS if needed

# Register blueprints
app.register_blueprint(leads_bp)
app.register_blueprint(campaigns_bp)
app.register_blueprint(senders_bp)
app.register_blueprint(settings_bp)
app.register_blueprint(email_servers_bp)
app.register_blueprint(email_webhooks_bp)
app.register_blueprint(stats_bp)
app.register_blueprint(templates_bp)

# Error handler example (optional)
@app.route('/api/routes')
def list_routes():
    """List all available routes for debugging"""
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': sorted(rule.methods),
            'path': str(rule)
        })
    return jsonify(routes)

@app.errorhandler(404)
def not_found(error):
    # Get available routes
    routes = []
    for rule in app.url_map.iter_rules():
        if 'static' not in rule.endpoint:  # Skip static files
            routes.append({
                'path': str(rule),
                'methods': sorted(rule.methods),
                'endpoint': rule.endpoint
            })
    
    # Log to console
    print("\nAvailable routes:")
    for route in sorted(routes, key=lambda r: r['path']):
        print(f"{route['path']} ({', '.join(route['methods'])})")
    
    return {
        "error": "Not found",
        "available_routes": [r['path'] for r in sorted(routes, key=lambda r: r['path'])]
    }, 404

def print_routes():
    """Print all registered routes for debugging"""
    print("\n=== Registered Routes ===")
    for rule in app.url_map.iter_rules():
        if 'static' not in rule.endpoint:  # Skip static files
            methods = ','.join(sorted(rule.methods - {'OPTIONS', 'HEAD'}))
            print(f"{rule.endpoint:40} {methods:20} {rule.rule}")
    print("==========================\n")

# Main entry point
if __name__ == "__main__":
    with app.app_context():
        print_routes()
    app.run(debug=True, host="127.0.0.1", port=5000)
