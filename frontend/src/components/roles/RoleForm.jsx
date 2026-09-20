import { useEffect, useState } from "react";

import Button from "../ui/Button";
import Card from "../ui/Card";

function RoleForm({
    initialValues,
    loading = false,
    onSubmit,
    onCancel,
}) {
    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    useEffect(() => {
        if (initialValues) {
            setForm({
                name: initialValues.name ?? "",
                description:
                    initialValues.description ?? "",
            });
        }
    }, [initialValues]);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        onSubmit(form);
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card className="form-card role-form-card">
                <div className="form-section">
                    <div className="form-section-header">
                        <div className="form-section-icon">
                            ◈
                        </div>

                        <div>
                            <h3>Role Information</h3>

                            <p>
                                Define the role and describe
                                its purpose.
                            </p>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-field">
                            <label>
                                Role Name
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. ROLE_MANAGER"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>
                                Description
                            </label>

                            <input
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe this role"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : initialValues
                            ? "Save Changes"
                            : "Create Role"}
                    </Button>
                </div>
            </Card>
        </form>
    );
}

export default RoleForm;