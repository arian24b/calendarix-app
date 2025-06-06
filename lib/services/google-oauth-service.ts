/**
 * Google OAuth Service
 * Handles Google OAuth authentication via backend API only
 */

class GoogleOAuthService {
  /**
   * Initiate Google OAuth flow using backend API
   * This redirects the user to the backend which handles the entire OAuth flow
   */
  async signInViaBackend(): Promise<void> {
    try {
      // Redirect to the Next.js API route which forwards to the backend
      // The backend will redirect to Google OAuth and handle the entire flow
      window.location.href = '/api/auth/google';
    } catch (error) {
      console.error('Google OAuth backend error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const googleOAuthService = new GoogleOAuthService();
