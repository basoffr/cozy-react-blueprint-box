# Cozy React Blueprint Box Documentation

## Environment Variables

The application uses environment variables for configuration. Create a `.env` file in the project root directory with the following variables:

```
# API Configuration
DEV_API_KEY=dev-secret

# CORS Configuration
ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173

# Other configuration variables
# ...
```

### CORS Configuration

The `ALLOWED_ORIGINS` environment variable specifies which origins are allowed to make cross-origin requests to the API. It should be a comma-separated list of URLs.

For local development, both `http://127.0.0.1:5173` and `http://localhost:5173` are included by default, even if the `ALLOWED_ORIGINS` environment variable is not set.

In production, you should set this variable to include your production domain(s).

## Authentication

For information about authentication, see [auth.md](./auth.md).
