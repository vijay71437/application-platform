export const emptyUser = {
    userId: null,
    username: null,
    roles: [],
    permissions: [],
};

export const emptyAuthState = {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    user: emptyUser,
};