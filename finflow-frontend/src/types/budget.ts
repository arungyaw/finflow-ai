export type Budget = {
    id: number;
    category: string;
    amount: number;
    period: "WEEKLY" | "MONTHLY";
    createdAt: string;
};

export type CreateBudgetRequest = {
    category: string;
    amount: number;
    period: "WEEKLY" | "MONTHLY";
};

export type UpdateBudgetRequest = {
    category: string;
    amount: number;
    period: "WEEKLY" | "MONTHLY";
};