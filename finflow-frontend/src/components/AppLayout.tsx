import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { removeAccessToken } from "../services/authStorage";
import { getCurrentUser } from "../services/userService";

import type { CurrentUser } from "../types/user";

import "./AppLayout.css";

function AppLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(
        null
    );

    const navigate = useNavigate();

    useEffect(() => {
        async function loadCurrentUser() {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
            } catch {
                setCurrentUser(null);
            }
        }

        loadCurrentUser();
    }, []);

    function handleLogout() {
        removeAccessToken();
        setIsMenuOpen(false);
        navigate("/login");
    }

    function closeMenu() {
        setIsMenuOpen(false);
    }

    const userInitials = currentUser
        ? `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`
            .toUpperCase()
        : "?";

    return (
        <div className="app-layout">
            <header className="mobile-header">
                <h2>FinFlow AI</h2>

                <button
                    type="button"
                    className="menu-button"
                    onClick={() =>
                        setIsMenuOpen((currentValue) => !currentValue)
                    }
                    aria-label="Toggle navigation"
                    aria-expanded={isMenuOpen}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </header>

            {isMenuOpen && (
                <button
                    type="button"
                    className="sidebar-overlay"
                    aria-label="Close navigation"
                    onClick={closeMenu}
                />
            )}

            <aside
                className={`app-sidebar ${
                    isMenuOpen ? "app-sidebar-open" : ""
                }`}
            >
                <div>
                    <div className="sidebar-brand">
                        <h2>FinFlow AI</h2>

                        <button
                            type="button"
                            className="sidebar-close"
                            onClick={closeMenu}
                            aria-label="Close navigation"
                        >
                            ×
                        </button>
                    </div>

                    <nav>
                        <NavLink to="/dashboard" onClick={closeMenu}>
                            Dashboard
                        </NavLink>

                        <NavLink to="/accounts" onClick={closeMenu}>
                            Accounts
                        </NavLink>

                        <NavLink to="/transactions" onClick={closeMenu}>
                            Transactions
                        </NavLink>

                        <NavLink to="/budgets" onClick={closeMenu}>
                            Budgets
                        </NavLink>

                        <NavLink to="/beneficiaries" onClick={closeMenu}>
                            Beneficiaries
                        </NavLink>
                    </nav>
                </div>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">
                            {userInitials}
                        </div>

                        <div className="sidebar-user-details">
                            {currentUser ? (
                                <>
                                    <strong>
                                        {currentUser.firstName} {currentUser.lastName}
                                    </strong>

                                    <span>{currentUser.email}</span>
                                </>
                            ) : (
                                <span>Signed in</span>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </aside>

            <main className="app-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;