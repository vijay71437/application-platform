import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

import {
    assignRoles,
    getUserById,
} from "../services/userService";

import { getApiError } from "../api/apiError";
import {
    useNotification,
} from "../components/notifications/NotificationContext";
import { getRoles } from "../services/roleService";

function UserRolesPage() {
    const notification = useNotification();
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] =
        useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const [userData, rolesData] =
                    await Promise.all([
                        getUserById(id),
                        getRoles(),
                    ]);

                setUser(userData);
                setRoles(rolesData ?? []);

                const assignedRoleIds =
                    userData.roles?.map((role) => {
                        if (typeof role === "object") {
                            return role.id;
                        }

                        const matchingRole =
                            rolesData.find(
                                (item) =>
                                    item.name === role
                            );

                        return matchingRole?.id;
                    }).filter(Boolean) ?? [];

                setSelectedRoles(assignedRoleIds);
            } catch (error) {
                const apiError = getApiError(error);
                setError(apiError.message);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

    function toggleRole(roleId) {
        setSelectedRoles((current) => {
            if (current.includes(roleId)) {
                return current.filter(
                    (currentId) =>
                        currentId !== roleId
                );
            }

            return [...current, roleId];
        });
    }

    function selectAll() {
        setSelectedRoles(
            roles.map((role) => role.id)
        );
    }

    function clearAll() {
        setSelectedRoles([]);
    }

    async function handleSave() {
        setSaving(true);
        setError("");

        try {
            await assignRoles(id, selectedRoles);
            notification.success(
    "User roles updated successfully."
);
            navigate("/users");
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
                <span>Loading roles...</span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="alert-error">
                {error || "User not found."}
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="User Roles"
                description={`Manage roles assigned to ${user.username}.`}
            />

            {error && (
                <div className="alert-error form-error">
                    {error}
                </div>
            )}

            <Card>
                <div className="permission-page-header">
                    <div className="role-detail">
                        <div className="large-avatar">
                            {user.username
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                        <div>
                            <h2>{user.username}</h2>

                            <p>
                                Select the roles this user
                                should have.
                            </p>
                        </div>
                    </div>

                    <div className="permission-summary">
                        <strong>
                            {selectedRoles.length}
                        </strong>

                        <span>
                            of {roles.length} selected
                        </span>
                    </div>
                </div>

                <div className="permission-toolbar">
                    <div>
                        <strong>
                            Available Roles
                        </strong>

                        <span>
                            Select one or more roles for
                            this user.
                        </span>
                    </div>

                    <div className="permission-toolbar-actions">
                        <button
                            className="table-action"
                            type="button"
                            onClick={selectAll}
                        >
                            Select All
                        </button>

                        <button
                            className="table-action"
                            type="button"
                            onClick={clearAll}
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                <div className="permission-selection-grid">
                    {roles.map((role) => {
                        const selected =
                            selectedRoles.includes(
                                role.id
                            );

                        return (
                            <button
                                key={role.id}
                                type="button"
                                className={`permission-selection ${
                                    selected
                                        ? "permission-selection-selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    toggleRole(role.id)
                                }
                            >
                                <div
                                    className={`permission-selection-icon ${
                                        selected
                                            ? "permission-selected-icon"
                                            : ""
                                    }`}
                                >
                                    {selected
                                        ? "✓"
                                        : "◈"}
                                </div>

                                <div className="permission-selection-content">
                                    <strong>
                                        {role.name}
                                    </strong>

                                    <span>
                                        {role.description ||
                                            "Application role"}
                                    </span>

                                    <small>
                                        {role.permissions
                                            ?.length ??
                                            0}{" "}
                                        permissions
                                    </small>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {roles.length === 0 && (
                    <div className="table-state">
                        <div className="empty-icon">
                            ◈
                        </div>

                        <strong>
                            No roles available
                        </strong>

                        <span>
                            Create a role before assigning
                            one to this user.
                        </span>
                    </div>
                )}

                <div className="form-actions">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate("/users")}
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
                            : "Save Roles"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default UserRolesPage;