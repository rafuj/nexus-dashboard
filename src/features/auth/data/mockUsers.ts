import type { User } from "@/features/auth/types/auth"

export const mockUsers: User[] = [
  { id: 1, name: "Owner User", email: "owner@nexus.com", role: "owner" },
  { id: 2, name: "Admin User", email: "admin@nexus.com", role: "admin" },
  { id: 3, name: "Viewer User", email: "viewer@nexus.com", role: "viewer" },
  { id: 4, name: "Super User", email: "super@nexus.com", role: "super" },
]