import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/ui/PageHeader";
import UserForm from "../components/users/UserForm";

import { getApiError } from "../api/apiError";
import {
    useNotification,
} from "../components/notifications/NotificationContext";
import { createUser } from "../services/userService";

function CreateUserPage() {
    const navigate = useNavigate();
    const notification = useNotification();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(user) {
        setLoading(true);
        setError("");

        try {
            await createUser(user);
            notification.success(
    "User created successfully."
);
            navigate("/users");
        } catch (error) {
            const apiError = getApiError(error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <PageHeader
                title="Create User"
                description="Create a new user account for the platform."
            />

            {error && (
                <div className="alert-error form-error">
                    {error}
                </div>
            )}

            <UserForm
                isEdit={false}
                loading={loading}
                onSubmit={handleSubmit}
                onCancel={() => navigate("/users")}
            />
        </div>
    );
}

export default CreateUserPage;