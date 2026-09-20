import { clearAuth, getAuth, setAuth } from "./authStorage";


export function getAuthToken() {

    const auth=getAuth();
    return auth?.accessToken;
}


export function getRefreshToken() {
    const auth=getAuth();
    return auth?.refreshToken;
}

export function updateAccessToken(accessToken) {
    const auth=getAuth();
    if(!auth){
        return;
    }
    const nextAuth={
        ...auth,
        accessToken,
    };
    setAuth(nextAuth);
}

export function clearAuthentication() {
    clearAuth();
}