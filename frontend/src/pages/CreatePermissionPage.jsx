import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PermissionForm from "../components/permissions/PermissionForm";
import PageHeader from "../components/ui/PageHeader";

import {
    createPermission,
} from "../services/permissionService";

import { getApiError } from "../api/apiError";

function CreatePermissionPage() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(permission) {
        setLoading(true);
        setError("");

        try {
            await createPermission(permission);
            navigate("/permissions");
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
                title="Create Permission"
                description="Create a new permission for the platform."
            />

            {error && (
                <div className="alert-error form-error">
                    {error}
                </div>
            )}

            <PermissionForm
                loading={loading}
                onSubmit={handleSubmit}
                onCancel={() =>
                    navigate("/permissions")
                }
            />
        </div>
    );
}

export default CreatePermissionPage;