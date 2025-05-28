import { authAPI, APIRequestError } from "../api-client"
import type { UserCreate, Token, MessageResponse, PasswordResetRequest, PasswordResetConfirm } from "../types/api"

interface LoginCredentials {
  username: string
  password: string
}

export async function register(userData: UserCreate): Promise<Token> {
  try {
    return await authAPI.register(userData)
  } catch (error) {
    if (error instanceof APIRequestError) {
      throw new Error(error.detail)
    }
    throw error
  }
}

export async function login(credentials: LoginCredentials): Promise<Token> {
  try {
    return await authAPI.login(credentials.username, credentials.password)
  } catch (error) {
    if (error instanceof APIRequestError) {
      throw new Error(error.detail)
    }
    throw error
  }
}

export async function requestPasswordReset(email: string): Promise<MessageResponse> {
  try {
    const data: PasswordResetRequest = { email }
    return await authAPI.requestPasswordReset(data)
  } catch (error) {
    if (error instanceof APIRequestError) {
      throw new Error(error.detail)
    }
    throw error
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
  try {
    const data: PasswordResetConfirm = { token, new_password: newPassword }
    return await authAPI.confirmPasswordReset(data)
  } catch (error) {
    if (error instanceof APIRequestError) {
      throw new Error(error.detail)
    }
    throw error
  }
}

export async function verifyEmail(token: string): Promise<MessageResponse> {
  try {
    return await authAPI.verifyEmail(token)
  } catch (error) {
    if (error instanceof APIRequestError) {
      throw new Error(error.detail)
    }
    throw error
  }
}
