import type { ReactNode } from "react"
import { useAuth } from "@/app/hooks/useAuth"
import type { Role } from "@/lib/permissions"

type Props = {
  allow: Role[]
  children: ReactNode
}

export const RoleGate = ({ allow, children }: Props) => {
  const { role } = useAuth()
  // If the user is not authenticated, return null
  if (!role) return null
  // If the user does not have the role, return null
  if (!allow.includes(role)) return null
  // If the user has the role, return the children
  return <>{children}</>
}