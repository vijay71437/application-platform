import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import PageHeader from "../components/ui/PageHeader";
import UserForm from "../components/users/UserForm";

import {
    getUserById,
    updateUser,
} from "../services/userService";

import { getApiError } from "../api/apiError";
import {
    useNotification,
} from "../components/notifications/NotificationContext";

function EditUserPage() {
    const notification = useNotification();
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadUser() {
            try {
                const data = await getUserById(id);
                setUser(data);
            } catch (error) {
                const apiError = getApiError(error);
                setError(apiError.message);
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, [id]);

    async function handleSubmit(updatedUser) {
        setSaving(true);
        setError("");

        try {
            await updateUser(id, updatedUser);
            notification.success(
    "User updated successfully."
);
            navigate("/users");
        } catch (error) {
            const apiError = getApiError(error);
            setError(apiError.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner" />
                <span>Loading user...</span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="alert-error">
                {error || "User not found."}
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Edit User"
                description={`Update information for ${user.username}.`}
            />

            {error && (
                <div className="alert-error form-error">
                    {error}
                </div>
            )}

            <UserForm
                initialValues={user}
                isEdit={true}
                loading={saving}
                onSubmit={handleSubmit}
                onCancel={() => navigate("/users")}
            />
        </div>
    );
}

export default EditUserPage;