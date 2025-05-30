import { NextRequest, NextResponse } from 'next/server';
import { handleCors, corsResponse } from '@/lib/cors';
import { env } from '@/lib/config';

export async function OPTIONS(request: NextRequest) {
  return handleCors(request);
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request, 'DELETE');
}

async function proxyRequest(request: NextRequest, method: string) {
  const corsCheck = handleCors(request);
  if (corsCheck) return corsCheck;

  try {
    // Extract the path from the URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    // Remove /api/proxy from the path
    const apiPath = '/' + pathSegments.slice(3).join('/');
    
    // Add query parameters
    const searchParams = url.searchParams.toString();
    const fullPath = apiPath + (searchParams ? `?${searchParams}` : '');

    console.log(`Proxying ${method} request to: ${env.NEXT_PUBLIC_API_URL}${fullPath}`);

    // Prepare headers for the backend request
    const headers: HeadersInit = {};
    
    // Copy important headers from the original request
    const headersToProxy = ['content-type', 'authorization', 'accept'];
    headersToProxy.forEach(headerName => {
      const headerValue = request.headers.get(headerName);
      if (headerValue) {
        headers[headerName] = headerValue;
      }
    });

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers,
    };

    // Add body for non-GET requests
    if (method !== 'GET' && request.body) {
      requestOptions.body = await request.blob();
    }

    // Make the request to the backend API
    const backendUrl = `${env.NEXT_PUBLIC_API_URL}${fullPath}`;
    const response = await fetch(backendUrl, requestOptions);

    console.log(`Backend response status: ${response.status}`);

    // Get the response data
    const contentType = response.headers.get('content-type');
    let responseData;

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Create the response with proper CORS headers
    const nextResponse = NextResponse.json(responseData, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy relevant headers from backend response
    const headersToCopy = ['content-type', 'cache-control', 'etag'];
    headersToCopy.forEach(headerName => {
      const headerValue = response.headers.get(headerName);
      if (headerValue) {
        nextResponse.headers.set(headerName, headerValue);
      }
    });

    return corsResponse(nextResponse);

  } catch (error) {
    console.error('Proxy request error:', error);
    return corsResponse(NextResponse.json(
      { 
        error: 'Proxy request failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    ));
  }
}
