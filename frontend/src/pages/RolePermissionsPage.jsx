import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

import {
    assignPermissions,
    getRoleById,
} from "../services/roleService";

import { getApiError } from "../api/apiError";
import {
    useNotification,
} from "../components/notifications/NotificationContext";
import { getPermissions } from "../services/permissionService";

function RolePermissionsPage() {
    const notification = useNotification();
    const { id } = useParams();
    const navigate = useNavigate();

    const [role, setRole] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] =
        useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const [roleData, permissionData] =
                    await Promise.all([
                        getRoleById(id),
                        getPermissions(),
                    ]);

                setRole(roleData);
                setPermissions(permissionData ?? []);

                const assignedIds =
                    roleData.permissions?.map(
                        (permission) =>
                            typeof permission === "object"
                                ? permission.id
                                : permission
                    ) ?? [];

                setSelectedPermissions(assignedIds);
            } catch (error) {
                const apiError = getApiError(error);
                setError(apiError.message);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

    function togglePermission(permissionId) {
        setSelectedPermissions((current) => {
            if (current.includes(permissionId)) {
                return current.filter(
                    (id) => id !== permissionId
                );
            }

            return [...current, permissionId];
        });
    }

    function selectAll() {
        setSelectedPermissions(
            permissions.map((permission) => permission.id)
        );
    }

    function clearAll() {
        setSelectedPermissions([]);
    }

    async function handleSave() {
        setSaving(true);
        setError("");

        try {
            await assignPermissions(
                id,
                selectedPermissions
            );
            notification.success(
    "Role permissions updated successfully."
);

            navigate("/roles");
        } catch (error) {
            const apiError = getApiError(error);
            setError(apiError.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner" />
                <span>
                    Loading permissions...
                </span>
            </div>
        );
    }

    if (!role) {
        return (
            <div className="alert-error">
                {error || "Role not found."}
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Role Permissions"
                description={`Manage permissions assigned to ${role.name}.`}
            />

            {error && (
                <div className="alert-error form-error">
                    {error}
                </div>
            )}

            <Card>
                <div className="permission-page-header">
                    <div className="role-detail">
                        <div className="role-detail-icon">
                            ◈
                        </div>

                        <div>
                            <h2>{role.name}</h2>

                            <p>
                                {role.description ||
                                    "Manage access permissions for this role."}
                            </p>
                        </div>
                    </div>

                    <div className="permission-summary">
                        <strong>
                            {selectedPermissions.length}
                        </strong>

                        <span>
                            of {permissions.length} selected
                        </span>
                    </div>
                </div>

                <div className="permission-toolbar">
                    <div>
                        <strong>
                            Available Permissions
                        </strong>

                        <span>
                            Select the permissions this role
                            should have.
                        </span>
                    </div>

                    <div className="permission-toolbar-actions">
                        <button
                            className="table-action"
                            onClick={selectAll}
                            type="button"
                        >
                            Select All
                        </button>

                        <button
                            className="table-action"
                            onClick={clearAll}
                            type="button"
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                <div className="permission-selection-grid">
                    {permissions.map((permission) => {
                        const selected =
                            selectedPermissions.includes(
                                permission.id
                            );

                        return (
                            <button
                                type="button"
                                key={permission.id}
                                className={`permission-selection ${
                                    selected
                                        ? "permission-selection-selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    togglePermission(
                                        permission.id
                                    )
                                }
                            >
                                <div
                                    className={`permission-selection-icon ${
                                        selected
                                            ? "permission-selected-icon"
                                            : ""
                                    }`}
                                >
                                    {selected ? "✓" : "◇"}
                                </div>

                                <div className="permission-selection-content">
                                    <strong>
                                        {permission.name}
                                    </strong>

                                    <span>
                                        {permission.description ||
                                            "Platform permission"}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {permissions.length === 0 && (
                    <div className="table-state">
                        <div className="empty-icon">
                            ◇
                        </div>

                        <strong>
                            No permissions available
                        </strong>

                        <span>
                            Create permissions before
                            assigning them to a role.
                        </span>
                    </div>
                )}

                <div className="form-actions">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate("/roles")}
                        disabled={saving}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Permissions"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default RolePermissionsPage;