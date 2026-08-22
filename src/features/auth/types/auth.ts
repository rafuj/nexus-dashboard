import type { Role } from "@/lib/permissions"

export interface User {
    createdAt: string,
    email: string,
    firstName: string,
    id: string
    lastName: string
    role: Role
    tenant: {
        id: string
        name: string
        type: string
    }
}