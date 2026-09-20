import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import {
    hasPermission,
    hasRole,
} from "../auth/authorization";

import "./AppLayout.css";

function AppLayout() {
    const { user, logout } = useAuth();

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const canReadUsers =
        hasPermission(user, "USER_READ");

    const isAdmin =
        hasRole(user, "ROLE_ADMIN");

    function closeSidebar() {
        setSidebarOpen(false);
    }

    return (
        <div className="app-layout">
            {/* Mobile overlay */}

            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}

            <aside
                className={`sidebar ${
                    sidebarOpen
                        ? "sidebar-open"
                        : ""
                }`}
            >
                <div className="sidebar-brand">
                    <div className="brand-icon">
                        A
                    </div>

                    <div className="brand-text">
                        <h2>Application</h2>
                        <span>Platform</span>
                    </div>

                    <button
                        className="sidebar-close"
                        onClick={closeSidebar}
                        aria-label="Close menu"
                    >
                        ×
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <span className="nav-section-title">
                            MAIN
                        </span>

                        <NavLink
                            to="/"
                            className="nav-link"
                            onClick={closeSidebar}
                        >
                            <span className="nav-icon">
                                ▦
                            </span>

                            <span className="nav-label">
                                Dashboard
                            </span>
                        </NavLink>

                        {canReadUsers && (
                            <NavLink
                                to="/users"
                                className="nav-link"
                                onClick={closeSidebar}
                            >
                                <span className="nav-icon">
                                    ♙
                                </span>

                                <span className="nav-label">
                                    Users
                                </span>
                            </NavLink>
                        )}
                    </div>

                    {isAdmin && (
                        <div className="nav-section">
                            <span className="nav-section-title">
                                ADMINISTRATION
                            </span>

                            <NavLink
                                to="/roles"
                                className="nav-link"
                                onClick={closeSidebar}
                            >
                                <span className="nav-icon">
                                    ◈
                                </span>

                                <span className="nav-label">
                                    Roles
                                </span>
                            </NavLink>

                            <NavLink
                                to="/permissions"
                                className="nav-link"
                                onClick={closeSidebar}
                            >
                                <span className="nav-icon">
                                    ◇
                                </span>

                                <span className="nav-label">
                                    Permissions
                                </span>
                            </NavLink>

                            <NavLink
                                to="/admin"
                                className="nav-link"
                                onClick={closeSidebar}
                            >
                                <span className="nav-icon">
                                    ⚙
                                </span>

                                <span className="nav-label">
                                    Administration
                                </span>
                            </NavLink>
                        </div>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-mini">
                        <div className="avatar">
                            {user?.username
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                        <div className="user-mini-info">
                            <strong>
                                {user?.username}
                            </strong>

                            <span>
                                {user?.roles?.[0] ??
                                    "User"}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main */}

            <main className="main-content">
                <header className="topbar">
                    <div className="topbar-left">
                        <button
                            className="menu-button"
                            onClick={() =>
                                setSidebarOpen(
                                    true
                                )
                            }
                            aria-label="Open menu"
                        >
                            <span />
                            <span />
                            <span />
                        </button>

                        <span className="topbar-title">
                            Application Platform
                        </span>
                    </div>

                    <div className="topbar-actions">
                        <div className="topbar-user-info">
                            <div className="topbar-avatar">
                                {user?.username
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </div>

                            <span>
                                {user?.username}
                            </span>
                        </div>

                        <button
                            className="logout-button"
                            onClick={logout}
                        >
                            Logout
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