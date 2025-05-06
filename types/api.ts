// Type definitions based on the OpenAPI specification

// Authentication types
export interface Token {
  access_token: string
  token_type: string
}

export interface UserCreate {
  username: string
  email: string
  password: string
  phone?: string
}

export interface ProfileUpdate {
  username?: string
  phone?: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  token: string
  new_password: string
}

export interface TwoFactorVerify {
  token: string
}

export interface TwoFactorSetupResponse {
  secret: string
  otp_auth_url: string
}

export interface MessageResponse {
  message: string
}

// Calendar types
export interface CalendarCreate {
  name: string
  provider: string
}

export interface CalendarOut {
  id: string
  user_id: number
  name: string
  provider: string
  external_calendar_id: string | null
  created_at: string
  updated_at: string | null
}

export interface EventCreate {
  title: string
  start_time: string
  end_time?: string | null
}

export interface EventOut {
  id: string
  calendar_id: string
  title: string
  start_time: string
  end_time: string | null
  created_at: string
  updated_at: string | null
}

// Subscription types
export interface SubscriptionRequest {
  email: string
  requestdata: Record<string, any> | null
}

export interface SubscriptionResponse {
  message: string
}

export interface SubscriptionCountResponse {
  subscribed_count: number
}

// Form types
export interface FormCreate {
  name: string
  email: string
  data: Record<string, any>
}

export interface FormResponse {
  id: number
  name: string
  email: string
  data: Record<string, any>
}
