import { apiRequest } from "./api";
import type { Transaction } from "../types/transaction";

export function getAccountTransactions(accountId: number) {
    return apiRequest<Transaction[]>(
        `/api/accounts/${accountId}/transactions`
    );
}