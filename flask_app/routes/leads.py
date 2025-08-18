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
            
        supabase = create_supabase_client()
        
        # Get the authenticated user ID from the request context
        user_id = g.user['id']
        
        # Calculate offset for pagination
        offset = (page - 1) * size
        
        # Get total count first
        count_response = supabase.table("leads").select("id", count="exact").eq("owner", user_id).execute()
        total = count_response.count if count_response.count is not None else 0
        
        # Get paginated leads
        leads_response = supabase.table("leads").select("*").eq("owner", user_id).order("created_at", desc=True).range(offset, offset + size - 1).execute()
        
        leads = leads_response.data if leads_response.data else []
        
        # Return paginated response
        return jsonify({
            "items": leads,
            "page": page,
            "size": size,
            "total": total
        }), 200
        
    except Exception as e:
        current_app.logger.exception(f"Error listing leads: {str(e)}")
        return jsonify({"error": "Failed to retrieve leads"}), 500


@leads_bp.route("/", methods=["POST"])
@leads_bp.route("", methods=["POST"])  # Also handle without trailing slash
@require_user
def create_lead():
    """Create a new lead"""
    try:
        supabase = create_supabase_client()
        
        # Get the authenticated user ID from the request context
        user_id = g.user['id']
        
        # Get JSON data from request
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Email is required
        email = data.get('email')
        if not email:
            return jsonify({"error": "Email is required"}), 400
        
        # Prepare lead data
        lead_data = {
            "owner": user_id,
            "email": email,
            "bedrijf": data.get('bedrijf'),
            "website": data.get('website'),
            "linkedin": data.get('linkedin'),
            "image_path": data.get('image_path')
        }
        
        # Insert the new lead
        response = supabase.table("leads").insert(lead_data).execute()
        
        if not response.data:
            return jsonify({"error": "Failed to create lead"}), 500
            
        new_lead = response.data[0]
        return jsonify(new_lead), 201
        
    except Exception as e:
        current_app.logger.exception(f"Error creating lead: {str(e)}")
        return jsonify({"error": "Failed to create lead"}), 500


@leads_bp.route("/<uuid:id>", methods=["GET"])
@require_user
def get_lead(id: str):
    """Get a specific lead by ID"""
    try:
        supabase = create_supabase_client()
        
        # Get the authenticated user ID from the request context
        user_id = g.user['id']
        
        # Query the lead by ID and owner
        response = supabase.table("leads").select("*").eq("id", str(id)).eq("owner", user_id).execute()
        
        if not response.data:
            return jsonify({"error": "Lead not found"}), 404
            
        lead = response.data[0]
        return jsonify(lead), 200
        
    except Exception as e:
        current_app.logger.exception(f"Error getting lead {id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve lead"}), 500


@leads_bp.route("/<uuid:id>", methods=["PATCH"])
@require_user
def update_lead(id: str):
    """Update a specific lead by ID"""
    try:
        supabase = create_supabase_client()
        
        # Get the authenticated user ID from the request context
        user_id = g.user['id']
        
        # Get JSON data from request
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Define allowed fields that can be updated
        allowed_fields = ["email", "bedrijf", "website", "linkedin", "image_path"]
        
        # Filter data to only include allowed fields
        update_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        if not update_data:
            return jsonify({"error": "No valid fields to update"}), 400
        
        # First check if the lead exists and belongs to the user
        check_response = supabase.table("leads").select("id").eq("id", str(id)).eq("owner", user_id).execute()
        
        if not check_response.data:
            return jsonify({"error": "Lead not found"}), 404
        
        # Add updated_at timestamp
        from datetime import datetime, timezone
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        # Update the lead
        response = supabase.table("leads").update(update_data).eq("id", str(id)).eq("owner", user_id).execute()
        
        if not response.data:
            return jsonify({"error": "Failed to update lead"}), 500
            
        updated_lead = response.data[0]
        return jsonify(updated_lead), 200
        
    except Exception as e:
        current_app.logger.exception(f"Error updating lead {id}: {str(e)}")
        return jsonify({"error": "Failed to update lead"}), 500


@leads_bp.route("/<uuid:id>", methods=["DELETE"])
@require_user
def delete_lead(id: str):
    """Delete a specific lead by ID"""
    try:
        supabase = create_supabase_client()
        
        # Get the authenticated user ID from the request context
        user_id = g.user['id']
        
        # First check if the lead exists and belongs to the user
        check_response = supabase.table("leads").select("id").eq("id", str(id)).eq("owner", user_id).execute()
        
        if not check_response.data:
            return jsonify({"error": "Lead not found"}), 404
        
        # Delete the lead
        response = supabase.table("leads").delete().eq("id", str(id)).eq("owner", user_id).execute()
        
        if response.data is None:
            return jsonify({"error": "Failed to delete lead"}), 500
            
        return jsonify({"message": "Lead deleted successfully"}), 200
        
    except Exception as e:
        current_app.logger.exception(f"Error deleting lead {id}: {str(e)}")
        return jsonify({"error": "Failed to delete lead"}), 500
