#!/usr/bin/env python3
"""
Main application entry point for production deployment.
This file is used by Render and other hosting platforms.
"""

import os
import sys

# Add the project directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Import the Flask app
from flask_app.app import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV") == "development"
    
    print(f"Starting Flask app on port {port}")
    print(f"Environment: {os.environ.get('FLASK_ENV', 'production')}")
    print(f"Debug mode: {debug}")
    
    app.run(host="0.0.0.0", port=port, debug=debug)
