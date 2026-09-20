import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getApiError } from "../api/apiError";
import { deleteUser, getUsers } from "../services/userService";

import { useAuth } from "../auth/AuthContext";
import { hasPermission } from "../auth/authorization";

import {
    useNotification,
} from "../components/notifications/NotificationContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

function UsersPage() {
    const notification = useNotification();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);

    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const canCreate = hasPermission(
        user,
        "USER_CREATE"
    );

    const canUpdate = hasPermission(
        user,
        "USER_UPDATE"
    );

    const canDelete = hasPermission(
        user,
        "USER_DELETE"
    );

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
        setSearch(event.target.value);
        setPage(0);
    }

    async function handleDeactivate(id) {
        const confirmed = window.confirm(
            "Are you sure you want to deactivate this user?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteUser(id);
            notification.success(
    "User deactivated successfully."
);
            await loadUsers();
        } catch (error) {
            const apiError = getApiError(error);
            setError(apiError.message);
        }
    }

    return (
        <div>
            <PageHeader
                title="Users"
                description="Manage platform users, access and account status."
                action={
                    canCreate && (
                        <Button
                            onClick={() =>
                                navigate("/users/new")
                            }
                        >
                            + Create User
                        </Button>
                    )
                }
            />

            <div className="stats-grid">
                <Card className="stat-card">
                    <div className="stat-label">
                        Total Users
                    </div>

                    <div className="stat-value">
                        {totalElements}
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-label">
                        Current Page
                    </div>

                    <div className="stat-value">
                        {page + 1}
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-label">
                        Page Size
                    </div>

                    <div className="stat-value">
                        {size}
                    </div>
                </Card>
            </div>

            <Card>
                <div className="table-toolbar">
                    <div>
                        <h3 className="section-title">
                            User Directory
                        </h3>

                        <p className="section-description">
                            Search and manage registered users.
                        </p>
                    </div>

                    <div className="search-wrapper">
                        <span className="search-icon">
                            ⌕
                        </span>

                        <input
                            className="search-input"
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                {error && (
                    <div className="alert-error">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="table-state">
                        <div className="spinner" />
                        <span>
                            Loading users...
                        </span>
                    </div>
                )}

                {!loading &&
                    !error &&
                    users.length === 0 && (
                        <div className="table-state">
                            <div className="empty-icon">
                                ♙
                            </div>

                            <strong>
                                No users found
                            </strong>

                            <span>
                                Try changing your search
                                criteria.
                            </span>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    users.length > 0 && (
                        <>
                            <div className="table-container">
                                <table className="data-table users-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Name</th>
                                            <th>Status</th>
                                            <th>Roles</th>
                                            <th className="actions-column">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {users.map(
                                            (currentUser) => (
                                                <tr
                                                    key={
                                                        currentUser.id
                                                    }
                                                >
                                                    <td>
                                                        <div className="user-cell">
                                                            <div className="table-avatar">
                                                                {currentUser.username
                                                                    ?.charAt(
                                                                        0
                                                                    )
                                                                    ?.toUpperCase()}
                                                            </div>

                                                            <div>
                                                                <strong>
                                                                    {
                                                                        currentUser.username
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    ID #
                                                                    {
                                                                        currentUser.id
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {
                                                            currentUser.email
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            currentUser.firstName
                                                        }{" "}
                                                        {
                                                            currentUser.lastName
                                                        }
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={
                                                                currentUser.enabled
                                                                    ? "status-badge status-active"
                                                                    : "status-badge status-inactive"
                                                            }
                                                        >
                                                            <span className="status-dot" />
                                                            {currentUser.enabled
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="role-list">
                                                            {currentUser.roles?.map(
                                                                (
                                                                    role
                                                                ) => (
                                                                    <span
                                                                        className="role-badge"
                                                                        key={
                                                                            role
                                                                        }
                                                                    >
                                                                        {
                                                                            role
                                                                        }
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="row-actions">
                                                            {canUpdate && (
        <>
            <button
                className="table-action"
                onClick={() =>
                    navigate(
                        `/users/${currentUser.id}/edit`
                    )
                }
            >
                Edit
            </button>

            <button
                className="table-action"
                onClick={() =>
                    navigate(
                        `/users/${currentUser.id}/roles`
                    )
                }
            >
                Roles
            </button>
        </>
    )}
                                                            

                                                            {canDelete &&
                                                                currentUser.enabled && (
                                                                    <button
                                                                        className="table-action table-action-danger"
                                                                        onClick={() =>
                                                                            handleDeactivate(
                                                                                currentUser.id
                                                                            )
                                                                        }
                                                                    >
                                                                        Deactivate
                                                                    </button>
                                                                )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="pagination">
                                <span className="pagination-info">
                                    Page {page + 1} of{" "}
                                    {totalPages}
                                </span>

                                <div className="pagination-actions">
                                    <Button
                                        variant="secondary"
                                        disabled={
                                            page === 0
                                        }
                                        onClick={() =>
                                            setPage(
                                                page - 1
                                            )
                                        }
                                    >
                                        Previous
                                    </Button>

                                    <Button
                                        variant="secondary"
                                        disabled={
                                            page + 1 >=
                                            totalPages
                                        }
                                        onClick={() =>
                                            setPage(
                                                page + 1
                                            )
                                        }
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
            </Card>
        </div>
    );
}

export default UsersPage;