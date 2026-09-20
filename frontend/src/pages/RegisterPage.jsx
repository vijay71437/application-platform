import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getApiError } from "../api/apiError";
import { register } from "../services/authService";

import "./LoginPage.css";

function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!form.username.trim()) {
            setError("Username is required.");
            return;
        }

        if (!form.email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!form.password) {
            setError("Password is required.");
            return;
        }

        if (form.password.length < 8) {
            setError(
                "Password must be at least 8 characters."
            );
            return;
        }

        if (
            form.password !==
            form.confirmPassword
        ) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await register({
                username: form.username.trim(),
                email: form.email.trim(),
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                password: form.password,
            });

            setSuccess(
                "Account created successfully. You can now sign in."
            );

            setTimeout(() => {
                navigate("/login", {
                    replace: true,
                });
            }, 1200);

        } catch (error) {
            const apiError = getApiError(error);

            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">

            {/* Brand section */}
            <section className="auth-brand-panel">
                <div className="auth-brand-content">

                    <div className="auth-brand-logo">
                        A
                    </div>

                    <h1>
                        Join the
                        <br />
                        Platform
                    </h1>

                    <p>
                        Create your account and get
                        access to the Application Platform.
                    </p>

                    <div className="auth-feature-list">

                        <div className="auth-feature">
                            <span className="auth-feature-icon">
                                ✓
                            </span>

                            <span>
                                Secure account management
                            </span>
                        </div>

                        <div className="auth-feature">
                            <span className="auth-feature-icon">
                                ◈
                            </span>

                            <span>
                                Role-based permissions
                            </span>
                        </div>

                        <div className="auth-feature">
                            <span className="auth-feature-icon">
                                ◉
                            </span>

                            <span>
                                Centralized platform access
                            </span>
                        </div>

                    </div>
                </div>
            </section>

            {/* Register section */}
            <section className="auth-form-panel">
                <div className="auth-card">

                    <div className="auth-card-header">
                        <h2>
                            Create account
                        </h2>

                        <p>
                            Enter your details to create
                            your platform account.
                        </p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <span className="auth-error-icon">
                                !
                            </span>

                            <span>
                                {error}
                            </span>
                        </div>
                    )}

                    {success && (
                        <div
                            className="auth-error"
                            style={{
                                borderColor: "#bbf7d0",
                                background: "#f0fdf4",
                                color: "#15803d",
                            }}
                        >
                            <span className="auth-error-icon">
                                ✓
                            </span>

                            <span>
                                {success}
                            </span>
                        </div>
                    )}

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="auth-form-row">

                            <div className="auth-field">
                                <label htmlFor="firstName">
                                    First name
                                </label>

                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    className="auth-input"
                                    autoComplete="given-name"
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="lastName">
                                    Last name
                                </label>

                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    className="auth-input"
                                    autoComplete="family-name"
                                />
                            </div>

                        </div>

                        <div className="auth-field">
                            <label htmlFor="username">
                                Username
                            </label>

                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                className="auth-input"
                                autoComplete="username"
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="email">
                                Email address
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="auth-input"
                                autoComplete="email"
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="auth-input-wrapper">

                                <input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    className="auth-input password-input"
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            (current) =>
                                                !current
                                        )
                                    }
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="confirmPassword">
                                Confirm password
                            </label>

                            <div className="auth-input-wrapper">

                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        form.confirmPassword
                                    }
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    className="auth-input password-input"
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (current) =>
                                                !current
                                        )
                                    }
                                >
                                    {showConfirmPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating account..."
                                : "Create account"}
                        </button>

                    </form>

                    <div className="auth-footer">
                        Already have an account?{" "}
                        <button
                            type="button"
                            className="auth-link"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Sign in
                        </button>
                    </div>

                    <div className="auth-security-note">
                        Your account is protected by the
                        platform's security controls.
                    </div>

                </div>
            </section>

        </div>
    );
}

export default RegisterPage;