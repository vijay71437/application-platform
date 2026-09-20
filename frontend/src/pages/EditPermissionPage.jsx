import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import PermissionForm from "../components/permissions/PermissionForm";
import PageHeader from "../components/ui/PageHeader";

import {
    getPermissionById,
    updatePermission,
} from "../services/permissionService";

import { getApiError } from "../api/apiError";

function EditPermissionPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [permission, setPermission] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        async function loadPermission() {
            try {
                const data =
                    await getPermissionById(id);

                setPermission(data);
            } catch (error) {
                const apiError =
                    getApiError(error);

                setError(apiError.message);
            } finally {
                setLoading(false);
            }
        }

        loadPermission();
    }, [id]);

    async function handleSubmit(updatedPermission) {
        setSaving(true);
        setError("");

        try {
            await updatePermission(
                id,
                updatedPermission
            );

            navigate("/permissions");
        } catch (error) {
            const apiError =
                getApiError(error);

            setError(apiError.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner" />
                <span>
                    Loading permission...
                </span>
            </div>
        );
    }

    if (!permission) {
        return (
            <div className="alert-error">
                {error || "Permission not found."}
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Edit Permission"
                description={`Update ${permission.name}.`}
            />

            {error && (
                <div className="alert-error form-error">
                    {error}
                </div>
            )}

            <PermissionForm
                initialValues={permission}
                loading={saving}
                onSubmit={handleSubmit}
                onCancel={() =>
                    navigate("/permissions")
                }
            />
        </div>
    );
}

export default EditPermissionPage;