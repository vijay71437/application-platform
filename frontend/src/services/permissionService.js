import apiClient from "../api/apiClient";

export async function getPermissions() {
    const response = await apiClient.get(
        "/permissions"
    );

    return response.data.data;
}

export async function getPermissionById(id) {
    const response = await apiClient.get(
        `/permissions/${id}`
    );

    return response.data.data;
}

export async function createPermission(permission) {
    const response = await apiClient.post(
        "/permissions",
        permission
    );

    return response.data.data;
}

export async function updatePermission(
    id,
    permission
) {
    const response = await apiClient.put(
        `/permissions/${id}`,
        permission
    );

    return response.data.data;
}

export async function deletePermission(id) {
    const response = await apiClient.delete(
        `/permissions/${id}`
    );

    return response.data.data;
}