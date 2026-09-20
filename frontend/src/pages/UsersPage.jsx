import { useEffect, useState } from "react";

import { getApiError } from "../api/apiError";
import { getUsers } from "../services/userService";

function UsersPage() {

    const [users, setUsers] = useState([]);

    const [page, setPage] = useState(0);
    const [size] = useState(20);

    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function loadUsers() {

        setLoading(true);
        setError("");

        try {

            const data = await getUsers({
                page,
                size,
                sortBy: "createdAt",
                sortDirection: "desc",
                search,
            });

            setUsers(data.content ?? []);
            setTotalPages(data.totalPages ?? 0);
            setTotalElements(data.totalElements ?? 0);

        } catch (error) {

            const apiError = getApiError(error);

            setError(apiError.message);

        } finally {

            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, [page, search]);

    function handleSearch(event) {

        setPage(0);
        setSearch(event.target.value);
    }

    return (
        <div>

            <h1>Users</h1>

            <div>

                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={handleSearch}
                />

            </div>

            {loading && (
                <p>Loading users...</p>
            )}

            {error && (
                <p>{error}</p>
            )}

            {!loading && !error && (
                <>
                    <p>
                        Total users: {totalElements}
                    </p>

                    <table>

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Roles</th>
                            </tr>
                        </thead>

                        <tbody>

                            {users.map((user) => (
                                <tr key={user.id}>

                                    <td>
                                        {user.id}
                                    </td>

                                    <td>
                                        {user.username}
                                    </td>

                                    <td>
                                        {user.email}
                                    </td>

                                    <td>
                                        {user.firstName}{" "}
                                        {user.lastName}
                                    </td>

                                    <td>
                                        {user.enabled
                                            ? "Active"
                                            : "Inactive"}
                                    </td>

                                    <td>
                                        {user.roles?.join(", ")}
                                    </td>

                                </tr>
                            ))}

                        </tbody>

                    </table>

                    <div>

                        <button
                            disabled={page === 0}
                            onClick={() =>
                                setPage(page - 1)
                            }
                        >
                            Previous
                        </button>

                        <span>
                            {" "}
                            Page {page + 1} of {totalPages}
                            {" "}
                        </span>

                        <button
                            disabled={
                                page + 1 >= totalPages
                            }
                            onClick={() =>
                                setPage(page + 1)
                            }
                        >
                            Next
                        </button>

                    </div>
                </>
            )}

        </div>
    );
}

export default UsersPage;