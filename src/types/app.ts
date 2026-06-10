import type { UserProfile } from './dashboard'

export interface ApiPlaceholderResult {
  ok: boolean
  endpoint: string
  message: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface AuthSession {
  isLoggedIn: boolean
  user: UserProfile
  mode: 'auto' | 'manual'
  message: string
}
