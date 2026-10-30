import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Shield,
    Users,
    Wallet,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    ChevronRight,
    CheckCircle2,
    Lock,
    Plus,
} from "lucide-react";

import { useAuth } from "../auth/AuthContext";
import { hasPermission, hasRole } from "../auth/authorization";
import { getAccounts, getMonthlySummary } from "../services/financeService";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import { formatCurrency } from "../utils/formatters";

function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const isAdmin = hasRole(user, "ROLE_ADMIN");
    const canReadUsers = hasPermission(user, "USER_READ");
    const canCreateUsers = hasPermission(user, "USER_CREATE");

    const permissions = user?.permissions ?? [];
    const roles = user?.roles ?? [];

    // Load light finance snapshot
    const [financeData, setFinanceData] = useState({
        totalBalance: 0,
        accountsCount: 0,
        monthlyIncome: 0,
        monthlyExpense: 0,
        loading: true,
    });

    useEffect(() => {
        let mounted = true;
        const now = new Date();
        Promise.all([
            getAccounts().catch(() => []),
            getMonthlySummary(now.getFullYear(), now.getMonth() + 1).catch(() => null),
        ]).then(([accs, summary]) => {
            if (mounted) {
                const total = accs.reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
                setFinanceData({
                    totalBalance: total,
                    accountsCount: accs.length,
                    monthlyIncome: Number(summary?.totalIncome) || 0,
                    monthlyExpense: Number(summary?.totalExpense) || 0,
                    loading: false,
                });
            }
        });
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div>
            <PageHeader
                title={`Welcome back, ${user?.username}`}
                description="Comprehensive platform control center, security roles, and finance services."
                action={
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/finance")}
                            icon={Wallet}
                        >
                            Open Finance Hub
                        </Button>
                        {canCreateUsers && (
                            <Button
                                variant="primary"
                                onClick={() => navigate("/users/new")}
                                icon={Plus}
                            >
                                Create User
                            </Button>
                        )}
                    </div>
                }
            />

            {/* Core Overview cards */}
            <div className="dashboard-grid">
                <Card className="dashboard-card">
                    <div className="dashboard-card-icon icon-purple">
                        <Lock size={20} />
                    </div>
                    <div>
                        <span className="dashboard-card-label">Account Security</span>
                        <strong className="dashboard-card-value">Active</strong>
                        <span className="dashboard-card-description">
                            JWT authenticated & secured
                        </span>
                    </div>
                </Card>

                <Card className="dashboard-card">
                    <div className="dashboard-card-icon icon-blue">
                        <Shield size={20} />
                    </div>
                    <div>
                        <span className="dashboard-card-label">Roles</span>
                        <strong className="dashboard-card-value">{roles.length}</strong>
                        <span className="dashboard-card-description">
                            Roles assigned to your account
                        </span>
                    </div>
                </Card>

                <Card className="dashboard-card">
                    <div className="dashboard-card-icon icon-green">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <span className="dashboard-card-label">Permissions</span>
                        <strong className="dashboard-card-value">{permissions.length}</strong>
                        <span className="dashboard-card-description">
                            Granted platform privileges
                        </span>
                    </div>
                </Card>
            </div>

            {/* Personal Finance Snapshot Card */}
            <Card style={{ marginBottom: "24px" }} className="finance-overview-card">
                <div className="dashboard-section-header">
                    <div>
                        <h3>Personal Finance Summary</h3>
                        <p>Quick snapshot of your integrated finance service balances.</p>
                    </div>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate("/finance")}
                    >
                        Finance Details <ChevronRight size={14} />
                    </Button>
                </div>

                <div className="finance-mini-stat-grid">
                    <div className="finance-mini-stat">
                        <span className="text-muted">Total Accounts Balance</span>
                        <strong style={{ fontSize: "20px", color: "#0f172a" }}>
                            {formatCurrency(financeData.totalBalance)}
                        </strong>
                        <span className="stat-hint">
                            {financeData.accountsCount} active account(s)
                        </span>
                    </div>

                    <div className="finance-mini-stat">
                        <span className="text-muted">Month Inflow (Income)</span>
                        <strong style={{ fontSize: "20px", color: "#10b981" }}>
                            +{formatCurrency(financeData.monthlyIncome)}
                        </strong>
                        <span className="stat-hint">This month</span>
                    </div>

                    <div className="finance-mini-stat">
                        <span className="text-muted">Month Outflow (Expense)</span>
                        <strong style={{ fontSize: "20px", color: "#ef4444" }}>
                            -{formatCurrency(financeData.monthlyExpense)}
                        </strong>
                        <span className="stat-hint">This month</span>
                    </div>

                    <div className="finance-mini-stat">
                        <span className="text-muted">Quick Access</span>
                        <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate("/finance/transactions")}
                            >
                                + Record Expense
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate("/finance/accounts")}
                            >
                                Accounts
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="dashboard-columns">
                {/* Account profile */}
                <Card>
                    <div className="dashboard-section-header">
                        <div>
                            <h3>Profile Details</h3>
                            <p>Current platform credentials.</p>
                        </div>
                    </div>

                    <div className="profile-summary">
                        <div className="large-avatar">
                            {user?.username?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                            <h2>{user?.username}</h2>
                            <span>{user?.roles?.[0] ?? "Platform User"}</span>
                        </div>
                    </div>

                    <div className="info-list">
                        <div className="info-row">
                            <span>User ID</span>
                            <strong>#{user?.userId}</strong>
                        </div>
                        <div className="info-row">
                            <span>Username</span>
                            <strong>{user?.username}</strong>
                        </div>
                        <div className="info-row">
                            <span>Access Level</span>
                            <Badge variant={isAdmin ? "purple" : "info"}>
                                {isAdmin ? "ADMINISTRATOR" : "USER"}
                            </Badge>
                        </div>
                    </div>
                </Card>

                {/* Assigned Roles */}
                <Card>
                    <div className="dashboard-section-header">
                        <div>
                            <h3>Assigned Roles</h3>
                            <p>Authorizations controlling access.</p>
                        </div>
                    </div>

                    {roles.length > 0 ? (
                        <div className="dashboard-role-list">
                            {roles.map((role) => (
                                <div className="dashboard-role" key={role}>
                                    <div className="role-icon">
                                        <Shield size={16} />
                                    </div>
                                    <div>
                                        <strong>{role}</strong>
                                        <span>System role</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="dashboard-empty">No roles assigned.</div>
                    )}
                </Card>
            </div>

            {/* Permissions */}
            <Card className="permissions-card" style={{ marginTop: "24px" }}>
                <div className="dashboard-section-header">
                    <div>
                        <h3>Permissions Catalog</h3>
                        <p>Capabilities available to your identity token.</p>
                    </div>
                    <span className="permission-count">{permissions.length} total</span>
                </div>

                {permissions.length > 0 ? (
                    <div className="permission-grid">
                        {permissions.map((permission) => (
                            <div className="permission-item" key={permission}>
                                <span className="permission-check">
                                    <CheckCircle2 size={14} />
                                </span>
                                <span>{permission}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="dashboard-empty">No permissions assigned.</div>
                )}
            </Card>

            {/* Quick Actions */}
            <Card className="quick-actions-card" style={{ marginTop: "24px" }}>
                <div className="dashboard-section-header">
                    <div>
                        <h3>Management Shortcuts</h3>
                        <p>Common administrative and navigation operations.</p>
                    </div>
                </div>

                <div className="quick-actions">
                    <Button
                        variant="primary"
                        onClick={() => navigate("/finance")}
                        icon={Wallet}
                    >
                        Finance Hub
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => navigate("/finance/transactions")}
                        icon={TrendingUp}
                    >
                        Log Transactions
                    </Button>
                    {canReadUsers && (
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/users")}
                            icon={Users}
                        >
                            Manage Users
                        </Button>
                    )}
                    {isAdmin && (
                        <>
                            <Button
                                variant="secondary"
                                onClick={() => navigate("/roles")}
                                icon={Shield}
                            >
                                Roles
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => navigate("/permissions")}
                                icon={Lock}
                            >
                                Permissions
                            </Button>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default DashboardPage;
