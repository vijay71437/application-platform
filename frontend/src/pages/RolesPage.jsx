import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

import { useAuth } from "../auth/AuthContext";
import { hasPermission } from "../auth/authorization";

import {
    deleteRole,
    getRoles,
} from "../services/roleService";

import { getApiError } from "../api/apiError";
import { useNotification } from "../components/notifications/NotificationContext";

function RolesPage() {
    const notification = useNotification();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const canCreate = hasPermission(
        user,
        "ROLE_CREATE"
    );

    const canUpdate = hasPermission(
        user,
        "ROLE_UPDATE"
    );

    const canDelete = hasPermission(
        user,
        "ROLE_DELETE"
    );

    async function loadRoles() {
        setLoading(true);
        setError("");

        try {
            const data = await getRoles();
            setRoles(data ?? []);
        } catch (error) {
            const apiError = getApiError(error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRoles();
    }, []);

    async function handleDelete(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this role?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteRole(id);
            notification.success(
    "Role deleted successfully."
);
            await loadRoles();
        } catch (error) {
            const apiError = getApiError(error);
            setError(apiError.message);
        }
    }

    return (
        <div>
            <PageHeader
                title="Roles"
                description="Manage application roles and access."
                action={
                    canCreate && (
                        <Button
                            onClick={() =>
                                navigate("/roles/new")
                            }
                        >
                            + Create Role
                        </Button>
                    )
                }
            />

            {error && (
                <div className="alert-error form-error">
                    {error}
                </div>
            )}

            {loading && (
                <div className="page-loading">
                    <div className="spinner" />
                    <span>Loading roles...</span>
                </div>
            )}

            {!loading &&
                !error &&
                roles.length === 0 && (
                    <Card>
                        <div className="table-state">
                            <div className="empty-icon">
                                ◈
                            </div>

                            <strong>
                                No roles found
                            </strong>

                            <span>
                                Create a role to get started.
                            </span>
                        </div>
                    </Card>
                )}

            {!loading &&
                !error &&
                roles.length > 0 && (
                    <Card>
                        <div className="table-toolbar">
                            <div>
                                <h3 className="section-title">
                                    Role Directory
                                </h3>

                                <p className="section-description">
                                    Roles configured in the
                                    platform.
                                </p>
                            </div>

                            <span className="permission-count">
                                {roles.length} roles
                            </span>
                        </div>

                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Role</th>
                                        <th>Description</th>
                                        <th>
                                            Permissions
                                        </th>
                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {roles.map((role) => (
                                        <tr
                                            key={role.id}
                                        >
                                            <td>
                                                <div className="role-table-cell">
                                                    <div className="role-icon">
                                                        ◈
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {
                                                                role.name
                                                            }
                                                        </strong>

                                                        <span>
                                                            ID #
                                                            {
                                                                role.id
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                {role.description ||
                                                    "—"}
                                            </td>

                                            <td>
                                                <span className="permission-count">
                                                    {role
                                                        .permissions
                                                        ?.length ??
                                                        0}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="row-actions">
                                                    
                                                        <button
                                                            className="table-action"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/roles/${role.id}/edit`
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>
                                                   
                                                    <button
    className="table-action"
    onClick={() =>
        navigate(
            `/roles/${role.id}/permissions`
        )
    }
>
    Permissions
</button>

                                              
                                                        <button
                                                            className="table-action table-action-danger"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    role.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                  
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
        </div>
    );
}

export default RolesPage;