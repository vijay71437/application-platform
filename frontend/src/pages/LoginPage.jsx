import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getApiError } from "../api/apiError";
import { useAuth } from "../auth/AuthContext";

import "./LoginPage.css";

function LoginPage() {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (!form.username.trim()) {
            setError("Username is required.");
            return;
        }

        if (!form.password) {
            setError("Password is required.");
            return;
        }

        try {
            setLoading(true);

            await login(
                form.username.trim(),
                form.password
            );

            navigate("/", { replace: true });
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
                        Application
                        <br />
                        Platform
                    </h1>

                    <p>
                        A secure and reusable platform
                        foundation for modern applications.
                    </p>

                    <div className="auth-feature-list">

                        <div className="auth-feature">
                            <span className="auth-feature-icon">
                                ✓
                            </span>

                            <span>
                                Secure authentication
                            </span>
                        </div>

                        <div className="auth-feature">
                            <span className="auth-feature-icon">
                                ◈
                            </span>

                            <span>
                                Role-based access control
                            </span>
                        </div>

                        <div className="auth-feature">
                            <span className="auth-feature-icon">
                                ◉
                            </span>

                            <span>
                                Centralized user management
                            </span>
                        </div>

                    </div>
                </div>
            </section>

            {/* Login section */}
            <section className="auth-form-panel">
                <div className="auth-card">

                    <div className="auth-card-header">
                        <h2>
                            Welcome back
                        </h2>

                        <p>
                            Sign in to continue to your
                            Application Platform account.
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

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

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
                                placeholder="Enter your username"
                                className="auth-input"
                                autoComplete="username"
                                autoFocus
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
                                    placeholder="Enter your password"
                                    className="auth-input password-input"
                                    autoComplete="current-password"
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

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign in"}
                        </button>

                    </form>

                    <div className="auth-footer">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            className="auth-link"
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Create an account
                        </button>
                    </div>

                    <div className="auth-security-note">
                        Your connection is secured and
                        protected by the platform.
                    </div>

                </div>
            </section>

        </div>
    );
}

export default LoginPage;