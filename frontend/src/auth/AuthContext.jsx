import {
    createContext,
    useContext,
    useState,
} from "react";

import {
    emptyAuthState,
} from "./authTypes";

import {
    clearAuth,
    getAuth,
    setAuth,
} from "./authStorage";

import {
    login as loginRequest,
    logout as logoutRequest,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [auth, setAuthState] = useState(
        () => getAuth() ?? emptyAuthState
    );

    async function login(username, password) {

        const data = await loginRequest(
            username,
            password
        );

        const nextAuth = {
            isAuthenticated: true,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: {
                userId: data.userId,
                username: data.username,
                roles: data.roles ?? [],
                permissions: data.permissions ?? [],
            },
        };

        setAuthState(nextAuth);
        setAuth(nextAuth);

        return nextAuth;
    }

    async function logout() {

        const refreshToken = auth.refreshToken;

        try {
            if (refreshToken) {
                await logoutRequest(refreshToken);
            }
        } finally {
            clearAuth();
            setAuthState(emptyAuthState);
        }
    }

    const value = {
        ...auth,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}