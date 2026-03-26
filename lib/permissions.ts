export enum Role {
    SUPERADMIN = 'superadmin', // System-wide master admin
    OWNER = 'owner',           // Tenant owner
    ADMIN = 'admin',           // Tenant administrator
    STAFF = 'staff',           // Tenant staff/employee
    USER = 'user',             // End-user / Customer
}

// Numerical hierarchy for role permission checking
export const roleHierarchy: Record<Role, number> = {
    [Role.SUPERADMIN]: 100,
    [Role.OWNER]: 80,
    [Role.ADMIN]: 60,
    [Role.STAFF]: 40,
    [Role.USER]: 20,
};

/**
 * Checks if the user's role is sufficient to perform an action
 * requiring a specific minimum role.
 * 
 * @param userRole The role from the user's JWT or session
 * @param requiredRole The minimum role required for the action
 */
export const hasPermission = (userRole: string | Role, requiredRole: Role): boolean => {
    const uRole = userRole as Role;
    if (!roleHierarchy[uRole]) return false;

    return roleHierarchy[uRole] >= roleHierarchy[requiredRole];
};

/**
 * Useful for multi-tenant applications checking if the staff/user
 * has the right to access resources in the provided tenantId
 */
export const canAccessTenant = (userTenantId: string, resourceTenantId: string, userRole: string | Role): boolean => {
    if (userRole === Role.SUPERADMIN) return true;
    return userTenantId === resourceTenantId;
};
