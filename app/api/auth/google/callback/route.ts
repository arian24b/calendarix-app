import { NextRequest, NextResponse } from 'next/server';
import { handleCors, corsResponse } from '@/lib/cors';
import { env } from '@/lib/config';

export async function OPTIONS(request: NextRequest) {
  return handleCors(request);
}

export async function GET(request: NextRequest) {
  const corsCheck = handleCors(request);
  if (corsCheck) return corsCheck;

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  console.log('Google OAuth callback received:', { code: !!code, state, error });

  // Handle OAuth errors
  if (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(new URL('/auth?error=oauth_error', request.url));
  }

  // Handle successful OAuth callback
  if (code) {
    try {
      console.log('Exchanging code for tokens...');
      
      // Exchange code for tokens with your backend API
      const backendUrl = `${env.NEXT_PUBLIC_API_URL}/v1/OAuth/google/callback`;
      console.log('Making request to:', backendUrl);
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        }),
      });

      console.log('Backend callback response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Successfully received tokens from backend');
        
        // Create a response that will set the token cookie and redirect
        const redirectResponse = NextResponse.redirect(new URL('/calendar', request.url));
        
        // Set the authentication token as a cookie
        if (data.access_token) {
          redirectResponse.cookies.set('token', data.access_token, {
            httpOnly: true,
            secure: env.isProduction,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
          });
        }

        return redirectResponse;
      } else {
        const errorData = await response.text();
        console.error('Backend OAuth callback error:', {
          status: response.status,
          body: errorData
        });
        return NextResponse.redirect(new URL('/auth?error=backend_error', request.url));
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      return NextResponse.redirect(new URL('/auth?error=callback_error', request.url));
    }
  }

  // If no code or error, redirect to auth
  console.log('No code or error in callback, redirecting to auth');
  return NextResponse.redirect(new URL('/auth', request.url));
}

export async function POST(request: NextRequest) {
  const corsCheck = handleCors(request);
  if (corsCheck) return corsCheck;

  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return corsResponse(NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      ));
    }

    // Exchange code for tokens with your backend API
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/v1/OAuth/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return corsResponse(NextResponse.json(data));
    } else {
      const errorData = await response.json();
      console.error('Backend OAuth error:', errorData);
      return corsResponse(NextResponse.json(
        { error: 'Authentication failed' },
        { status: 400 }
      ));
    }
  } catch (error) {
    console.error('OAuth callback error:', error);
    return corsResponse(NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    ));
  }
}
