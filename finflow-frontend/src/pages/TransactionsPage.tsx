import { useEffect, useState } from "react";

import { getAccounts } from "../services/accountService";
import { getAccountTransactions } from "../services/transactionService";

import type { Account } from "../types/account";
import type { Transaction } from "../types/transaction";

import "./TransactionsPage.css";

function TransactionsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
        null
    );

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [typeFilter, setTypeFilter] = useState("ALL");
    const [categoryFilter, setCategoryFilter] = useState("ALL");

    const [error, setError] = useState("");
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

    useEffect(() => {
        async function loadAccounts() {
            setIsLoadingAccounts(true);
            setError("");

            try {
                const accountData = await getAccounts();

                setAccounts(accountData);

                if (accountData.length > 0) {
                    setSelectedAccountId(accountData[0].id);
                }
            } catch (accountError) {
                setError(
                    accountError instanceof Error
                        ? accountError.message
                        : "Unable to load accounts"
                );
            } finally {
                setIsLoadingAccounts(false);
            }
        }

        loadAccounts();
    }, []);

    useEffect(() => {
        if (selectedAccountId === null) {
            setTransactions([]);
            return;
        }

        async function loadTransactions() {
            setIsLoadingTransactions(true);
            setError("");

            try {
                const transactionData = await getAccountTransactions(
                    selectedAccountId!
                );

                setTransactions(transactionData);
            } catch (transactionError) {
                setError(
                    transactionError instanceof Error
                        ? transactionError.message
                        : "Unable to load transactions"
                );
            } finally {
                setIsLoadingTransactions(false);
            }
        }

        loadTransactions();
    }, [selectedAccountId]);

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesType =
            typeFilter === "ALL" ||
            transaction.transactionType === typeFilter;

        const matchesCategory =
            categoryFilter === "ALL" ||
            transaction.category === categoryFilter;

        return matchesType && matchesCategory;
    });

    if (isLoadingAccounts) {
        return <p className="transactions-loading">Loading transactions...</p>;
    }

    return (
        <main className="transactions-page">
            <header className="transactions-header">
                <div>
                    <h1>Transactions</h1>
                    <p>Review and filter activity across your accounts.</p>
                </div>
            </header>

            {error && <p className="transactions-error">{error}</p>}

            {accounts.length === 0 ? (
                <section className="transactions-empty-panel">
                    <h2>No accounts available</h2>
                    <p>Create an account before viewing transactions.</p>
                </section>
            ) : (
                <>
                    <section className="transactions-filter-panel">
                        <div className="transaction-filter-field">
                            <label htmlFor="transactionAccount">Account</label>

                            <select
                                id="transactionAccount"
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

                        <div className="transaction-filter-field">
                            <label htmlFor="transactionType">Type</label>

                            <select
                                id="transactionType"
                                value={typeFilter}
                                onChange={(changeEvent) =>
                                    setTypeFilter(changeEvent.target.value)
                                }
                            >
                                <option value="ALL">All types</option>
                                <option value="DEPOSIT">Deposit</option>
                                <option value="WITHDRAWAL">Withdrawal</option>
                                <option value="TRANSFER_IN">Transfer In</option>
                                <option value="TRANSFER_OUT">Transfer Out</option>
                            </select>
                        </div>

                        <div className="transaction-filter-field">
                            <label htmlFor="transactionCategory">Category</label>

                            <select
                                id="transactionCategory"
                                value={categoryFilter}
                                onChange={(changeEvent) =>
                                    setCategoryFilter(changeEvent.target.value)
                                }
                            >
                                <option value="ALL">All categories</option>
                                <option value="INCOME">Income</option>
                                <option value="GROCERIES">Groceries</option>
                                <option value="DINING">Dining</option>
                                <option value="TRANSPORTATION">Transportation</option>
                                <option value="SHOPPING">Shopping</option>
                                <option value="UTILITIES">Utilities</option>
                                <option value="ENTERTAINMENT">Entertainment</option>
                                <option value="HEALTHCARE">Healthcare</option>
                                <option value="HOUSING">Housing</option>
                                <option value="EDUCATION">Education</option>
                                <option value="TRANSFER">Transfer</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                    </section>

                    <section className="transactions-panel">
                        {isLoadingTransactions ? (
                            <p className="transactions-loading">
                                Loading account activity...
                            </p>
                        ) : (
                            <div className="transactions-table-wrapper">
                                <table className="transactions-table">
                                    <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Category</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {filteredTransactions.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="transactions-empty"
                                            >
                                                No transactions match your current filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTransactions.map((transaction) => (
                                            <tr key={transaction.id}>
                                                <td>
                                                    {new Date(
                                                        transaction.createdAt
                                                    ).toLocaleDateString()}
                                                </td>

                                                <td>
                                                    {transaction.description || "Transaction"}
                                                </td>

                                                <td>
                                                    {transaction.category
                                                        .replaceAll("_", " ")
                                                        .toLowerCase()
                                                        .replace(/\b\w/g, (letter) =>
                                                            letter.toUpperCase()
                                                        )}
                                                </td>

                                                <td>
                                                    {transaction.transactionType
                                                        .replaceAll("_", " ")
                                                        .toLowerCase()
                                                        .replace(/\b\w/g, (letter) =>
                                                            letter.toUpperCase()
                                                        )}
                                                </td>

                                                <td className="transaction-amount">
                                                    $
                                                    {transaction.amount.toLocaleString("en-US", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </>
            )}
        </main>
    );
}

export default TransactionsPage;