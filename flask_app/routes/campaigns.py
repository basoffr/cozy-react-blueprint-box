from flask import Blueprint, jsonify, request, current_app, g
from pydantic import BaseModel, ValidationError
from typing import List, Dict, Any, Optional
from flask_app.auth import require_user, create_supabase_client, AuthError

# Create blueprint with url_prefix
campaigns_bp = Blueprint("campaigns", __name__, url_prefix="/campaigns")


# Pydantic models for validation
class CampaignCreate(BaseModel):
    name: str
    description: str | None = None


class CampaignUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


@campaigns_bp.route("/", methods=["GET"])
@campaigns_bp.route("", methods=["GET"])  # Also handle without trailing slash
@require_user
def list_campaigns():
    """List all campaigns for the authenticated user"""
    try:
        # Get Supabase client
        supabase = create_supabase_client()
        
        # Query campaigns table filtering by owner (current user)
        response = supabase.table("campaigns") \
            .select("*") \
            .eq("owner", g.user_id) \
            .order("created_at", desc=True) \
            .execute()
            
        # Return campaigns as JSON array
        return jsonify(response.data), 200
        
    except Exception as e:
        current_app.logger.exception(f"Error listing campaigns: {str(e)}")
        return jsonify({"error": "Failed to retrieve campaigns"}), 500


@campaigns_bp.route("/", methods=["POST"])
@campaigns_bp.route("", methods=["POST"])  # Also handle without trailing slash
@require_user
def create_campaign():
    """Create a new campaign"""
    try:
        # Parse and validate request data using Pydantic model
        campaign_data = CampaignCreate.parse_obj(request.json)
        
        # Get Supabase client
        supabase = create_supabase_client()
        
        # Prepare data for insertion with owner field
        insert_data = campaign_data.dict()
        insert_data["owner"] = g.user_id
        
        # Insert campaign into database
        response = supabase.table("campaigns") \
            .insert(insert_data) \
            .execute()
            
        # Return the newly created campaign
        if response and response.data and len(response.data) > 0:
            return jsonify(response.data[0]), 201
        else:
            raise Exception("No data returned from insert operation")
        
    except ValidationError as e:
        # Log validation errors
        current_app.logger.warning(f"Campaign validation error: {str(e)}")
        return jsonify({"error": e.errors()}), 400
    except Exception as e:
        current_app.logger.exception(f"Error creating campaign: {str(e)}")
        return jsonify({"error": "Failed to create campaign"}), 500


@campaigns_bp.route("/<uuid:id>", methods=["GET"])
@require_user
def get_campaign(id: str):
    """Get a specific campaign by ID"""
    try:
        # Get Supabase client
        supabase = create_supabase_client()
        
        # Query campaigns table for specific ID and owner
        response = supabase.table("campaigns") \
            .select("*") \
            .eq("id", str(id)) \
            .eq("owner", g.user_id) \
            .single() \
            .execute()
            
        # Check if campaign was found
        if not response.data:
            return jsonify({"error": "Campaign not found"}), 404
            
        # Return campaign as JSON
        return jsonify(response.data), 200
        
    except Exception as e:
        if "No rows" in str(e):
            return jsonify({"error": "Campaign not found"}), 404
        current_app.logger.exception(f"Error retrieving campaign {id}: {str(e)}")
        return jsonify({"error": "Failed to retrieve campaign"}), 500


@campaigns_bp.route("/<uuid:id>", methods=["PATCH"])
@require_user
def update_campaign(id: str):
    """Update a specific campaign by ID"""
    try:
        # Parse and validate request data using Pydantic model
        update_data = CampaignUpdate.parse_obj(request.json)
        
        # Get update fields, excluding unset fields
        update_fields = update_data.dict(exclude_unset=True)
        
        # If no fields to update, return early
        if not update_fields:
            return jsonify({"error": "No fields to update"}), 400
        
        # Get Supabase client
        supabase = create_supabase_client()
        
        # Update campaign in database, ensuring it belongs to current user
        response = supabase.table("campaigns") \
            .update(update_fields) \
            .eq("id", str(id)) \
            .eq("owner", g.user_id) \
            .single() \
            .execute()
            
        # Check if campaign was found and updated
        if not response.data:
            return jsonify({"error": "Campaign not found"}), 404
            
        # Return updated campaign
        return jsonify(response.data), 200
        
    except ValidationError as e:
        # Log validation errors
        current_app.logger.warning(f"Campaign update validation error: {str(e)}")
        return jsonify({"error": e.errors()}), 400
    except Exception as e:
        if "No rows" in str(e):
            return jsonify({"error": "Campaign not found"}), 404
        current_app.logger.exception(f"Error updating campaign {id}: {str(e)}")
        return jsonify({"error": "Failed to update campaign"}), 500


@campaigns_bp.route("/<uuid:id>", methods=["DELETE"])
@require_user
def delete_campaign(id: str):
    """Delete a specific campaign by ID"""
    try:
        # Get Supabase client
        supabase = create_supabase_client()
        
        # Delete campaign from database, ensuring it belongs to current user
        response = supabase.table("campaigns") \
            .delete() \
            .eq("id", str(id)) \
            .eq("owner", g.user_id) \
            .single() \
            .execute()
            
        # Return empty response with 204 status code
        return "", 204
        
    except Exception as e:
        if "No rows" in str(e):
            return jsonify({"error": "Campaign not found"}), 404
        current_app.logger.exception(f"Error deleting campaign {id}: {str(e)}")
        return jsonify({"error": "Failed to delete campaign"}), 500
