export type Transaction = {
    id: number;
    transactionType:
        | "DEPOSIT"
        | "WITHDRAWAL"
        | "TRANSFER_IN"
        | "TRANSFER_OUT";
    category: string;
    amount: number;
    description: string;
    referenceNumber: string;
    createdAt: string;
};