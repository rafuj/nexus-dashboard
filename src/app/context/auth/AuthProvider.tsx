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

    // Find the user by email in mock users, to be replaced with a real API call later
    const foundUser =
      mockUsers.find((u) => u.email.toLowerCase() === normalized) ?? null
    if (!foundUser) {
      // If the user is not found, throw an error
      throw new Error("Invalid email or password")
    }
    setUser(foundUser)
    // Persist the user to local storage, so context to be restored on page reload
    persistUser(foundUser)
    // Return the user
    return foundUser
  }

  const logout = () => {
    // Clear the user from local storage, so context to be cleared on logout
    clearStoredUser()
    setUser(null)
  }

  const role: Role | null = user?.role ?? null // Get the role of the user, default to null if no user is authenticated
  const permissions = role ? rolePermissions[role] : [] // Get the permissions for the user's role

  return (
    <AuthContext.Provider value={{ user, role, permissions, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
