# Flask Backend API

This directory contains the Flask backend API for the cozy-react-blueprint-box project.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the development server:
```bash
python app.py   # listens on 127.0.0.1:5000
```

## API Endpoints

- `/` - Root endpoint, returns a simple message
- `/debug/request` - Returns information about the current request for debugging
- `/templates/` - Returns a list of templates
- `/templates/<template_id>/` - Returns a specific template

## Development

The Flask API runs on port 5000 and is configured to work with the Vite development server running on port 5173. The Vite server proxies all `/api/*` requests to this Flask backend, eliminating CORS issues during development.

### Authentication

In development mode, you can bypass authentication by including the `X-API-Key` header with the value from the `.env` file. This prevents redirect-related CORS errors during development.

## Production

In production, the Flask API should be deployed to a proper hosting environment and the frontend should be configured to use the production API URL.
