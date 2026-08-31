export type Account = {
    id: number;
    accountNumber: string;
    accountType: "CHECKING" | "SAVINGS";
    balance: number;
    status: string;
    createdAt: string;
};

export type CreateAccountRequest = {
    accountType: "CHECKING" | "SAVINGS";
};

export type TransferRequest = {
    destinationAccountNumber: string;
    amount: number;
    description: string;
};