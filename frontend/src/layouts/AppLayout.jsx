import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
    hasPermission,
    hasRole,
} from "../auth/authorization";
import "./AppLayout.css";

function AppLayout() {
    const { user, logout } = useAuth();

    const canReadUsers =
        hasPermission(user, "USER_READ");

    const isAdmin =
        hasRole(user, "ROLE_ADMIN");

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="brand-icon">A</div>

                    <div>
                        <h2>Application</h2>
                        <span>Platform</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <span className="nav-section-title">
                            MAIN
                        </span>

                        <NavLink
                            to="/"
                            className="nav-link"
                        >
                            <span>▦</span>
                            Dashboard
                        </NavLink>

                        {canReadUsers && (
                            <NavLink
                                to="/users"
                                className="nav-link"
                            >
                                <span>♙</span>
                                Users
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
                            >
                                <span>◈</span>
                                Roles
                            </NavLink>

                            <NavLink
                                to="/permissions"
                                className="nav-link"
                            >
                                <span>◇</span>
                                Permissions
                            </NavLink>

                            <NavLink
                                to="/admin"
                                className="nav-link"
                            >
                                <span>⚙</span>
                                Administration
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

                        <div>
                            <strong>{user?.username}</strong>
                            <span>
                                {user?.roles?.[0] ?? "User"}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <div>
                        <span className="topbar-title">
                            Application Platform
                        </span>
                    </div>

                    <div className="topbar-actions">
                        <span className="topbar-user">
                            {user?.username}
                        </span>

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