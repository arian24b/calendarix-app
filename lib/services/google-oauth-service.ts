/**
 * Google OAuth Service
 * Handles Google OAuth authentication for the application
 */

import { googleConfig } from '@/lib/config';

interface GoogleOAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
}

class GoogleOAuthService {
  private config: GoogleOAuthConfig;
  private isInitialized = false;

  constructor() {
    this.config = {
      clientId: googleConfig.clientId,
      redirectUri: googleConfig.redirectUri,
      scope: googleConfig.scope
    };
  }

  /**
   * Initialize Google OAuth
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (!this.config.clientId) {
      throw new Error('Google Client ID is not configured');
    }

    // Load Google Identity Services
    await this.loadGoogleIdentityServices();
    this.isInitialized = true;
  }

  /**
   * Load Google Identity Services script
   */
  private loadGoogleIdentityServices(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Google Identity Services can only be loaded in browser'));
        return;
      }

      // Check if already loaded
      if (window.google && window.google.accounts) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    });
  }

  /**
   * Initiate Google OAuth flow using backend API
   */
  async signInViaBackend(): Promise<void> {
    try {
      const response = await fetch('/api/auth/google', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // The API route will redirect to Google OAuth
        window.location.href = '/api/auth/google';
      } else {
        throw new Error('Failed to initiate Google OAuth');
      }
    } catch (error) {
      console.error('Google OAuth backend error:', error);
      throw error;
    }
  }

  /**
   * Client-side Google OAuth as fallback
   */
  async signInViaClient(): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      if (!window.google?.accounts?.oauth2) {
        reject(new Error('Google Identity Services not loaded'));
        return;
      }

      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: this.config.clientId,
        scope: this.config.scope,
        ux_mode: 'popup',
        callback: (response: any) => {
          if (response.code) {
            resolve(response.code);
          } else {
            reject(new Error('Google OAuth failed'));
          }
        },
        error_callback: (error: any) => {
          reject(new Error(`Google OAuth error: ${error.type}`));
        }
      });

      client.requestCode();
    });
  }

  /**
   * Exchange authorization code for tokens via backend
   */
  async exchangeCodeForTokens(code: string): Promise<any> {
    const response = await fetch('/api/auth/google/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        redirect_uri: this.config.redirectUri,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to exchange code for tokens');
    }

    return response.json();
  }
}

// Create and export singleton instance
export const googleOAuthService = new GoogleOAuthService();

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initCodeClient: (config: any) => any;
        };
        id?: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}
