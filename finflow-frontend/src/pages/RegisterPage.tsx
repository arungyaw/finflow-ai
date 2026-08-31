import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../services/authService";

import "./AuthPage.css";

function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    return (
        <main className="auth-page">
            <section className="auth-card">
                <h1>Create your account</h1>
                <p>Start managing your finances with FinFlow AI.</p>

                <form
                    className="auth-form"
                    onSubmit={async (submitEvent) => {
                        submitEvent.preventDefault();

                        setError("");
                        setIsLoading(true);

                        try {
                            await register({
                                firstName,
                                lastName,
                                email,
                                password,
                            });

                            navigate("/login");
                        } catch (registerError) {
                            setError(
                                registerError instanceof Error
                                    ? registerError.message
                                    : "Unable to create account"
                            );
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                >
                    <div className="auth-field">
                        <label htmlFor="firstName">First name</label>

                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            autoComplete="given-name"
                            value={firstName}
                            onChange={(changeEvent) =>
                                setFirstName(changeEvent.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="lastName">Last name</label>

                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            autoComplete="family-name"
                            value={lastName}
                            onChange={(changeEvent) =>
                                setLastName(changeEvent.target.value)
                            }
                            required
                        />
                    </div>

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
                                autoComplete="new-password"
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
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>

                    <p className="auth-switch">
                        Already have an account?{" "}
                        <Link to="/login">Sign in</Link>
                    </p>
                </form>
            </section>
        </main>
    );
}

export default RegisterPage;