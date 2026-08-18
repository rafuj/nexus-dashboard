import { useState } from "react"
import type { ReactNode } from "react"

import { AuthContext, type VerifyOtpRegPayload } from "./auth-context"
import type { User } from "@/features/auth/types/auth"
import { rolePermissions, type Role } from "@/lib/permissions"
import { api } from "@/app/api-manage/api"
import { API_ROUTES } from "@/app/api-manage/api-routes"

import {
  clearStoredUser,
  persistUser,
  readStoredUser,
} from "./auth-storage" // static will be changed in future

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => readStoredUser())
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  /**
   * LOGIN
   *
   * POST /login
   *
   * Backend:
   * - validates email/password
   * - sends login OTP
   * - sets temporary sessionToken cookie
   */
  const login = async (email: string, password: string) => {
    await api.post(API_ROUTES.LOGIN, {
      email: email.trim().toLowerCase(),
      password,
    })
  }

  /**
   * VERIFY LOGIN OTP
   *
   * POST /verify-otp
   *
   * Backend:
   * - verifies OTP
   * - changes temporary sessionToken
   *   to authenticated sessionToken
   */
  const verifyOtp = async (otpCode: string) => {
    await api.post(API_ROUTES.VERIFY_OTP, {
      otpCode: otpCode
    })
    setUser({ id: 1, name: "Owner User", email: "owner@nexus.com", role: "owner" }) // As User Info Endpoint is not Available User is being Set Static
    persistUser({ id: 1, name: "Owner User", email: "owner@nexus.com", role: "owner" }) // As User Info Endpoint is not Available User is being Set Static   
  }

  /**
   * SEND REGISTRATION OTP
   *
   * POST /send-otp-reg
   *
   * Backend:
   * - sends registration OTP to email
   */
  const sendOtpReg = async (email: string) => {
    await api.post(API_ROUTES.SEND_OTP_REG, {
      email: email.trim().toLowerCase(),
    })
  }

  /**
   * VERIFY REGISTRATION OTP
   *
   * POST /verify-otp-reg
   *
   * Backend:
   * - verifies registration OTP
   * - allows registration to continue
   */
  const verifyOtpReg = async (data: VerifyOtpRegPayload) => {
    await api.post(API_ROUTES.VERIFY_OTP_REG, data)
  }

  /**
   * CREATE ACCOUNT
   *
   * POST /users
   */
  const signup = async (data: object) => {
    await api.post(API_ROUTES.USERS, data)
  }

  /**
   * LOGOUT
   */
  const logout = async () => {
    try {
      await api.post(API_ROUTES.LOGOUT)
    } finally {
      clearStoredUser()
      setUser(null)
    }
  }

  const role: Role | null = user?.role ?? null

  const permissions = role
    ? rolePermissions[role]
    : []

  

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        permissions,

        login,
        verifyOtp,

        sendOtpReg,
        verifyOtpReg,

        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}