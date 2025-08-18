from flask import Blueprint, jsonify, request, current_app, g
from flask_app.auth import require_user, create_supabase_client, AuthError
from pydantic import BaseModel, ValidationError
from typing import List, Dict, Any, Optional
from datetime import datetime
import time

def ensure_tables_exist():
    """Ensure required database tables exist"""
    try:
        supabase = create_supabase_client()
        
        # Check if templates table exists
        try:
            supabase.table('templates').select('*').limit(1).execute()
            current_app.logger.info("Templates table exists")
        except Exception as e:
            current_app.logger.warning("Templates table doesn't exist, creating...")
            # This is a simplified example - in production, use migrations
            supabase.rpc('pg_temp.create_tables_if_not_exist').execute()
            current_app.logger.info("Created required tables")
            
    except Exception as e:
        current_app.logger.exception("Error ensuring tables exist")
        raise

# Create blueprint
templates_bp = Blueprint("templates", __name__, url_prefix="/templates")

# Note: Tables should be created during app initialization
# The ensure_tables_exist() function can be called manually if needed

# Pydantic models for request/response validation
class TemplateCreate(BaseModel):
    name: str
    subject: str
    html: str

class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    subject: Optional[str] = None
    html: Optional[str] = None

@templates_bp.route("/", methods=["GET"])
@templates_bp.route("", methods=["GET"])  # Handle with or without trailing slash
@require_user
def list_templates():
    """List all templates with pagination"""
    try:
        # Get pagination parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        fields = request.args.get('fields', 'id,name,subject,created_at')
        
        current_app.logger.info(f"Listing templates - page: {page}, limit: {limit}, fields: {fields}")
        
        # Calculate offset for pagination
        offset = (page - 1) * limit
        
        # Get Supabase client
        supabase = create_supabase_client()
        
        try:
            # First, check if the templates table exists
            try:
                # This will fail if the table doesn't exist
                supabase.table("templates").select("id").limit(1).execute()
            except Exception as e:
                current_app.logger.warning("Templates table doesn't exist yet")
                return jsonify({
                    "data": [],
                    "total": 0,
                    "page": page,
                    "limit": limit
                }), 200
            
            # Get the count of all templates
            count_response = supabase.table("templates").select("*", count='exact').execute()
            total_count = count_response.count if hasattr(count_response, 'count') else 0
            
            current_app.logger.info(f"Total templates found: {total_count}")
            
            # Build query - use raw fields to handle the char_length function
            if 'char_length(html) as length' in fields:
                # Use raw SQL for the char_length function
                response = supabase.rpc('execute_sql', {
                    'query': f"""
                        SELECT id, name, subject, created_at, 
                               char_length(html) as length
                        FROM templates
                        ORDER BY created_at DESC
                        LIMIT {limit} OFFSET {offset}
                    """
                }).execute()
                
                return jsonify({
                    "data": response.data,
                    "total": total_count,
                    "page": page,
                    "limit": limit
                }), 200
            else:
                # Use normal query for other cases
                query = supabase.table("templates").select(fields)
                query = query.range(offset, offset + limit - 1)
                query = query.order("created_at", desc=True)
                response = query.execute()
                
                return jsonify({
                    "data": response.data,
                    "total": total_count,
                    "page": page,
                    "limit": limit
                }), 200
            
        except Exception as query_error:
            current_app.logger.exception(f"Database query error: {str(query_error)}")
            # Return empty response instead of error for now
            return jsonify({
                "data": [],
                "total": 0,
                "page": page,
                "limit": limit
            }), 200
        
    except Exception as e:
        current_app.logger.exception(f"Error listing templates: {str(e)}")
        return jsonify({"error": "Failed to retrieve templates"}), 500

@templates_bp.route("/<template_id>/preview/", methods=["GET"])
@require_user
def get_template_preview(template_id: str):
    """Get template preview (HTML content)"""
    try:
        # Get Supabase client
        supabase = create_supabase_client()
        
        # Get template by ID
        response = supabase.table("templates").select("id,html").eq("id", template_id).single().execute()
        
        if not response.data:
            return jsonify({"error": "Template not found"}), 404
            
        return jsonify({
            "id": response.data["id"],
            "html": response.data["html"]
        }), 200
        
    except Exception as e:
        current_app.logger.exception(f"Error getting template preview: {str(e)}")
        return jsonify({"error": "Failed to retrieve template preview"}), 500

@templates_bp.route("/<template_id>/", methods=["GET"])
@require_user
def get_template(template_id: str):
    """Get template by ID"""
    try:
        # Get Supabase client
        supabase = create_supabase_client()
        
        # Get template by ID
        response = supabase.table("templates").select("*").eq("id", template_id).single().execute()
        
        if not response.data:
            return jsonify({"error": "Template not found"}), 404
            
        return jsonify(response.data), 200
        
    except Exception as e:
        current_app.logger.exception(f"Error getting template: {str(e)}")
        return jsonify({"error": "Failed to retrieve template"}), 500

