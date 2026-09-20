import apiClient from "../api/apiClient";

export async function getRoles() {
    const response = await apiClient.get("/roles");
    return response.data.data;
}

export async function getRoleById(id) {
    const response = await apiClient.get(`/roles/${id}`);
    return response.data.data;
}

export async function createRole(role) {
    const response = await apiClient.post(
        "/roles",
        role
    );

    return response.data.data;
}

export async function updateRole(id, role) {
    const response = await apiClient.put(
        `/roles/${id}`,
        role
    );

    return response.data.data;
}

export async function deleteRole(id) {
    const response = await apiClient.delete(
        `/roles/${id}`
    );

    return response.data.data;
}

export async function assignPermissions(
    id,
    permissionIds
) {
    const response = await apiClient.put(
        `/roles/${id}/permissions`,
        { permissionIds }
    );

    return response.data.data;
}