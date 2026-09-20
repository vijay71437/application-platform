import { useAuth } from "../auth/AuthContext";

function DashboardPage() {

    const {
        user,
        logout,
    } = useAuth();

    return (
        <div>

            <h1>Application Platform</h1>

            <h2>Dashboard</h2>

            <p>
                Welcome, {user.username}
            </p>

            <p>
                User ID: {user.userId}
            </p>

            <p>
                Roles: {user.roles.join(", ")}
            </p>

            <button onClick={logout}>
                Logout
            </button>

        </div>
    );
}

export default DashboardPage;