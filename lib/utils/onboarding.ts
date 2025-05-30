// Utility functions for managing onboarding completion status

export function setOnboardingCompleted() {
  localStorage.setItem("hasCompletedOnboarding", "true");

  // Set cookie for middleware access
  if (typeof document !== "undefined") {
    document.cookie = `hasCompletedOnboarding=true; path=/; max-age=${365 * 24 * 60 * 60}; secure; samesite=strict`;
  }
}

export function getOnboardingCompleted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("hasCompletedOnboarding") === "true";
}

export function clearOnboardingCompleted() {
  localStorage.removeItem("hasCompletedOnboarding");

  if (typeof document !== "undefined") {
    document.cookie = "hasCompletedOnboarding=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
}
