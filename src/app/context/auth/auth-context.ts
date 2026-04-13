import { createContext } from "react"

import type { User } from "@/features/auth/types/auth"
import type { Role } from "@/lib/permissions"

export type AuthContextType = {
  user: User | null
  role: Role | null
  permissions: string[]
  login: (email: string, password: string) => Promise<User | null>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
