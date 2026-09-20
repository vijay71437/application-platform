import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { hasPermission, hasRole } from "../auth/authorization";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const isAdmin = hasRole(user, "ROLE_ADMIN");

    const canReadUsers = hasPermission(
        user,
        "USER_READ"
    );

    const canCreateUsers = hasPermission(
        user,
        "USER_CREATE"
    );

    const permissions = user?.permissions ?? [];
    const roles = user?.roles ?? [];

    return (
        <div>
            <PageHeader
                title={`Welcome back, ${user?.username}`}
                description="Here's an overview of your Application Platform account."
            />

            {/* Overview cards */}

            <div className="dashboard-grid">
                <Card className="dashboard-card">
                    <div className="dashboard-card-icon icon-purple">
                        ♙
                    </div>

                    <div>
                        <span className="dashboard-card-label">
                            Account
                        </span>

                        <strong className="dashboard-card-value">
                            Active
                        </strong>

                        <span className="dashboard-card-description">
                            Your account is currently active
                        </span>
                    </div>
                </Card>

                <Card className="dashboard-card">
                    <div className="dashboard-card-icon icon-blue">
                        ◈
                    </div>

                    <div>
                        <span className="dashboard-card-label">
                            Roles
                        </span>

                        <strong className="dashboard-card-value">
                            {roles.length}
                        </strong>

                        <span className="dashboard-card-description">
                            Roles assigned to your account
                        </span>
                    </div>
                </Card>

                <Card className="dashboard-card">
                    <div className="dashboard-card-icon icon-green">
                        ✓
                    </div>

                    <div>
                        <span className="dashboard-card-label">
                            Permissions
                        </span>

                        <strong className="dashboard-card-value">
                            {permissions.length}
                        </strong>

                        <span className="dashboard-card-description">
                            Available platform permissions
                        </span>
                    </div>
                </Card>
            </div>

            <div className="dashboard-columns">
                {/* Account information */}

                <Card>
                    <div className="dashboard-section-header">
                        <div>
                            <h3>Account Information</h3>
                            <p>
                                Your current platform profile.
                            </p>
                        </div>
                    </div>

                    <div className="profile-summary">
                        <div className="large-avatar">
                            {user?.username
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                        <div>
                            <h2>{user?.username}</h2>
                            <span>
                                Platform User
                            </span>
                        </div>
                    </div>

                    <div className="info-list">
                        <div className="info-row">
                            <span>User ID</span>
                            <strong>
                                #{user?.userId}
                            </strong>
                        </div>

                        <div className="info-row">
                            <span>Username</span>
                            <strong>
                                {user?.username}
                            </strong>
                        </div>

                        <div className="info-row">
                            <span>Account Status</span>

                            <span className="status-badge status-active">
                                <span className="status-dot" />
                                Active
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Roles */}

                <Card>
                    <div className="dashboard-section-header">
                        <div>
                            <h3>Assigned Roles</h3>
                            <p>
                                Roles currently assigned to
                                your account.
                            </p>
                        </div>
                    </div>

                    {roles.length > 0 ? (
                        <div className="dashboard-role-list">
                            {roles.map((role) => (
                                <div
                                    className="dashboard-role"
                                    key={role}
                                >
                                    <div className="role-icon">
                                        ◈
                                    </div>

                                    <div>
                                        <strong>
                                            {role}
                                        </strong>

                                        <span>
                                            Access role
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="dashboard-empty">
                            No roles assigned.
                        </div>
                    )}
                </Card>
            </div>

            {/* Permissions */}

            <Card className="permissions-card">
                <div className="dashboard-section-header">
                    <div>
                        <h3>Permissions</h3>
                        <p>
                            Capabilities available to your
                            account.
                        </p>
                    </div>

                    <span className="permission-count">
                        {permissions.length} total
                    </span>
                </div>

                {permissions.length > 0 ? (
                    <div className="permission-grid">
                        {permissions.map(
                            (permission) => (
                                <div
                                    className="permission-item"
                                    key={permission}
                                >
                                    <span className="permission-check">
                                        ✓
                                    </span>

                                    <span>
                                        {permission}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <div className="dashboard-empty">
                        No permissions assigned.
                    </div>
                )}
            </Card>

            {/* Quick actions */}

            <Card className="quick-actions-card">
                <div className="dashboard-section-header">
                    <div>
                        <h3>Quick Actions</h3>
                        <p>
                            Common platform operations.
                        </p>
                    </div>
                </div>

                <div className="quick-actions">
                    {canReadUsers && (
                        <Button
                            variant="secondary"
                            onClick={() =>
                                navigate("/users")
                            }
                        >
                            Manage Users
                        </Button>
                    )}

                    {canCreateUsers && (
                        <Button
                            onClick={() =>
                                navigate("/users/new")
                            }
                        >
                            Create User
                        </Button>
                    )}

                    {isAdmin && (
                        <>
                            <Button
                                variant="secondary"
                                onClick={() =>
                                    navigate("/roles")
                                }
                            >
                                Manage Roles
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={() =>
                                    navigate(
                                        "/permissions"
                                    )
                                }
                            >
                                View Permissions
                            </Button>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default DashboardPage;