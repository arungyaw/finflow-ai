import { useEffect, useState } from "react";

import {
    createAccount,
    depositToAccount,
    getAccounts,
    transferBetweenAccounts,
    withdrawFromAccount,
} from "../services/accountService";

import {
    getBeneficiaries,
    transferToBeneficiary,
} from "../services/beneficiaryService";

import type { Account } from "../types/account";
import type { Beneficiary } from "../types/beneficiary";

import "./AccountsPage.css";

function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

    const [visibleAccountIds, setVisibleAccountIds] = useState<number[]>([]);

    const [accountType, setAccountType] = useState<"CHECKING" | "SAVINGS">(
        "CHECKING"
    );

    const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
        null
    );

    const [depositAmount, setDepositAmount] = useState("");

    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [withdrawCategory, setWithdrawCategory] = useState("OTHER");

    const [destinationAccountNumber, setDestinationAccountNumber] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [transferDescription, setTransferDescription] = useState("");

    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<
        number | null
    >(null);

    const [beneficiaryTransferAmount, setBeneficiaryTransferAmount] =
        useState("");

    const [
        beneficiaryTransferDescription,
        setBeneficiaryTransferDescription,
    ] = useState("");

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        async function loadPageData() {
            setIsLoading(true);
            setError("");

            try {
                const [accountData, beneficiaryData] = await Promise.all([
                    getAccounts(),
                    getBeneficiaries(),
                ]);

                setAccounts(accountData);
                setBeneficiaries(beneficiaryData);

                if (accountData.length > 0) {
                    setSelectedAccountId(accountData[0].id);
                }

                if (beneficiaryData.length > 0) {
                    setSelectedBeneficiaryId(beneficiaryData[0].id);
                }
            } catch (loadError) {
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Unable to load account information"
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadPageData();
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

    async function refreshAccounts() {
        const updatedAccounts = await getAccounts();
        setAccounts(updatedAccounts);
    }

    function beginAction() {
        setError("");
        setSuccessMessage("");
        setIsProcessing(true);
    }

    function getValidAmount(value: string) {
        const parsedAmount = Number(value);

        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            return null;
        }

        return parsedAmount;
    }

    function toggleAccountNumber(accountId: number) {
        setVisibleAccountIds((currentIds) =>
            currentIds.includes(accountId)
                ? currentIds.filter((id) => id !== accountId)
                : [...currentIds, accountId]
        );
    }

    async function handleCreateAccount() {
        setError("");
        setSuccessMessage("");
        setIsCreating(true);

        try {
            const newAccount = await createAccount({
                accountType,
            });

            setAccounts((currentAccounts) => [...currentAccounts, newAccount]);

            if (selectedAccountId === null) {
                setSelectedAccountId(newAccount.id);
            }

            setSuccessMessage("Account created successfully.");
        } catch (accountError) {
            setError(
                accountError instanceof Error
                    ? accountError.message
                    : "Unable to create account"
            );
        } finally {
            setIsCreating(false);
        }
    }

    async function handleDeposit() {
        if (selectedAccountId === null) {
            setError("Select an account.");
            return;
        }

        const amount = getValidAmount(depositAmount);

        if (amount === null) {
            setError("Enter a valid deposit amount.");
            return;
        }

        beginAction();

        try {
            await depositToAccount(selectedAccountId, amount);
            await refreshAccounts();

            setDepositAmount("");
            setSuccessMessage("Deposit completed successfully.");
        } catch (accountError) {
            setError(
                accountError instanceof Error
                    ? accountError.message
                    : "Unable to deposit funds"
            );
        } finally {
            setIsProcessing(false);
        }
    }

    async function handleWithdraw() {
        if (selectedAccountId === null) {
            setError("Select an account.");
            return;
        }

        const amount = getValidAmount(withdrawAmount);

        if (amount === null) {
            setError("Enter a valid withdrawal amount.");
            return;
        }

        beginAction();

        try {
            await withdrawFromAccount(
                selectedAccountId,
                amount,
                withdrawCategory
            );

            await refreshAccounts();

            setWithdrawAmount("");
            setSuccessMessage("Withdrawal completed successfully.");
        } catch (accountError) {
            setError(
                accountError instanceof Error
                    ? accountError.message
                    : "Unable to withdraw funds"
            );
        } finally {
            setIsProcessing(false);
        }
    }

    async function handleTransfer() {
        if (selectedAccountId === null) {
            setError("Select a source account.");
            return;
        }

        if (!destinationAccountNumber.trim()) {
            setError("Enter a destination account number.");
            return;
        }

        const amount = getValidAmount(transferAmount);

        if (amount === null) {
            setError("Enter a valid transfer amount.");
            return;
        }

        beginAction();

        try {
            await transferBetweenAccounts(selectedAccountId, {
                destinationAccountNumber: destinationAccountNumber.trim(),
                amount,
                description: transferDescription.trim(),
            });

            await refreshAccounts();

            setDestinationAccountNumber("");
            setTransferAmount("");
            setTransferDescription("");

            setSuccessMessage("Transfer completed successfully.");
        } catch (accountError) {
            setError(
                accountError instanceof Error
                    ? accountError.message
                    : "Unable to complete transfer"
            );
        } finally {
            setIsProcessing(false);
        }
    }

    async function handleBeneficiaryTransfer() {
        if (selectedAccountId === null) {
            setError("Select a source account.");
            return;
        }

        if (selectedBeneficiaryId === null) {
            setError("Select a beneficiary.");
            return;
        }

        const amount = getValidAmount(beneficiaryTransferAmount);

        if (amount === null) {
            setError("Enter a valid transfer amount.");
            return;
        }

        beginAction();

        try {
            await transferToBeneficiary(selectedAccountId, {
                beneficiaryId: selectedBeneficiaryId,
                amount,
                description: beneficiaryTransferDescription.trim(),
            });

            await refreshAccounts();

            setBeneficiaryTransferAmount("");
            setBeneficiaryTransferDescription("");

            setSuccessMessage("Money sent successfully.");
        } catch (accountError) {
            setError(
                accountError instanceof Error
                    ? accountError.message
                    : "Unable to complete beneficiary transfer"
            );
        } finally {
            setIsProcessing(false);
        }
    }

    if (isLoading) {
        return <p className="accounts-loading">Loading accounts...</p>;
    }

    return (
        <main className="accounts-page">
            {successMessage && (
                <div className="accounts-success-toast">
                    {successMessage}
                </div>
            )}

            <header className="accounts-header">
                <div>
                    <h1>Accounts</h1>
                    <p>Manage your accounts and move money securely.</p>
                </div>
            </header>

            {error && <p className="accounts-error">{error}</p>}

            <section className="create-account-panel">
                <div className="account-field">
                    <label htmlFor="accountType">Account type</label>

                    <select
                        id="accountType"
                        value={accountType}
                        onChange={(changeEvent) =>
                            setAccountType(
                                changeEvent.target.value as "CHECKING" | "SAVINGS"
                            )
                        }
                    >
                        <option value="CHECKING">Checking</option>
                        <option value="SAVINGS">Savings</option>
                    </select>
                </div>

                <button
                    type="button"
                    onClick={handleCreateAccount}
                    disabled={isCreating}
                >
                    {isCreating ? "Creating..." : "Create Account"}
                </button>
            </section>

            <section className="accounts-grid">
                {accounts.length === 0 ? (
                    <div className="accounts-empty">
                        <h2>No accounts yet</h2>
                        <p>Create a checking or savings account to get started.</p>
                    </div>
                ) : (
                    accounts.map((account) => {
                        const isAccountNumberVisible = visibleAccountIds.includes(
                            account.id
                        );

                        return (
                            <article className="account-card" key={account.id}>
                                <div className="account-card-header">
                                    <div>
                    <span className="account-type">
                      {account.accountType === "CHECKING"
                          ? "Checking"
                          : "Savings"}
                    </span>

                                        <div className="account-number-row">
                                            <p>
                                                {isAccountNumberVisible
                                                    ? account.accountNumber
                                                    : `•••• ${account.accountNumber.slice(-4)}`}
                                            </p>

                                            <button
                                                type="button"
                                                className="account-number-toggle"
                                                onClick={() =>
                                                    toggleAccountNumber(account.id)
                                                }
                                            >
                                                {isAccountNumberVisible ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </div>

                                    <span className="account-status">
                    {account.status}
                  </span>
                                </div>

                                <div className="account-balance">
                                    <span>Available balance</span>

                                    <strong>
                                        $
                                        {account.balance.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </strong>
                                </div>
                            </article>
                        );
                    })
                )}
            </section>

            {accounts.length > 0 && (
                <>
                    <section className="account-section">
                        <div className="account-section-header">
                            <h2>Deposit & Withdraw</h2>
                            <p>Add funds or record spending from an account.</p>
                        </div>

                        <div className="money-action-grid">
                            <div className="account-field">
                                <label htmlFor="moneyActionAccount">Account</label>

                                <select
                                    id="moneyActionAccount"
                                    value={selectedAccountId ?? ""}
                                    onChange={(changeEvent) =>
                                        setSelectedAccountId(Number(changeEvent.target.value))
                                    }
                                >
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.accountType} · ••••{" "}
                                            {account.accountNumber.slice(-4)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="money-action-card">
                                <h3>Deposit</h3>

                                <div className="account-field">
                                    <label htmlFor="depositAmount">Amount</label>

                                    <input
                                        id="depositAmount"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={depositAmount}
                                        onChange={(changeEvent) =>
                                            setDepositAmount(changeEvent.target.value)
                                        }
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleDeposit}
                                    disabled={isProcessing}
                                >
                                    Deposit
                                </button>
                            </div>

                            <div className="money-action-card">
                                <h3>Withdraw</h3>

                                <div className="account-field">
                                    <label htmlFor="withdrawAmount">Amount</label>

                                    <input
                                        id="withdrawAmount"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={withdrawAmount}
                                        onChange={(changeEvent) =>
                                            setWithdrawAmount(changeEvent.target.value)
                                        }
                                    />
                                </div>

                                <div className="account-field">
                                    <label htmlFor="withdrawCategory">Category</label>

                                    <select
                                        id="withdrawCategory"
                                        value={withdrawCategory}
                                        onChange={(changeEvent) =>
                                            setWithdrawCategory(changeEvent.target.value)
                                        }
                                    >
                                        <option value="GROCERIES">Groceries</option>
                                        <option value="DINING">Dining</option>
                                        <option value="TRANSPORTATION">Transportation</option>
                                        <option value="SHOPPING">Shopping</option>
                                        <option value="UTILITIES">Utilities</option>
                                        <option value="ENTERTAINMENT">Entertainment</option>
                                        <option value="HEALTHCARE">Healthcare</option>
                                        <option value="HOUSING">Housing</option>
                                        <option value="EDUCATION">Education</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleWithdraw}
                                    disabled={isProcessing}
                                >
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="account-section">
                        <div className="account-section-header">
                            <h2>Transfer Between Accounts</h2>
                            <p>Send money to another FinFlow account.</p>
                        </div>

                        <div className="transfer-form">
                            <div className="account-field">
                                <label htmlFor="transferSourceAccount">From</label>

                                <select
                                    id="transferSourceAccount"
                                    value={selectedAccountId ?? ""}
                                    onChange={(changeEvent) =>
                                        setSelectedAccountId(Number(changeEvent.target.value))
                                    }
                                >
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.accountType} · ••••{" "}
                                            {account.accountNumber.slice(-4)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="account-field">
                                <label htmlFor="destinationAccountNumber">
                                    Destination account number
                                </label>

                                <input
                                    id="destinationAccountNumber"
                                    type="text"
                                    value={destinationAccountNumber}
                                    onChange={(changeEvent) =>
                                        setDestinationAccountNumber(changeEvent.target.value)
                                    }
                                />
                            </div>

                            <div className="account-field">
                                <label htmlFor="transferAmount">Amount</label>

                                <input
                                    id="transferAmount"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={transferAmount}
                                    onChange={(changeEvent) =>
                                        setTransferAmount(changeEvent.target.value)
                                    }
                                />
                            </div>

                            <div className="account-field">
                                <label htmlFor="transferDescription">Description</label>

                                <input
                                    id="transferDescription"
                                    type="text"
                                    placeholder="Optional description"
                                    value={transferDescription}
                                    onChange={(changeEvent) =>
                                        setTransferDescription(changeEvent.target.value)
                                    }
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleTransfer}
                                disabled={isProcessing}
                            >
                                {isProcessing ? "Processing..." : "Transfer"}
                            </button>
                        </div>
                    </section>

                    <section className="account-section">
                        <div className="account-section-header">
                            <h2>Send to Beneficiary</h2>
                            <p>Transfer money to one of your saved beneficiaries.</p>
                        </div>

                        {beneficiaries.length === 0 ? (
                            <p className="beneficiary-empty">
                                You don't have any saved beneficiaries yet.
                            </p>
                        ) : (
                            <div className="transfer-form">
                                <div className="account-field">
                                    <label htmlFor="beneficiarySourceAccount">From</label>

                                    <select
                                        id="beneficiarySourceAccount"
                                        value={selectedAccountId ?? ""}
                                        onChange={(changeEvent) =>
                                            setSelectedAccountId(Number(changeEvent.target.value))
                                        }
                                    >
                                        {accounts.map((account) => (
                                            <option key={account.id} value={account.id}>
                                                {account.accountType} · ••••{" "}
                                                {account.accountNumber.slice(-4)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="account-field">
                                    <label htmlFor="beneficiarySelect">Beneficiary</label>

                                    <select
                                        id="beneficiarySelect"
                                        value={selectedBeneficiaryId ?? ""}
                                        onChange={(changeEvent) =>
                                            setSelectedBeneficiaryId(
                                                Number(changeEvent.target.value)
                                            )
                                        }
                                    >
                                        {beneficiaries.map((beneficiary) => (
                                            <option
                                                key={beneficiary.id}
                                                value={beneficiary.id}
                                            >
                                                {beneficiary.name} · ••••{" "}
                                                {beneficiary.accountNumber.slice(-4)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="account-field">
                                    <label htmlFor="beneficiaryTransferAmount">Amount</label>

                                    <input
                                        id="beneficiaryTransferAmount"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={beneficiaryTransferAmount}
                                        onChange={(changeEvent) =>
                                            setBeneficiaryTransferAmount(
                                                changeEvent.target.value
                                            )
                                        }
                                    />
                                </div>

                                <div className="account-field">
                                    <label htmlFor="beneficiaryTransferDescription">
                                        Description
                                    </label>

                                    <input
                                        id="beneficiaryTransferDescription"
                                        type="text"
                                        placeholder="Optional description"
                                        value={beneficiaryTransferDescription}
                                        onChange={(changeEvent) =>
                                            setBeneficiaryTransferDescription(
                                                changeEvent.target.value
                                            )
                                        }
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleBeneficiaryTransfer}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? "Processing..." : "Send Money"}
                                </button>
                            </div>
                        )}
                    </section>
                </>
            )}
        </main>
    );
}

export default AccountsPage;