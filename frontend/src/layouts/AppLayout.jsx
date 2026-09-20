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

                <h2>
                    Application Platform
                </h2>

                <nav>

                    <NavLink to="/">
                        Dashboard
                    </NavLink>

                    {canReadUsers && (
                        <NavLink to="/users">
                            Users
                        </NavLink>
                    )}

                    {isAdmin && (
                        <>
                            <NavLink to="/roles">
                                Roles
                            </NavLink>

                            <NavLink to="/permissions">
                                Permissions
                            </NavLink>

                            <NavLink to="/admin">
                                Administration
                            </NavLink>
                        </>
                    )}

                </nav>

            </aside>

            <main className="main-content">

                <header className="topbar">

                    <span>
                        {user?.username}
                    </span>

                    <button onClick={logout}>
                        Logout
                    </button>

                </header>

                <section className="page-content">
                    <Outlet />
                </section>

            </main>

        </div>
    );
}

export default AppLayout;