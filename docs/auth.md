# Supabase Auth Configuration

This document provides instructions for configuring Supabase Authentication for this project.

## Local Development Configuration

When setting up Supabase Auth for local development, use the following settings:

1. **Site URL**: `http://localhost:5173`
2. **Redirect URLs**: `http://localhost:5173/auth/callback`

## Production Configuration

For production environments, use the following settings:

1. **Site URL**: `https://app.mydomain.com`
2. **Redirect URLs**: `https://app.mydomain.com/auth/callback`

## Auth Flow

This project uses the Supabase Auth flow with the following steps:

1. User clicks "Sign In" button
2. User is redirected to Supabase Auth UI
3. After successful authentication, user is redirected back to the application
4. The application exchanges the code for a session
5. The session is stored in the browser and used for subsequent API requests

## Implementation Details

The authentication logic is implemented in the following files:

- `src/auth/supabase.ts`: Supabase client configuration
- `src/auth/AuthProvider.tsx`: React context for authentication state
- `src/routes/auth/callback.tsx`: Handles the redirect from Supabase

## Testing Authentication

To test authentication locally:

1. Start the development server: `npm run dev`
2. Open the application in your browser: `http://localhost:5173`
3. Click "Sign In" and complete the authentication flow
4. You should be redirected back to the application and see your user information

## Troubleshooting

If you encounter issues with authentication:

1. Check that the Site URL and Redirect URLs are correctly configured in Supabase
2. Ensure that the API key and URL are correctly set in your environment variables
3. Check the browser console for any errors
4. Verify that the redirect URL in your application matches the one configured in Supabase
