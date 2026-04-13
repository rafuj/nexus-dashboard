import { useState } from "react"
import type { ReactNode } from "react"

import { AuthContext } from "./auth-context"
import {
  clearStoredUser,
  persistUser,
  readStoredUser,
} from "./auth-storage"
import { mockUsers } from "@/features/auth/data/mockUsers"
import type { User } from "@/features/auth/types/auth"
import { rolePermissions, type Role } from "@/lib/permissions"

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => readStoredUser())

  /**
   * Mock auth: any non-empty password works if the email matches a mock user.
   * Replace with a real API call later.
   */
  const login = async (
    email: string,
    password: string,
  ): Promise<User | null> => {
    if (!password.trim()) {
      throw new Error("Password is required")
    }
    const normalized = email.trim().toLowerCase()
    const foundUser =
      mockUsers.find((u) => u.email.toLowerCase() === normalized) ?? null
    if (!foundUser) {
      throw new Error("Invalid email or password")
    }
    setUser(foundUser)
    persistUser(foundUser)
    return foundUser
  }

  const logout = () => {
    clearStoredUser()
    setUser(null)
  }

  const role: Role | null = user?.role ?? null 
  const permissions = role ? rolePermissions[role] : []

  return (
    <AuthContext.Provider value={{ user, role, permissions, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
