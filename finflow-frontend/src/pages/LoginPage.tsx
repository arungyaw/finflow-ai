import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../services/authService";
import { saveAccessToken } from "../services/authStorage";

import "./AuthPage.css";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    return (
        <main className="auth-page">
            <section className="auth-card">
                <h1>FinFlow AI</h1>
                <p>Sign in to manage your finances.</p>

                <form
                    className="auth-form"
                    onSubmit={async (submitEvent) => {
                        submitEvent.preventDefault();

                        setError("");
                        setIsLoading(true);

                        try {
                            const response = await login({
                                email,
                                password,
                            });

                            saveAccessToken(response.token);
                            navigate("/dashboard");
                        } catch (loginError) {
                            setError(
                                loginError instanceof Error
                                    ? loginError.message
                                    : "Unable to sign in"
                            );
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                >
                    <div className="auth-field">
                        <label htmlFor="email">Email</label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(changeEvent) => setEmail(changeEvent.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Password</label>

                        <div className="password-input-wrapper">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                value={password}
                                onChange={(changeEvent) =>
                                    setPassword(changeEvent.target.value)
                                }
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword((currentValue) => !currentValue)
                                }
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "◉" : "◉"}
                            </button>
                        </div>
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button
                        className="auth-submit"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>

                    <p className="auth-switch">
                        Don't have an account?{" "}
                        <Link to="/register">Create an account</Link>
                    </p>
                </form>
            </section>
        </main>
    );
}

export default LoginPage;