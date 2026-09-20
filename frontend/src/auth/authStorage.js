const AUTH_KEY="application_platform_auth";

export function getAuth(){
    const value=sessionStorage.getItem(AUTH_KEY);
    if(!value){
        return null;
    }
    try{
        return JSON.parse(value);
    }catch(e){
        sessionStorage.removeItem(AUTH_KEY);
        return null;
    }
}

export function setAuth(auth){
    sessionStorage.setItem(AUTH_KEY,JSON.stringify(auth));
}

export function clearAuth(){
    sessionStorage.removeItem(AUTH_KEY);
}