# Google OAuth Setup Guide

## Issues Fixed

1. **CORS Headers**: Added proper CORS configuration to middleware and API routes
2. **Google OAuth Implementation**: Added complete Google OAuth flow with backend API integration
3. **Error Handling**: Added comprehensive error handling for OAuth failures
4. **Environment Variables**: Set up proper environment configuration

## Required Configuration

### 1. Google OAuth Credentials

You need to set up Google OAuth credentials in your `.env.local` file:

```bash
# Get these from Google Cloud Console
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API and Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (development)
   - `https://your-domain.com/api/auth/google/callback` (production)

### 3. Backend API Requirements

Your backend API (`api.calendarix.pro`) needs to support:

#### Endpoint: `GET /v1/OAuth/google/login`
- Returns: `{ "auth_url": "https://accounts.google.com/oauth/..." }`

#### Endpoint: `POST /v1/OAuth/google/callback`
- Accepts: `{ "code": "auth_code", "redirect_uri": "callback_url" }`
- Returns: `{ "access_token": "jwt_token", "user": {...} }`

### 4. CORS Configuration

The middleware now includes CORS headers for:
- `api.calendarix.pro` (your backend)
- `accounts.google.com` (Google OAuth)
- `oauth2.googleapis.com` (Google APIs)
- Local development URLs

## Development vs Production

### Development
To use a local backend for development, uncomment these lines in `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Production
The app will use `https://api.calendarix.pro` by default.

## Testing

1. Make sure your backend API is running and accessible
2. Set up Google OAuth credentials
3. Test the login flow:
   - Click "Continue with Google"
   - Should redirect to Google OAuth
   - After authorization, should redirect back and log you in

## Troubleshooting

### CORS Errors
- Check that your backend API includes proper CORS headers
- Verify the allowed origins include your frontend domain

### Google OAuth Errors
- Verify Google Client ID is set correctly
- Check redirect URIs in Google Cloud Console
- Ensure your backend OAuth endpoints are working

### API Connection Issues
- Check network tab for failed API calls
- Verify API URL configuration
- Test API endpoints directly

## Files Modified

1. `middleware.ts` - Added CORS headers and security configuration
2. `app/auth/page.tsx` - Added Google OAuth functionality
3. `app/api/auth/google/route.ts` - Google OAuth initiation endpoint
4. `app/api/auth/google/callback/route.ts` - OAuth callback handler
5. `lib/services/google-oauth-service.ts` - Google OAuth service
6. `lib/cors.ts` - CORS utility functions
7. `.env.local` - Environment variables configuration
