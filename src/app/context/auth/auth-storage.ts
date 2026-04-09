import { mockUsers } from "@/features/auth/data/mockUsers"
import type { User } from "@/features/auth/types/auth"

const STORAGE_KEY = "updaid-auth-user"

/**
 * Restore session from localStorage. Only IDs present in `mockUsers` are trusted
 * so tampered JSON cannot invent roles.
 */
export function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object") return null
    const id = (parsed as { id?: unknown }).id
    if (typeof id !== "number") return null
    return mockUsers.find((u) => u.id === id) ?? null
  } catch {
    return null
  }
}

export function persistUser(user: User) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEY)
}
