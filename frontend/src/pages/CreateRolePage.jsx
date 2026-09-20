import { useState } from "react";
import { useNavigate } from "react-router-dom";

import RoleForm from "../components/roles/RoleForm";
import PageHeader from "../components/ui/PageHeader";

import { getApiError } from "../api/apiError";
import {
    useNotification,
} from "../components/notifications/NotificationContext";
import { createRole } from "../services/roleService";

function CreateRolePage() {
    const notification = useNotification();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(role) {
        setLoading(true);
        setError("");

        try {
            await createRole(role);
            notification.success(
    "Role created successfully."
);
            navigate("/roles");
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
                title="Create Role"
                description="Create a new role for the platform."
            />

            {error && (
                <div className="alert-error form-error">
                    {error}
                </div>
            )}

            <RoleForm
                loading={loading}
                onSubmit={handleSubmit}
                onCancel={() => navigate("/roles")}
            />
        </div>
    );
}

export default CreateRolePage;