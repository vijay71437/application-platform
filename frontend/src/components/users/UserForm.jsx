import { useState } from "react";

import Button from "../ui/Button";
import Card from "../ui/Card";

function UserForm({
    initialValues,
    isEdit = false,
    loading = false,
    onSubmit,
    onCancel,
}) {
    const [form, setForm] = useState({
        username: initialValues?.username ?? "",
        email: initialValues?.email ?? "",
        password: "",
        firstName: initialValues?.firstName ?? "",
        lastName: initialValues?.lastName ?? "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        const payload = isEdit
            ? {
                  email: form.email,
                  firstName: form.firstName,
                  lastName: form.lastName,
              }
            : {
                  username: form.username,
                  email: form.email,
                  password: form.password,
                  firstName: form.firstName,
                  lastName: form.lastName,
              };

        onSubmit(payload);
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card className="form-card">
                <div className="form-section">
                    <div className="form-section-header">
                        <div className="form-section-icon">
                            ◉
                        </div>

                        <div>
                            <h3>Account Details</h3>

                            <p>
                                Basic information used to
                                identify the user.
                            </p>
                        </div>
                    </div>

                    {!isEdit && (
                        <div className="form-grid">
                            <div className="form-field">
                                <label>
                                    Username
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <input
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="Enter username"
                                    required
                                />

                                <span className="field-hint">
                                    Username must be unique.
                                </span>
                            </div>

                            <div className="form-field">
                                <label>
                                    Password
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <div className="password-wrapper">
                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={
                                            form.password
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >
                                        {showPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>
                                </div>

                                <span className="field-hint">
                                    Use a strong password.
                                </span>
                            </div>
                        </div>
                    )}

                    {isEdit && (
                        <div className="form-field">
                            <label>
                                Username
                            </label>

                            <input
                                value={form.username}
                                disabled
                            />

                            <span className="field-hint">
                                Username cannot be changed.
                            </span>
                        </div>
                    )}
                </div>

                <div className="form-divider" />

                <div className="form-section">
                    <div className="form-section-header">
                        <div className="form-section-icon">
                            ◇
                        </div>

                        <div>
                            <h3>Personal Information</h3>

                            <p>
                                Contact and profile
                                information for the user.
                            </p>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-field">
                            <label>
                                First Name
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label>
                                Last Name
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                required
                            />
                        </div>

                        <div className="form-field form-field-full">
                            <label>
                                Email Address
                                <span className="required">
                                    *
                                </span>
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                required
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
                            : isEdit
                            ? "Save Changes"
                            : "Create User"}
                    </Button>
                </div>
            </Card>
        </form>
    );
}

export default UserForm;