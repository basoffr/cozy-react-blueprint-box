
# ... keep existing code (imports and initialization)

# Import blueprints
from flask_app.routes.leads import leads_bp
from flask_app.routes.campaigns import campaigns_bp
from flask_app.routes.senders import senders_bp
from flask_app.routes.settings import settings_bp
from flask_app.routes.email_servers import email_servers_bp
from flask_app.routes.email_webhooks import email_webhooks_bp

# ... keep existing code (middleware and CORS setup)

# Register blueprints
app.register_blueprint(leads_bp)
app.register_blueprint(campaigns_bp)
app.register_blueprint(senders_bp)
app.register_blueprint(settings_bp)
app.register_blueprint(email_servers_bp)
app.register_blueprint(email_webhooks_bp)

# ... keep existing code (error handlers and main block)
