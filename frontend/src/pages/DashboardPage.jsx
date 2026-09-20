import { useAuth } from "../auth/AuthContext";

function DashboardPage() {

    const { user } = useAuth();

    return (
        <div>

            <h1>Dashboard</h1>

            <p>
                Welcome, {user.username}
            </p>

            <p>
                User ID: {user.userId}
            </p>

            <p>
                Roles: {user.roles.join(", ")}
            </p>

            <p>
                Permissions:
                {" "}
                {user.permissions.join(", ")}
            </p>

        </div>
    );
}

export default DashboardPage;