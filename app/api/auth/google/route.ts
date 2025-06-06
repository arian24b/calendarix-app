import { NextRequest, NextResponse } from 'next/server';
import { handleCors, corsResponse } from '@/lib/cors';
import { env } from '@/lib/config';

export async function OPTIONS(request: NextRequest) {
  return handleCors(request);
}

export async function GET(request: NextRequest) {
  const corsCheck = handleCors(request);
  if (corsCheck) return corsCheck;

  try {
    console.log('Initiating Google OAuth flow...');
    console.log('Backend API URL:', env.NEXT_PUBLIC_API_URL);

    // Forward the request to your backend API
    const backendUrl = `${env.NEXT_PUBLIC_API_URL}/v1/OAuth/google/login`;
    console.log('Making request to:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      redirect: 'manual', // Don't follow redirects automatically
    });

    console.log('Backend response status:', response.status);
    console.log('Backend response headers:', Object.fromEntries(response.headers.entries()));

    // Handle redirects (302, 307) - these are the expected responses from OAuth initiation
    if (response.status === 302 || response.status === 307 || response.headers.get('location')) {
      const redirectUrl = response.headers.get('location');
      if (redirectUrl) {
        console.log('Backend provided redirect URL:', redirectUrl);
        // Don't add CORS headers to external redirects - they interfere with OAuth flow
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Only process successful responses (2xx) for JSON content
    if (response.ok) {

      // Try to get JSON response with auth URL
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Backend response data:', data);

        // Check if we have auth_url in response
        if (data.auth_url) {
          console.log('Redirecting to Google OAuth URL:', data.auth_url);
          // Don't add CORS headers to external redirects - they interfere with OAuth flow
          return NextResponse.redirect(data.auth_url);
        } else {
          console.error('Backend response missing auth_url:', data);
          return corsResponse(NextResponse.json(
            { error: 'Invalid response from backend: missing auth_url' },
            { status: 500 }
          ));
        }
      } else {
        // If not JSON, this might be a direct redirect from the backend
        const responseText = await response.text();
        console.log('Non-JSON response from backend:', responseText);

        // Try to extract redirect URL from response or use the URL directly
        const googleOAuthUrl = responseText.trim();
        if (googleOAuthUrl.startsWith('https://accounts.google.com')) {
          console.log('Redirecting to extracted Google OAuth URL:', googleOAuthUrl);
          // Don't add CORS headers to external redirects - they interfere with OAuth flow
          return NextResponse.redirect(googleOAuthUrl);
        }

        return corsResponse(NextResponse.json(
          { error: 'Invalid response format from backend' },
          { status: 500 }
        ));
      }
    } else {
      const errorText = await response.text();
      console.error('Backend API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });

      return corsResponse(NextResponse.json(
        {
          error: 'Failed to initiate Google OAuth',
          details: `Backend returned ${response.status}: ${errorText}`
        },
        { status: 500 }
      ));
    }
  } catch (error) {
    console.error('Google OAuth initiation error:', error);
    return corsResponse(NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    ));
  }
}

export async function POST(request: NextRequest) {
  // Same as GET for flexibility
  return GET(request);
}
