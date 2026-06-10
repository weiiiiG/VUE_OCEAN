import { apiEndpoints, runtimeConfig } from '../config/runtime'
import { userProfile } from '../mock/dashboard'
import type { AuthSession, LoginPayload } from '../types/app'

function delay<T>(value: T, ms = runtimeConfig.requestDelayMs) {
  return new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), ms)
  })
}

export function initializeAuthSession(): Promise<AuthSession> {
  if (runtimeConfig.autoLoginEnabled) {
    return delay({
      isLoggedIn: true,
      user: userProfile,
      mode: 'auto',
      message: `自动登录已开启，默认以 ${userProfile.name} 登录`,
    })
  }

  return delay({
    isLoggedIn: false,
    user: userProfile,
    mode: 'manual',
    message: '自动登录已关闭，请手动登录',
  })
}

export function loginWithPassword(payload: LoginPayload): Promise<AuthSession> {
  return delay({
    isLoggedIn: true,
    user: {
      ...userProfile,
      name: payload.username || userProfile.name,
    },
    mode: runtimeConfig.autoLoginEnabled ? 'auto' : 'manual',
    message: `预留真实登录接口 ${apiEndpoints.authLogin}`,
  })
}

export function logoutSession(currentUserName: string): Promise<AuthSession> {
  if (runtimeConfig.autoLoginEnabled) {
    return delay({
      isLoggedIn: true,
      user: {
        ...userProfile,
        name: currentUserName || userProfile.name,
      },
      mode: 'auto',
      message: '自动登录已开启，退出后仍保持默认登录态',
    })
  }

  return delay({
    isLoggedIn: false,
    user: userProfile,
    mode: 'manual',
    message: `预留真实退出接口 ${apiEndpoints.authLogout}`,
  })
}
