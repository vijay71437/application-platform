import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Shield,
    Key,
    Settings,
    Wallet,
    CreditCard,
    Receipt,
    Tags,
    CalendarClock,
    LogOut,
    Menu,
    X,
} from "lucide-react";

import { useAuth } from "../auth/AuthContext";
import { hasPermission, hasRole } from "../auth/authorization";

import "./AppLayout.css";

function AppLayout() {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isAdmin = hasRole(user, "ROLE_ADMIN");
    const canReadUsers = hasPermission(user, "USER_READ");

    function closeSidebar() {
        setSidebarOpen(false);
    }

    return (
        <div className="app-layout">
            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <Wallet size={18} />
                    </div>

                    <div className="brand-text">
                        <h2>Platform</h2>
                        <span>Enterprise & Finance</span>
                    </div>

                    <button
                        className="sidebar-close"
                        onClick={closeSidebar}
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {/* CORE OVERVIEW */}
                    <div className="nav-section">
                        <span className="nav-section-title">CORE PLATFORM</span>

                        <NavLink
                            to="/"
                            end
                            className="nav-link"
                            onClick={closeSidebar}
                        >
                            <span className="nav-icon">
                                <LayoutDashboard size={18} />
                            </span>
                            <span className="nav-label">Dashboard</span>
                        </NavLink>

                        {canReadUsers && (
                            <NavLink
                                to="/users"
                                className="nav-link"
                                onClick={closeSidebar}
                            >
                                <span className="nav-icon">
                                    <Users size={18} />
                                </span>
                                <span className="nav-label">Users</span>
                            </NavLink>
                        )}
                    </div>

                    {/* PERSONAL FINANCE MODULE */}
                    <div className="nav-section">
                        <span className="nav-section-title">FINANCE SERVICES</span>

                        <NavLink
                            to="/finance"
                            end
                            className="nav-link"
                            onClick={closeSidebar}
                        >
                            <span className="nav-icon">
                                <Wallet size={18} />
                            </span>
                            <span className="nav-label">Finance Hub</span>
                        </NavLink>

                        <NavLink
                            to="/finance/accounts"
                            className="nav-link"
                            onClick={closeSidebar}
                        >
                            <span className="nav-icon">
                                <CreditCard size={18} />
                            </span>
                            <span className="nav-label">Accounts</span>
                        </NavLink>

                        <NavLink
                            to="/finance/transactions"
                            className="nav-link"
                            onClick={closeSidebar}
                        >
                            <span className="nav-icon">
                                <Receipt size={18} />
                            </span>
                            <span className="nav-label">Transactions</span>
                        </NavLink>

                        <NavLink
                            to="/finance/categories"
                            className="nav-link"
                            onClick={closeSidebar}
                        >
                            <span className="nav-icon">
                                <Tags size={18} />
                            </span>
                            <span className="nav-label">Categories</span>
                        </NavLink>

                        <NavLink
                            to="/finance/recurring"
                            className="nav-link"
                            onClick={closeSidebar}
                        >
                            <span className="nav-icon">
                                <CalendarClock size={18} />
                            </span>
                            <span className="nav-label">Recurring & Bills</span>
                        </NavLink>
                    </div>

                    {/* ADMINISTRATION */}
                    {isAdmin && (
                        <div className="nav-section">
                            <span className="nav-section-title">ADMINISTRATION</span>

                            <NavLink
                                to="/roles"
                                className="nav-link"
                                onClick={closeSidebar}
                            >
                                <span className="nav-icon">
                                    <Shield size={18} />
                                </span>
                                <span className="nav-label">Roles</span>
                            </NavLink>

                            <NavLink
                                to="/permissions"
                                className="nav-link"
                                onClick={closeSidebar}
                            >
                                <span className="nav-icon">
                                    <Key size={18} />
                                </span>
                                <span className="nav-label">Permissions</span>
                            </NavLink>

                            <NavLink
                                to="/admin"
                                className="nav-link"
                                onClick={closeSidebar}
                            >
                                <span className="nav-icon">
                                    <Settings size={18} />
                                </span>
                                <span className="nav-label">Settings</span>
                            </NavLink>
                        </div>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-mini">
                        <div className="avatar">
                            {user?.username?.charAt(0)?.toUpperCase()}
                        </div>

                        <div className="user-mini-info">
                            <strong>{user?.username}</strong>
                            <span>{user?.roles?.[0] ?? "Platform User"}</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <main className="main-content">
                <header className="topbar">
                    <div className="topbar-left">
                        <button
                            className="menu-button"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={20} />
                        </button>

                        <span className="topbar-title">Application Platform</span>
                    </div>

                    <div className="topbar-actions">
                        <div className="topbar-user-info">
                            <div className="topbar-avatar">
                                {user?.username?.charAt(0)?.toUpperCase()}
                            </div>
                            <span className="topbar-username">{user?.username}</span>
                        </div>

                        <button
                            className="logout-button"
                            onClick={logout}
                            title="Sign out of account"
                        >
                            <LogOut size={16} />
                            <span className="logout-text">Logout</span>
                        </button>
                    </div>
                </header>

                <section className="page-content">
                    <Outlet />
                </section>
            </main>
        </div>
    );
}

export default AppLayout;
