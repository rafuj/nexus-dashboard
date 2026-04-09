import type { ReactNode } from "react"
import { useAuth } from "@/app/hooks/useAuth"
import { can } from "@/lib/permissions"

type Props = {
  permissions: string
  children: ReactNode
}

export const Can = ({ permissions, children }: Props) => {
  const { role } = useAuth()
  // If the user is not authenticated, return null
  if (!role) return null
  // If the user does not have the permission, return null
  if (!can(role, permissions)) return null
  // If the user has the permission, return the children
  return <>{children}</>
}