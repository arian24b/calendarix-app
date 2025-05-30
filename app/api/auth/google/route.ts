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
    // Forward the request to your backend API
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/v1/OAuth/google/login`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      
      // Redirect to Google OAuth URL
      return corsResponse(NextResponse.redirect(data.auth_url));
    } else {
      console.error('Failed to get Google auth URL from backend');
      return corsResponse(NextResponse.json(
        { error: 'Failed to initiate Google OAuth' },
        { status: 500 }
      ));
    }
  } catch (error) {
    console.error('Google OAuth initiation error:', error);
    return corsResponse(NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    ));
  }
}

export async function POST(request: NextRequest) {
  // Same as GET for flexibility
  return GET(request);
}
