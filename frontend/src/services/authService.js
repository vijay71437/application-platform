import apiClient from "../api/apiClient";

export async function login(username,password){
    const response= await apiClient.post("/auth/login",{
        username,
        password
    },{
            skipAuth: true,
        });

    return response.data.data;
}


export async function refreshToken(refreshToken){
    const response= await apiClient.post("/auth/refresh-token",{
        refreshToken
    });

    return response.data.data;
}

export async function logout(refreshToken){
    const response= await apiClient.post("/auth/logout",{
        refreshToken
    });

    return response.data;
}

export async function changePassword(currentPassword,newPassword){
    const response= await apiClient.post("/auth/change-password",{
        currentPassword,
        newPassword
    });

    return response.data;
}

export async function refresh(refreshToken) {

    const response = await apiClient.post(
        "/auth/refresh",
        {
            refreshToken,
        },
        {
            skipAuth: true,
        }
    );

    return response.data.data;
}