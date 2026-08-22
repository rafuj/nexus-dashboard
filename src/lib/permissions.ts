export type Role = "owner" | "admin" | "super"

export type RoleFilter = Role | "all";

export const rolePermissions: Record<Role, string[]> = {
    owner: ["manage_users", "manage_cabinets", "manage_assets", "view_all","view_logs"],
    admin: ["manage_cabinets", "manage_assets", "view_all", "view_logs"],
    // viewer: ["view_all", "view_logs"],
    super: ["*"],
    // 
    // factory: ["manage_cabinets", "manage_assets", "view_all", "view_logs"],
}


// Check if the user has the permission to perform the action
export const can = (role: Role, action: string) => {
    const permissions = rolePermissions[role]
    return permissions.includes(action) || permissions.includes("*")
}

// Check if the user does not have the permission to perform the action
export const cannot = (role: Role, action: string) => {
    const permissions = rolePermissions[role]
    return !permissions.includes(action) && !permissions.includes("*")
}