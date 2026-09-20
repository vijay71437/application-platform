export function hasRole(user, role) {
    return user?.roles?.includes(role) ?? false;
}

export function hasAnyRole(user, roles) {
    return roles.some((role) =>
        hasRole(user, role)
    );
}

export function hasAllRoles(user, roles) {
    return roles.every((role) =>
        hasRole(user, role)
    );
}

export function hasPermission(user, permission) {
    return user?.permissions?.includes(permission) ?? false;
}

export function hasAnyPermission(user, permissions) {
    return permissions.some((permission) =>
        hasPermission(user, permission)
    );
}

export function hasAllPermissions(user, permissions) {
    return permissions.every((permission) =>
        hasPermission(user, permission)
    );
}