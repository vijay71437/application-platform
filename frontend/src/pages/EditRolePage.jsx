import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import RoleForm from "../components/roles/RoleForm";
import PageHeader from "../components/ui/PageHeader";

import {
    useNotification,
} from "../components/notifications/NotificationContext";
import {
    getRoleById,
    updateRole,
} from "../services/roleService";

import { getApiError } from "../api/apiError";

function EditRolePage() {
    const notification = useNotification();
    const { id } = useParams();
    const navigate = useNavigate();

    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadRole() {
            try {
                const data = await getRoleById(id);
                setRole(data);
            } catch (error) {
                const apiError = getApiError(error);
                setError(apiError.message);
            } finally {
                setLoading(false);
            }
        }

        loadRole();
    }, [id]);

    async function handleSubmit(updatedRole) {
        setSaving(true);
        setError("");

        try {
            await updateRole(id, updatedRole);
            notification.success(
    "Role updated successfully."
);
            navigate("/roles");
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
                <span>Loading role...</span>
            </div>
        );
    }

    if (!role) {
        return (
            <div className="alert-error">
                {error || "Role not found."}
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Edit Role"
                description={`Update ${role.name}.`}
            />

            {error && (
                <div className="alert-error form-error">
                    {error}
                </div>
            )}

            <RoleForm
                initialValues={role}
                loading={saving}
                onSubmit={handleSubmit}
                onCancel={() => navigate("/roles")}
            />
        </div>
    );
}

export default EditRolePage;