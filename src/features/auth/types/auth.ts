import type { Role } from "@/lib/permissions"

export type User = {
    id: number
    name: string
    email: string
    password?: string
    /** Role of the user */
    role?: Role | null
}