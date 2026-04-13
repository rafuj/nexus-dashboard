import type { ReactNode } from "react"
import { useAuth } from "@/app/hooks/useAuth"
import type { Role } from "@/lib/permissions"

type Props = {
  allow: Role[]
  children: ReactNode
}

// Check if the user has the role to access the component
export const RoleGate = ({ allow, children }: Props) => {
  const { role } = useAuth()
  if (!role) return null
  if (!allow.includes(role)) return null
  return <>{children}</>
}