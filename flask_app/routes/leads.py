from flask import Blueprint, jsonify, request, current_app, g
from flask_app.auth import require_user, create_supabase_client

# Create blueprint with url_prefix
leads_bp = Blueprint("leads", __name__, url_prefix="/leads")


@leads_bp.route("/", methods=["GET"])
@leads_bp.route("", methods=["GET"])  # Also handle without trailing slash
@require_user
def list_leads():
    """List leads with pagination support"""
    try:
        # Get pagination parameters
        page = request.args.get("page", default=1, type=int)
        size = request.args.get("size", default=50, type=int)
        
        # Ensure valid pagination values
        if page < 1:
            page = 1
        if size < 1 or size > 100:  # Limit max page size
            size = 50
            
        # Return paginated response
        # In a real implementation, this would query the database
        return jsonify({
            "items": [],
            "page": page,
            "size": size,
            "total": 0
        }), 200
        
    except Exception as e:
        current_app.logger.exception(f"Error listing leads: {str(e)}")
        return jsonify({"error": "Failed to retrieve leads"}), 500


@leads_bp.route("/", methods=["POST"])
@leads_bp.route("", methods=["POST"])  # Also handle without trailing slash
@require_user
def create_lead():
    """Create a new lead - Not implemented yet"""
    return jsonify({"error": "Not implemented"}), 501


@leads_bp.route("/<uuid:id>", methods=["GET"])
@require_user
def get_lead(id: str):
    """Get a specific lead by ID - Not implemented yet"""
    return jsonify({"error": "Not implemented"}), 501


@leads_bp.route("/<uuid:id>", methods=["PATCH"])
@require_user
def update_lead(id: str):
    """Update a specific lead by ID - Not implemented yet"""
    return jsonify({"error": "Not implemented"}), 501


@leads_bp.route("/<uuid:id>", methods=["DELETE"])
@require_user
def delete_lead(id: str):
    """Delete a specific lead by ID - Not implemented yet"""
    return jsonify({"error": "Not implemented"}), 501