@templates_bp.route("/", methods=["POST"])
@templates_bp.route("", methods=["POST"])  # Handle with or without trailing slash
@require_user
def create_template():
    """Create a new template"""
    try:
        # Validate request data
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # Validate request body
        try:
            template_data = TemplateCreate(**data)
        except ValidationError as e:
            return jsonify({"error": str(e)}), 400
        
        # Get Supabase client
        supabase = create_supabase_client()
        
        # Insert new template
        response = supabase.table("templates").insert({
            "name": template_data.name,
            "subject": template_data.subject,
            "html": template_data.html,
            "created_by": g.user_id,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }).execute()
        
        if not response.data:
            return jsonify({"error": "Failed to create template"}), 500
            
        return jsonify(response.data[0] if response.data else {}), 201
        
    except Exception as e:
        current_app.logger.exception(f"Error creating template: {str(e)}")
        return jsonify({"error": "Failed to create template"}), 500

@templates_bp.route("/<template_id>/", methods=["PUT"])
@require_user
def update_template(template_id: str):
    """Update an existing template"""
    try:
        # Validate request data
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # Validate request body
        try:
            template_data = TemplateUpdate(**data)
        except ValidationError as e:
            return jsonify({"error": str(e)}), 400
        
        # Get Supabase client
        supabase = create_supabase_client()
        
        # Prepare update data
        update_data = {k: v for k, v in template_data.dict().items() if v is not None}
        if not update_data:
            return jsonify({"error": "No valid fields to update"}), 400
            
        # Add updated_at timestamp
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        # Update template
        response = supabase.table("templates")\
            .update(update_data)\
            .eq("id", template_id)\
            .execute()
        
        if not response.data:
            return jsonify({"error": "Template not found or no changes made"}), 404
            
        return jsonify(response.data[0] if response.data else {}), 200
        
    except Exception as e:
        current_app.logger.exception(f"Error updating template: {str(e)}")
        return jsonify({"error": "Failed to update template"}), 500

@templates_bp.route("/<template_id>/", methods=["DELETE"])
@require_user
def delete_template(template_id: str):
    """Delete a template"""
    try:
        # Get Supabase client
        supabase = create_supabase_client()
        
        # Delete template
        response = supabase.table("templates").delete().eq("id", template_id).execute()
        
        if not response.data:
            return jsonify({"error": "Template not found"}), 404
            
        return jsonify({"message": "Template deleted successfully"}), 200
        
    except Exception as e:
        current_app.logger.exception(f"Error deleting template: {str(e)}")
        return jsonify({"error": "Failed to delete template"}), 500

@templates_bp.route("/<template_id>/sequence/", methods=["GET"])
@require_user
def get_template_sequence(template_id: str):
    """Get sequence for a template"""
    try:
        # Get Supabase client
        supabase = create_supabase_client()
        
        # Get template sequence
        response = supabase.table("template_sequences")\
            .select("*")\
            .eq("template_id", template_id)\
            .single()\
            .execute()
        
        if not response.data:
            return jsonify({"steps": []}), 200  # Return empty steps if no sequence exists
            
        return jsonify({"steps": response.data.get("steps", [])}), 200
        
    except Exception as e:
        current_app.logger.exception(f"Error getting template sequence: {str(e)}")
        return jsonify({"error": "Failed to retrieve template sequence"}), 500

@templates_bp.route("/<template_id>/sequence/", methods=["POST"])
@require_user
def save_template_sequence(template_id: str):
    """Save sequence for a template"""
    try:
        # Validate request data
        data = request.get_json()
        if not data or "steps" not in data:
            return jsonify({"error": "No steps provided"}), 400
            
        # Get Supabase client
        supabase = create_supabase_client()
        
        # Check if template exists
        template = supabase.table("templates").select("id").eq("id", template_id).single().execute()
        if not template.data:
            return jsonify({"error": "Template not found"}), 404
        
        # Prepare sequence data
        sequence_data = {
            "template_id": template_id,
            "steps": data["steps"],
            "updated_at": datetime.utcnow().isoformat()
        }
        
        # Upsert sequence (insert or update if exists)
        response = supabase.table("template_sequences")\
            .upsert(sequence_data)\
            .eq("template_id", template_id)\
            .execute()
        
        return jsonify({
            "message": "Sequence saved successfully",
            "steps": response.data[0]["steps"] if response.data else []
        }), 200
        
    except Exception as e:
        current_app.logger.exception(f"Error saving template sequence: {str(e)}")
        return jsonify({"error": "Failed to save template sequence"}), 500
