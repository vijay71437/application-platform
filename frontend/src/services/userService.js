import apiClient from "../api/apiClient";

export async function getUsers({
    page = 0,
    size = 20,
    sortBy = "createdAt",
    sortDirection = "desc",
    search = "",
} = {}) {

    const response = await apiClient.get("/users", {
        params: {
            page,
            size,
            sortBy,
            sortDirection,
            ...(search ? { search } : {}),
        },
    });

    return response.data.data;
}

export async function getUserById(id) {

    const response = await apiClient.get(
        `/users/${id}`
    );

    return response.data.data;
}

export async function createUser(user) {

    const response = await apiClient.post(
        "/auth/register",
        user
    );

    return response.data.data;
}

export async function updateUser(id, user) {

    const response = await apiClient.put(
        `/users/${id}`,
        user
    );

    return response.data.data;
}

export async function deleteUser(id) {

    const response = await apiClient.delete(
        `/users/${id}`
    );

    return response.data.data;
}

export async function assignRoles(id, roleIds) {

    const response = await apiClient.put(
        `/users/${id}/roles`,
        {
            roleIds,
        }
    );

    return response.data.data;
}