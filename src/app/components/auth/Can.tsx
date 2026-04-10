import type { ReactNode } from "react"
import { useAuth } from "@/app/hooks/useAuth"
import { can } from "@/lib/permissions"

type Props = {
  permissions: string
  children: ReactNode
}

// Check if the user has the permission to perform the action
export const Can = ({ permissions, children }: Props) => {
  const { role } = useAuth()
  if (!role) return null
  if (!can(role, permissions)) return null
  return <>{children}</>
}