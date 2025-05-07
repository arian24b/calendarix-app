/**
 * Application Configuration
 *
 * This file centralizes all configuration settings for the application.
 * It includes base URLs, API endpoints, social media links, and other
 * application-wide settings.
 */

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
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.calendarix.pro",
  endpoints: {
    blog: "/blog",
    projects: "/projects",
    contact: "/contact",
    newsletter: "/newsletter",
    auth: "/auth",
  },
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
  enableAnalytics: process.env.NODE_ENV === "production",
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
  site: siteConfig,
  api: apiConfig,
  social: socialLinks,
  nav: navLinks,
  features: featureFlags,
  analytics: analyticsConfig,
  content: contentConfig,
  seo: seoConfig,
};

export default config;
