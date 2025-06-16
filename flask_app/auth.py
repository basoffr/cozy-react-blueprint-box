import os
import logging
from functools import wraps
from flask import request, jsonify, g, current_app
from supabase import create_client, Client

# Valid UUID for development mode
DEV_USER_ID = "00000000-0000-0000-0000-000000000000"

# Fallback to PyJWT if needed
try:
    import jwt
    HAS_PYJWT = True
except ImportError:
    HAS_PYJWT = False


class AuthError(Exception):
    """Custom exception for authentication errors"""
    
    def __init__(self, message, status_code=401):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


def create_supabase_client() -> Client:
    """Create and return a Supabase client instance"""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not url or not key:
        raise AuthError("Supabase configuration missing", 500)
        
    return create_client(url, key)


def verify_token(token: str) -> str:
    """
    Verify a JWT token and return the user_id
    
    Args:
        token: JWT token string
        
    Returns:
        str: User ID extracted from the token
        
    Raises:
        AuthError: If token is invalid or expired
    """
    if not token:
        raise AuthError("Token is required", 401)
    
    try:
        # First try using supabase-py client
        supabase = create_supabase_client()
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            raise AuthError("Invalid token", 403)
            
        return user_response.user.id
        
    except Exception as e:
        current_app.logger.warning(f"Supabase token verification failed: {str(e)}")
        
        # Fallback to PyJWT if available
        if HAS_PYJWT:
            try:
                # Note: In a real implementation, you would get the JWT secret from Supabase
                # This is a simplified version for demonstration
                decoded = jwt.decode(
                    token, 
                    os.getenv("SUPABASE_JWT_SECRET", "your-jwt-secret"),
                    algorithms=["HS256"]
                )
                
                # Extract user ID from sub claim
                user_id = decoded.get("sub")
                if not user_id:
                    raise AuthError("Invalid token: missing user ID", 403)
                    
                return user_id
                
            except jwt.ExpiredSignatureError:
                raise AuthError("Token has expired", 401)
            except jwt.InvalidTokenError:
                raise AuthError("Invalid token", 403)
        else:
            # If PyJWT is not available and Supabase verification failed
            raise AuthError("Token verification failed", 403)


def require_user(f):
    """
    Decorator to require user authentication
    
    Checks for:
    1. Authorization header with Bearer token
    2. In development mode, also accepts X-API-Key
    
    Sets g.user_id on success
    Returns error response on failure
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Skip authentication for OPTIONS requests (preflight)
        if request.method == 'OPTIONS':
            return f(*args, **kwargs)
            
        # Get the auth token
        auth_header = request.headers.get('Authorization')
        dev_api_key = request.headers.get('X-API-Key')
        
        # Check development mode with API key
        if current_app.env == "development" and dev_api_key:
            dev_key = os.getenv("DEV_API_KEY", "dev-secret")
            if dev_api_key == dev_key:
                # For development, set a valid UUID as mock user ID
                g.user_id = DEV_USER_ID
                return f(*args, **kwargs)
        
        # Check for Bearer token
        if not auth_header:
            current_app.logger.warning("Missing Authorization header")
            return jsonify({"error": "Authentication required"}), 401
            
        # Extract token from header
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            current_app.logger.warning("Invalid Authorization header format")
            return jsonify({"error": "Invalid Authorization header format"}), 401
            
        token = parts[1]
        
        try:
            # Verify token and get user ID
            user_id = verify_token(token)
            g.user_id = user_id
            return f(*args, **kwargs)
            
        except AuthError as e:
            current_app.logger.warning(f"Authentication error: {e.message}")
            return jsonify({"error": e.message}), e.status_code
            
        except Exception as e:
            current_app.logger.error(f"Unexpected error during authentication: {str(e)}")
            return jsonify({"error": "Authentication failed"}), 500
            
    return decorated_function
