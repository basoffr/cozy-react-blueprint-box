from flask import Blueprint, jsonify, current_app
from flask_app.auth import create_supabase_client

database_fix_bp = Blueprint("database_fix", __name__, url_prefix="/database-fix")

@database_fix_bp.route("/check-schema", methods=["GET"])
def check_schema():
    """Check database schema and report missing columns"""
    try:
        supabase = create_supabase_client()
        
        # Test templates table schema
        try:
            # Try to select all columns to see what exists
            response = supabase.table("templates").select("*").limit(1).execute()
            current_app.logger.info(f"Templates table query successful: {response.data}")
            
            # Try to select specific columns that should exist
            columns_to_check = ["id", "name", "subject", "html", "created_by", "created_at", "updated_at"]
            missing_columns = []
            
            for column in columns_to_check:
                try:
                    supabase.table("templates").select(column).limit(1).execute()
                    current_app.logger.info(f"Column '{column}' exists")
                except Exception as e:
                    missing_columns.append(column)
                    current_app.logger.error(f"Column '{column}' missing: {str(e)}")
            
            return jsonify({
                "status": "success",
                "templates_table_exists": True,
                "missing_columns": missing_columns,
                "message": f"Templates table exists. Missing columns: {missing_columns}" if missing_columns else "All columns present"
            }), 200
            
        except Exception as e:
            current_app.logger.error(f"Templates table error: {str(e)}")
            return jsonify({
                "status": "error",
                "templates_table_exists": False,
                "error": str(e),
                "message": "Templates table does not exist or is not accessible"
            }), 500
            
    except Exception as e:
        current_app.logger.exception("Database connection error")
        return jsonify({"error": str(e)}), 500

@database_fix_bp.route("/create-tables", methods=["POST"])
def create_tables():
    """Create missing tables and columns"""
    try:
        supabase = create_supabase_client()
        
        # Execute the SQL to create/fix tables
        sql = """
        -- Add name column if it doesn't exist
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name = 'templates' AND column_name = 'name') THEN
                ALTER TABLE public.templates ADD COLUMN name TEXT NOT NULL DEFAULT 'Unnamed Template';
            END IF;
        END $$;
        
        -- Add subject column if it doesn't exist
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name = 'templates' AND column_name = 'subject') THEN
                ALTER TABLE public.templates ADD COLUMN subject TEXT NOT NULL DEFAULT 'No Subject';
            END IF;
        END $$;
        
        -- Add html column if it doesn't exist
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name = 'templates' AND column_name = 'html') THEN
                ALTER TABLE public.templates ADD COLUMN html TEXT NOT NULL DEFAULT '<p>Empty template</p>';
            END IF;
        END $$;
        """
        
        # Execute using rpc call
        response = supabase.rpc('exec_sql', {'sql': sql}).execute()
        
        return jsonify({
            "status": "success",
            "message": "Database schema fixed successfully",
            "response": response.data
        }), 200
        
    except Exception as e:
        current_app.logger.exception("Error fixing database schema")
        return jsonify({
            "status": "error", 
            "error": str(e),
            "message": "Failed to fix database schema"
        }), 500

@database_fix_bp.route("/test-templates", methods=["GET"])
def test_templates():
    """Test templates table functionality"""
    try:
        supabase = create_supabase_client()
        
        # Try to query templates
        response = supabase.table("templates").select("id, name, subject").limit(5).execute()
        
        return jsonify({
            "status": "success",
            "message": "Templates table is working correctly",
            "sample_data": response.data,
            "count": len(response.data)
        }), 200
        
    except Exception as e:
        current_app.logger.exception("Templates table test failed")
        return jsonify({
            "status": "error",
            "error": str(e),
            "message": "Templates table test failed"
        }), 500
