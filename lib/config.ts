/**
 * Application Configuration
 *
 * This file centralizes all configuration settings for the application.
 * It includes base URLs, API endpoints, social media links, and other
 * application-wide settings.
 */

// Environment variables (centralized)
export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  // API Configuration
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://api.calendarix.pro",
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.calendarix.pro",
  
  // Google OAuth Configuration
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  
  // Application URLs
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  
  // Feature flags
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  isPreview: !process.env.NEXT_PUBLIC_API_URL || 
             process.env.NEXT_PUBLIC_API_URL.includes("localhost") ||
             process.env.NEXT_PUBLIC_API_URL === ""
};

// Site metadata
export const siteConfig = {
  name: "CalendarIX - AI-Powered Calendar",
  description:
    "Get personalized schedules, from daily tasks to monthly goals, all in one place.",
  url: "https://calendarix.pro", // Production URL
  devUrl: "http://localhost:3000", // Development URL
  staticUrl: "https://calendarix.pro",
  staticHostname: "calendarix.pro",
  logo: "/logo.png",
  favicon: "/logo.png",
  placeholderImage:
    "/images/placeholder.svg?height=400&width=800",
  defaultLocale: "en",
  supportedLocales: ["en"],
};

// API endpoints and services
export const apiConfig = {
  baseUrl: env.NEXT_PUBLIC_API_URL,
  endpoints: {
    blog: "/blog",
    projects: "/projects",
    contact: "/contact",
    newsletter: "/newsletter",
    auth: "/auth",
  },
  // OAuth endpoints
  oauth: {
    google: {
      login: "/v1/OAuth/google/login",
      callback: "/v1/OAuth/google/callback",
    },
    github: {
      login: "/v1/OAuth/github/login",
      callback: "/v1/OAuth/github/callback",
    }
  }
};

// Google OAuth Configuration
export const googleConfig = {
  clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  apiKey: env.NEXT_PUBLIC_GOOGLE_API_KEY,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
  scope: "openid email profile",
  discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
  scopes: "https://www.googleapis.com/auth/calendar.readonly"
};

// Social media links
export const socialLinks = {
  twitter: "https://x.com/calendarix",
  github: "https://github.com/calendarix",
  linkedin: "https://linkedin.com/in/calendarix",
  youtube: "https://youtube.com/c/calendarix",
};

// Navigation links
export const navLinks = {
  main: [
    { label: "Home", url: "/" },
    { label: "About", url: "/#about" },
    { label: "Blog", url: "/blog" },
    { label: "Projects", url: "/resume" },
    { label: "Contact", url: "/#contact" },
  ],
  footer: {
    product: [
      { label: "Features", url: "/#feature" },
      { label: "Pricing", url: "/#pricing" },
      { label: "Changelog", url: "#" },
      { label: "Documentation", url: "/blog" },
    ],
    company: [
      { label: "About", url: "#" },
      { label: "Blog", url: "/blog" },
      { label: "Careers", url: "#" },
      { label: "Contact", url: "/contact" },
    ],
  },
  legal: [
    { label: "Privacy Policy", url: "/#privacy" },
    { label: "Terms of Service", url: "/#terms" },
  ],
};

// Feature flags
export const featureFlags = {
  enableBlog: true,
  enableProjects: true,
  enableContactForm: true,
  enableNewsletter: false,
  enableDarkMode: true,
};

// Analytics and tracking
export const analyticsConfig = {
  googleAnalyticsId: "", // e.g. "G-XXXXXXXXXX"
  enableAnalytics: env.isProduction,
};

// Content delivery
export const contentConfig = {
  blogPostsPerPage: 10,
  projectsPerPage: 9,
  maxRelatedPosts: 3,
};

// Default SEO configuration
export const seoConfig = {
  titleTemplate: "%s | CalendarIX",
  defaultTitle: "CalendarIX - Your Digital Studio",
  defaultDescription: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.logo,
        width: 500,
        height: 500,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    handle: "@CalendarIX",
    site: siteConfig.url,
    cardType: siteConfig.description,
  },
};

// Export a default config object that combines all configurations
const config = {
  env,
  site: siteConfig,
  api: apiConfig,
  google: googleConfig,
  social: socialLinks,
  nav: navLinks,
  features: featureFlags,
  analytics: analyticsConfig,
  content: contentConfig,
  seo: seoConfig,
};

export default config;
