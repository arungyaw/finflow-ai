import { useEffect, useState } from "react";

import {
    createBeneficiary,
    deleteBeneficiary,
    getBeneficiaries,
} from "../services/beneficiaryService";

import type { Beneficiary } from "../types/beneficiary";

import "./BeneficiariesPage.css";

function BeneficiariesPage() {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

    const [name, setName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const [deletingBeneficiaryId, setDeletingBeneficiaryId] = useState<
        number | null
    >(null);

    useEffect(() => {
        async function loadBeneficiaries() {
            setIsLoading(true);
            setError("");

            try {
                const beneficiaryData = await getBeneficiaries();
                setBeneficiaries(beneficiaryData);
            } catch (beneficiaryError) {
                setError(
                    beneficiaryError instanceof Error
                        ? beneficiaryError.message
                        : "Unable to load beneficiaries"
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadBeneficiaries();
    }, []);

    useEffect(() => {
        if (!successMessage) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setSuccessMessage("");
        }, 3000);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [successMessage]);

    async function handleCreateBeneficiary() {
        const trimmedName = name.trim();
        const trimmedAccountNumber = accountNumber.trim();

        if (!trimmedName) {
            setError("Enter a beneficiary name.");
            return;
        }

        if (!trimmedAccountNumber) {
            setError("Enter an account number.");
            return;
        }

        setError("");
        setSuccessMessage("");
        setIsCreating(true);

        try {
            const newBeneficiary = await createBeneficiary({
                name: trimmedName,
                accountNumber: trimmedAccountNumber,
            });

            setBeneficiaries((currentBeneficiaries) => [
                newBeneficiary,
                ...currentBeneficiaries,
            ]);

            setName("");
            setAccountNumber("");

            setSuccessMessage("Beneficiary added successfully.");
        } catch (beneficiaryError) {
            setError(
                beneficiaryError instanceof Error
                    ? beneficiaryError.message
                    : "Unable to add beneficiary"
            );
        } finally {
            setIsCreating(false);
        }
    }

    async function handleDeleteBeneficiary(beneficiaryId: number) {
        setError("");
        setSuccessMessage("");
        setDeletingBeneficiaryId(beneficiaryId);

        try {
            await deleteBeneficiary(beneficiaryId);

            setBeneficiaries((currentBeneficiaries) =>
                currentBeneficiaries.filter(
                    (beneficiary) => beneficiary.id !== beneficiaryId
                )
            );

            setSuccessMessage("Beneficiary deleted successfully.");
        } catch (beneficiaryError) {
            setError(
                beneficiaryError instanceof Error
                    ? beneficiaryError.message
                    : "Unable to delete beneficiary"
            );
        } finally {
            setDeletingBeneficiaryId(null);
        }
    }

    if (isLoading) {
        return (
            <p className="beneficiaries-loading">
                Loading beneficiaries...
            </p>
        );
    }

    return (
        <main className="beneficiaries-page">
            {successMessage && (
                <div className="beneficiaries-success-toast">
                    {successMessage}
                </div>
            )}

            <header className="beneficiaries-header">
                <div>
                    <h1>Beneficiaries</h1>
                    <p>Save trusted accounts for faster transfers.</p>
                </div>
            </header>

            {error && <p className="beneficiaries-error">{error}</p>}

            <section className="beneficiary-form-panel">
                <div className="beneficiary-form-field">
                    <label htmlFor="beneficiaryName">Name</label>

                    <input
                        id="beneficiaryName"
                        type="text"
                        placeholder="Beneficiary name"
                        value={name}
                        onChange={(changeEvent) =>
                            setName(changeEvent.target.value)
                        }
                    />
                </div>

                <div className="beneficiary-form-field">
                    <label htmlFor="beneficiaryAccount">
                        Account number
                    </label>

                    <input
                        id="beneficiaryAccount"
                        type="text"
                        inputMode="numeric"
                        placeholder="Account number"
                        value={accountNumber}
                        onChange={(changeEvent) =>
                            setAccountNumber(changeEvent.target.value)
                        }
                    />
                </div>

                <button
                    type="button"
                    onClick={handleCreateBeneficiary}
                    disabled={isCreating}
                >
                    {isCreating ? "Adding..." : "Add Beneficiary"}
                </button>
            </section>

            {beneficiaries.length === 0 ? (
                <section className="beneficiaries-empty">
                    <h2>No beneficiaries yet</h2>
                    <p>
                        Add a beneficiary above to make future transfers easier.
                    </p>
                </section>
            ) : (
                <section className="beneficiaries-grid">
                    {beneficiaries.map((beneficiary) => (
                        <article
                            className="beneficiary-card"
                            key={beneficiary.id}
                        >
                            <div className="beneficiary-details">
                                <div className="beneficiary-avatar">
                                    {beneficiary.name.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <h2>{beneficiary.name}</h2>

                                    <p>
                                        Account · ••••{" "}
                                        {beneficiary.accountNumber.slice(-4)}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    handleDeleteBeneficiary(beneficiary.id)
                                }
                                disabled={
                                    deletingBeneficiaryId === beneficiary.id
                                }
                            >
                                {deletingBeneficiaryId === beneficiary.id
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}

export default BeneficiariesPage;