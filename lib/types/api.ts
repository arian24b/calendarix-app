// Authentication Types
export interface UserCreate {
  username: string
  email: string
  password: string
  phone?: string | null
}

export interface Token {
  access_token: string
  token_type: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  token: string
  new_password: string
}

export interface MessageResponse {
  message: string
}

export interface TwoFactorSetupResponse {
  secret: string
  otp_auth_url: string
}

export interface TwoFactorVerify {
  token: string
}

// User Types
export interface ProfileUpdate {
  username?: string | null
  phone?: string | null
}

export interface UserID {
  user_id: number
}

export interface ApiKeyResponse {
  api_key: string
}

// Task Types
export interface TaskCreate {
  title: string
  description?: string | null
  due_date?: string | null
  priority?: number | null // 1-5
}

export interface TaskOut {
  title: string
  description?: string | null
  due_date?: string | null
  priority?: number | null
  id: string
  user_id: string
  created_at: string
  updated_at?: string | null
}

export interface TaskUpdate {
  task_id: string
  title?: string | null
  description?: string | null
  due_date?: string | null
  priority?: number | null
}

export interface TaskDelete {
  task_id: string
}

// Habit Types
export interface HabitCreate {
  title: string
  frequency: string
  description?: string | null
  settings?: Record<string, any> | null
}

export interface HabitOut {
  title: string
  frequency: string
  description?: string | null
  settings?: Record<string, any> | null
  id: string
  user_id: string
  created_at: string
  updated_at?: string | null
}

export interface HabitUpdate {
  habit_id: string
  title?: string | null
  frequency?: string | null
  description?: string | null
  settings?: Record<string, any> | null
}

export interface HabitDelete {
  habit_id: string
}

// Calendar Types
export interface CalendarCreate {
  name: string
  provider: string
}

export interface CalendarOut {
  id: string
  user_id: number
  name: string
  provider: string
  external_calendar_id?: string | null
  created_at: string
  updated_at?: string | null
}

export interface CalendarEvent {
  calendar_id: string
}

export interface EventCreate {
  title: string
  start_time: string
  end_time?: string | null
  calendar_id: string
}

export interface EventOut {
  id: string
  calendar_id: string
  title: string
  start_time: string
  end_time?: string | null
  created_at: string
  updated_at?: string | null
}

// Notification Types
export interface NotificationCreate {
  user_id: number
  title?: string | null
  message: string
  is_read?: boolean
}

export interface NotificationRead {
  id: string
  user_id: number
  title?: string | null
  message: string
  created_at: string
  updated_at?: string | null
  is_read: boolean
}

// Response Types
export interface StringIDResponse {
  id: string
}

export interface HealthResponse {
  status: string
  stats: Record<string, any>
}

// Error Types
export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface HTTPValidationError {
  detail: ValidationError[]
}

// Form Types
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

export interface FormGet {
  form_id: number
}

// Subscription Types
export interface SubscriptionRequest {
  email: string
  requestdata: Record<string, any>
}

export interface SubscriptionResponse {
  message: string
}

export interface SubscriptionCountResponse {
  subscribed_count: number
}
