import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

import {
    deletePermission,
    getPermissions,
} from "../services/permissionService";

import { getApiError } from "../api/apiError";

import {
    useNotification,
} from "../components/notifications/NotificationContext";

function PermissionsPage() {
    const notification = useNotification();
    const navigate = useNavigate();

    const [permissions, setPermissions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    async function loadPermissions() {
        setLoading(true);
        setError("");

        try {
            const data =
                await getPermissions();

            setPermissions(data ?? []);
        } catch (error) {
            const apiError =
                getApiError(error);

            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPermissions();
    }, []);

    async function handleDelete(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this permission?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deletePermission(id);
            notification.success(
    "Permission deleted successfully."
);
            await loadPermissions();
        } catch (error) {
            const apiError =
                getApiError(error);

            setError(apiError.message);
        }
    }

    return (
        <div>
            <PageHeader
                title="Permissions"
                description="Manage permissions available to platform roles."
                action={
                    <Button
                        onClick={() =>
                            navigate(
                                "/permissions/new"
                            )
                        }
                    >
                        + Create Permission
                    </Button>
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
                    <span>
                        Loading permissions...
                    </span>
                </div>
            )}

            {!loading &&
                !error &&
                permissions.length === 0 && (
                    <Card>
                        <div className="table-state">
                            <div className="empty-icon">
                                ◇
                            </div>

                            <strong>
                                No permissions found
                            </strong>

                            <span>
                                Create a permission to
                                get started.
                            </span>
                        </div>
                    </Card>
                )}

            {!loading &&
                !error &&
                permissions.length > 0 && (
                    <Card>
                        <div className="table-toolbar">
                            <div>
                                <h3 className="section-title">
                                    Permission Directory
                                </h3>

                                <p className="section-description">
                                    Permissions configured
                                    in the platform.
                                </p>
                            </div>

                            <span className="permission-count">
                                {permissions.length}{" "}
                                permissions
                            </span>
                        </div>

                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Permission
                                        </th>

                                        <th>
                                            Description
                                        </th>

                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {permissions.map(
                                        (permission) => (
                                            <tr
                                                key={
                                                    permission.id
                                                }
                                            >
                                                <td>
                                                    <div className="permission-table-cell">
                                                        <div className="permission-table-icon">
                                                            ◇
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {
                                                                    permission.name
                                                                }
                                                            </strong>

                                                            <span>
                                                                ID #
                                                                {
                                                                    permission.id
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    {permission.description ||
                                                        "—"}
                                                </td>

                                                <td>
                                                    <div className="row-actions">
                                                        <button
                                                            className="table-action"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/permissions/${permission.id}/edit`
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="table-action table-action-danger"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    permission.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
        </div>
    );
}

export default PermissionsPage;