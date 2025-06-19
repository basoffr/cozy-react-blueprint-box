
from flask import Blueprint, jsonify, request, current_app, g
from flask_app.auth import require_user, create_supabase_client

# Create blueprint with url_prefix
email_servers_bp = Blueprint("email_servers", __name__, url_prefix="/email-servers")


@email_servers_bp.route("/", methods=["GET"])
@email_servers_bp.route("", methods=["GET"])
@require_user
def get_email_servers():
    """Get user's email servers"""
    try:
        supabase = create_supabase_client()
        
        # Get all email servers for the authenticated user
        response = supabase.table("email_servers").select("*").eq("owner", g.user_id).execute()
        
        return jsonify(response.data), 200
        
    except Exception as e:
        current_app.logger.exception(f"Error retrieving email servers: {str(e)}")
        return jsonify({"error": "Failed to retrieve email servers"}), 500


@email_servers_bp.route("/", methods=["POST"])
@email_servers_bp.route("", methods=["POST"])
@require_user
def create_email_server():
    """Create a new email server"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate required fields
        required_fields = ["email_address", "password", "pop_imap_server", "smtp_server"]
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        supabase = create_supabase_client()
        
        # If this is set as default, unset all other defaults first
        if data.get("is_default", False):
            supabase.table("email_servers").update({"is_default": False}).eq("owner", g.user_id).execute()
        
        # Create the email server
        server_data = {
            "owner": g.user_id,
            "email_address": data["email_address"],
            "password": data["password"],
            "pop_imap_server": data["pop_imap_server"],
            "smtp_server": data["smtp_server"],
            "smtp_port": data.get("smtp_port", 587),
            "use_ssl": data.get("use_ssl", True),
            "use_tls": data.get("use_tls", True),
            "is_default": data.get("is_default", False)
        }
        
        response = supabase.table("email_servers").insert(server_data).execute()
        
        return jsonify(response.data[0]), 201
        
    except Exception as e:
        current_app.logger.exception(f"Error creating email server: {str(e)}")
        return jsonify({"error": "Failed to create email server"}), 500


@email_servers_bp.route("/<server_id>", methods=["PUT"])
@require_user
def update_email_server(server_id):
    """Update an email server"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        supabase = create_supabase_client()
        
        # Check if server exists and belongs to user
        existing = supabase.table("email_servers").select("*").eq("id", server_id).eq("owner", g.user_id).execute()
        
        if not existing.data:
            return jsonify({"error": "Email server not found"}), 404
        
        # If this is set as default, unset all other defaults first
        if data.get("is_default", False):
            supabase.table("email_servers").update({"is_default": False}).eq("owner", g.user_id).execute()
        
        # Update the server
        update_data = {
            "email_address": data.get("email_address"),
            "password": data.get("password"),
            "pop_imap_server": data.get("pop_imap_server"),
            "smtp_server": data.get("smtp_server"),
            "smtp_port": data.get("smtp_port", 587),
            "use_ssl": data.get("use_ssl", True),
            "use_tls": data.get("use_tls", True),
            "is_default": data.get("is_default", False)
        }
        
        # Remove None values
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        response = supabase.table("email_servers").update(update_data).eq("id", server_id).eq("owner", g.user_id).execute()
        
        return jsonify(response.data[0]), 200
        
    except Exception as e:
        current_app.logger.exception(f"Error updating email server: {str(e)}")
        return jsonify({"error": "Failed to update email server"}), 500


@email_servers_bp.route("/<server_id>", methods=["DELETE"])
@require_user
def delete_email_server(server_id):
    """Delete an email server"""
    try:
        supabase = create_supabase_client()
        
        # Check if server exists and belongs to user
        existing = supabase.table("email_servers").select("*").eq("id", server_id).eq("owner", g.user_id).execute()
        
        if not existing.data:
            return jsonify({"error": "Email server not found"}), 404
        
        # Delete the server
        supabase.table("email_servers").delete().eq("id", server_id).eq("owner", g.user_id).execute()
        
        return jsonify({"message": "Email server deleted successfully"}), 200
        
    except Exception as e:
        current_app.logger.exception(f"Error deleting email server: {str(e)}")
        return jsonify({"error": "Failed to delete email server"}), 500
