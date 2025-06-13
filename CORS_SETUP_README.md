# CORS & Proxy Setup Guide

This guide explains how the CORS and proxy setup has been implemented in the project.

## Implementation Details

### 1. Vite Proxy Configuration
- Added a proxy configuration in `vite.config.ts` to forward `/api/*` requests to `https://api.mydomain.com`
- The proxy automatically rewrites the path to remove the `/api` prefix
- This eliminates CORS issues during local development

### 2. API Helper
- Created a new API helper in `src/api/api.ts` that automatically switches between:
  - Development: Uses the local proxy (`/api`)
  - Production: Uses the actual API domain (`https://api.mydomain.com`)
- The helper includes credentials in requests to maintain cookies across environments

### 3. API Services
- Updated all API services to use the new API helper
- This ensures consistent behavior across development and production environments

### 4. Backend CORS Configuration
- Added CORS configuration to the Flask backend
- Whitelisted local development origin (`http://127.0.0.1:5173`)
- Set up for production with `https://app.mydomain.com`
- Enabled credential support for cookies

## Testing

### Development Mode
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
- The app should run on port 5173
- API requests should be proxied through Vite to avoid CORS errors
- Check browser console for absence of CORS errors

### Production Mode
```bash
# Build the app
npm run build

# Serve the built app
npx serve -s dist
```
- The app should connect directly to `https://api.mydomain.com`
- The backend should allow requests from `https://app.mydomain.com`

### Flask Backend
```bash
# Navigate to the Flask app directory
cd flask_app

# Install requirements
pip install -r requirements.txt

# Run the Flask app
python app.py
```
- The Flask app should run on port 5000
- It should respond with appropriate CORS headers for allowed origins

## Troubleshooting

If you encounter CORS issues:
1. Verify that the Vite development server is running
2. Check that the Flask backend has the correct origins whitelisted
3. Ensure that the API helper is being used for all fetch requests
4. Verify that credentials are being included in requests if needed
