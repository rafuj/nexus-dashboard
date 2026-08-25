import { createContext } from "react"

import type { User } from "@/features/auth/types/auth"
import type { Role } from "@/lib/permissions"

export interface VerifyOtpRegPayload {
  email: string
  otpCode: string
}
export interface VerifyOtpPayload {
  otpCode: string
}

export type AuthContextType = {
  user: User | null
  role: Role | null
  permissions: string[]
  // isAuthenticated: boolean //

  login: (email: string, password: string) => Promise<void>
  verifyOtp: (otp: string) => Promise<void> //
  getUser: () => void
  updateProfile: () => void
  
  sendOtpReg: (otp: string) => Promise<void>
  verifyOtpReg: (data: VerifyOtpRegPayload) => Promise<void>
  signup: (props: object) => Promise<void>
  
  getUserRolePermission: () => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
