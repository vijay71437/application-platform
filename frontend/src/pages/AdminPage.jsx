import { useAuth } from "../auth/AuthContext";

function AdminPage() {

    const { user } = useAuth();

    return (
        <div>
            <h1>Administration</h1>

            <p>
                Welcome, {user.username}
            </p>

            <p>
                You have administrator access.
            </p>
        </div>
    );
}

export default AdminPage;