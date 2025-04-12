export interface UserCreate {
  username: string
  email: string
  phone?: string
  password: string
}

export interface Token {
  access_token: string
  token_type: string
}

export interface MessageResponse {
  message: string
}

export interface User {
  id: number
  username: string
  email: string
  phone?: string
  is_active: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface HTTPValidationError {
  detail: ValidationError[]
}

export interface ApiError {
  detail: string
}

// Specific error types from the API spec
export interface PasswordValidationError extends ApiError {
  detail:
    | "Password must be at least 8 characters long"
    | "Password must contain an uppercase letter"
    | "Password must contain a lowercase letter"
    | "Password must contain a digit"
    | "Password must contain a special character"
}

export interface UserExistsError extends ApiError {
  detail: "User already exists"
}

export interface InvalidCredentialsError extends ApiError {
  detail: "Invalid credentials"
}

export interface AccountLockedError extends ApiError {
  detail: "Account locked. Try again later."
}

export interface UserNotFoundError extends ApiError {
  detail: "User not found"
}
